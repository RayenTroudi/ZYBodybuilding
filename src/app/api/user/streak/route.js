import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query } from 'node-appwrite';

// GET - Get user streak information
export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { databases } = createAdminClient();
    
    const streaks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userStreaksCollectionId,
      [Query.equal('userId', user.$id)]
    );

    const streak = streaks.documents[0] || {
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
      totalWorkouts: 0,
    };

    // Check if streak is still valid (last workout within 1 day)
    let currentStreak = streak.currentStreak;
    if (streak.lastWorkoutDate) {
      const lastWorkout = new Date(streak.lastWorkoutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastWorkout < yesterday) {
        currentStreak = 0; // Streak broken
      }
    }

    return NextResponse.json({
      success: true,
      streak: {
        currentStreak,
        longestStreak: streak.longestStreak,
        lastWorkoutDate: streak.lastWorkoutDate,
        totalWorkouts: streak.totalWorkouts,
      },
    });
  } catch (error) {
    console.error('Streak fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
