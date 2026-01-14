import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query, ID } from 'node-appwrite';

// GET - List user's workout logs
export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { databases } = createAdminClient();
    
    const logs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workoutLogsCollectionId,
      [
        Query.equal('userId', user.$id),
        Query.orderDesc('workoutDate'),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    // Get sets for each log
    const logsWithSets = await Promise.all(
      logs.documents.map(async (log) => {
        const sets = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.workoutLogSetsCollectionId,
          [
            Query.equal('workoutLogId', log.$id),
            Query.orderAsc('setNumber'),
          ]
        );

        return { ...log, sets: sets.documents };
      })
    );

    return NextResponse.json({
      success: true,
      logs: logsWithSets,
      total: logs.total,
    });
  } catch (error) {
    console.error('Workout logs fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST - Create a new workout log
export async function POST(request) {
  try {
    const { user } = await requireValidMembership();

    const data = await request.json();
    const { 
      workoutDate, 
      planId, 
      planName,
      durationMinutes, 
      notes, 
      rating, 
      mood,
      sets 
    } = data;

    if (!sets || sets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one set is required' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    
    // Calculate totals
    let totalVolume = 0;
    const exerciseIds = new Set();
    
    for (const set of sets) {
      if (set.weight && set.reps) {
        totalVolume += set.weight * set.reps;
      }
      exerciseIds.add(set.exerciseId);
    }

    // Create the workout log
    const log = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutLogsCollectionId,
      ID.unique(),
      {
        userId: user.$id,
        workoutDate: workoutDate || new Date().toISOString(),
        planId: planId || null,
        planName: planName || null,
        durationMinutes: durationMinutes || null,
        totalVolume,
        exerciseCount: exerciseIds.size,
        rating: rating || null,
        mood: mood || null,
        notes: notes || '',
        createdAt: new Date().toISOString(),
      }
    );

    // Add sets to the log
    await Promise.all(
      sets.map(async (set, index) => {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.workoutLogSetsCollectionId,
          ID.unique(),
          {
            workoutLogId: log.$id,
            exerciseId: set.exerciseId,
            exerciseName: set.exerciseName || 'Unknown Exercise',
            setNumber: set.setNumber || index + 1,
            weight: set.weight || null,
            reps: set.reps || null,
            duration: set.duration || null,
            distance: set.distance || null,
            setType: set.setType || 'normal',
            rpe: set.rpe || null,
            isPersonalRecord: set.isPersonalRecord || false,
            notes: set.notes || '',
          }
        );
      })
    );

    // Update user streak
    await updateStreak(databases, user.$id);

    return NextResponse.json({
      success: true,
      log,
    });
  } catch (error) {
    console.error('Create workout log error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

async function updateStreak(databases, userId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Get or create streak document
    const streaks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userStreaksCollectionId,
      [Query.equal('userId', userId)]
    );

    let streak = streaks.documents[0];

    if (!streak) {
      // Create new streak
      streak = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userStreaksCollectionId,
        ID.unique(),
        {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastWorkoutDate: todayStr,
          totalWorkouts: 1,
          updatedAt: new Date().toISOString(),
        }
      );
      return;
    }

    const lastWorkout = streak.lastWorkoutDate ? new Date(streak.lastWorkoutDate) : null;
    let currentStreak = streak.currentStreak || 0;
    let longestStreak = streak.longestStreak || 0;
    let totalWorkouts = (streak.totalWorkouts || 0) + 1;

    if (lastWorkout) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastWorkout.toISOString().split('T')[0] === todayStr) {
        // Already logged today, just increment total
        totalWorkouts = streak.totalWorkouts || 1;
      } else if (lastWorkout >= yesterday) {
        // Continuing streak
        currentStreak += 1;
      } else {
        // Streak broken
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userStreaksCollectionId,
      streak.$id,
      {
        currentStreak,
        longestStreak,
        lastWorkoutDate: todayStr,
        totalWorkouts,
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Update streak error:', error);
    // Don't throw - streak update failure shouldn't fail the workout log
  }
}
