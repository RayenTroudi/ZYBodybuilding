import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query } from 'node-appwrite';

export async function GET() {
  try {
    const { user } = await requireValidMembership();
    const { databases } = createAdminClient();

    // Get user streak data
    let streak = null;
    try {
      const streakDocs = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userStreaksCollectionId,
        [Query.equal('userId', user.$id), Query.limit(1)]
      );
      streak = streakDocs.documents[0] || null;
    } catch (e) {
      console.log('Streak collection not found or empty');
    }

    // Get recent workouts
    let recentWorkouts = [];
    try {
      const workoutDocs = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.workoutLogsCollectionId,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('workoutDate'),
          Query.limit(10),
        ]
      );
      recentWorkouts = workoutDocs.documents;
    } catch (e) {
      console.log('Workout logs collection not found or empty');
    }

    // Get active goals
    let goals = [];
    try {
      const goalDocs = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.fitnessGoalsCollectionId,
        [
          Query.equal('userId', user.$id),
          Query.equal('status', 'active'),
          Query.limit(5),
        ]
      );
      goals = goalDocs.documents;
    } catch (e) {
      console.log('Goals collection not found or empty');
    }

    // Get daily tip
    let dailyTip = null;
    try {
      const tipDocs = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.dailyTipsCollectionId,
        [Query.equal('isActive', true), Query.limit(20)]
      );
      if (tipDocs.documents.length > 0) {
        // Pick a random tip or one based on date
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        dailyTip = tipDocs.documents[dayOfYear % tipDocs.documents.length];
      }
    } catch (e) {
      console.log('Daily tips collection not found or empty');
    }

    // Calculate stats
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const workoutsThisWeek = recentWorkouts.filter(w => 
      new Date(w.workoutDate) >= weekStart
    ).length;

    const stats = {
      workoutsThisWeek,
      totalMinutes: streak?.totalMinutes || 0,
      totalVolume: streak?.totalVolume || 0,
    };

    return NextResponse.json({
      success: true,
      stats,
      recentWorkouts,
      goals,
      dailyTip,
      streak,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
