import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query } from 'node-appwrite';

// GET - Get user's personal records (PRs)
export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { databases } = createAdminClient();
    
    // Get all workout log sets for this user
    const logs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workoutLogsCollectionId,
      [
        Query.equal('userId', user.$id),
        Query.limit(500),
      ]
    );

    const logIds = logs.documents.map(log => log.$id);
    
    if (logIds.length === 0) {
      return NextResponse.json({
        success: true,
        personalRecords: [],
      });
    }

    // Get all sets from these logs
    const allSets = [];
    // Batch queries to avoid too many at once
    for (let i = 0; i < logIds.length; i += 25) {
      const batch = logIds.slice(i, i + 25);
      const sets = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.workoutLogSetsCollectionId,
        [
          Query.equal('workoutLogId', batch),
          Query.limit(500),
        ]
      );
      allSets.push(...sets.documents);
    }

    // Group by exercise and find max weight
    const prMap = new Map();
    
    for (const set of allSets) {
      if (!set.weight || set.weight <= 0) continue;
      
      const existing = prMap.get(set.exerciseId);
      if (!existing || set.weight > existing.weight) {
        // Find the log date for this set
        const log = logs.documents.find(l => l.$id === set.workoutLogId);
        prMap.set(set.exerciseId, {
          exerciseId: set.exerciseId,
          weight: set.weight,
          reps: set.reps,
          date: log?.date || set.$createdAt,
        });
      }
    }

    // Get exercise details for PRs
    const exerciseIds = Array.from(prMap.keys());
    const personalRecords = [];

    for (const exerciseId of exerciseIds) {
      try {
        const exercise = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.exercisesCollectionId,
          exerciseId
        );
        
        const pr = prMap.get(exerciseId);
        personalRecords.push({
          ...pr,
          exercise: {
            $id: exercise.$id,
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
          },
        });
      } catch {
        // Exercise might have been deleted
        continue;
      }
    }

    // Sort by weight descending
    personalRecords.sort((a, b) => b.weight - a.weight);

    return NextResponse.json({
      success: true,
      personalRecords: personalRecords.slice(0, 20), // Top 20 PRs
    });
  } catch (error) {
    console.error('Personal records fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
