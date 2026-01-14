import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query, ID } from 'node-appwrite';

// GET - List user's workout plans
export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { databases } = createAdminClient();
    
    const plans = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workoutPlansCollectionId,
      [
        Query.equal('userId', user.$id),
        Query.equal('isActive', true),
        Query.orderDesc('$createdAt'),
      ]
    );

    // Get exercises for each plan
    const plansWithExercises = await Promise.all(
      plans.documents.map(async (plan) => {
        const planExercises = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.workoutPlanExercisesCollectionId,
          [
            Query.equal('planId', plan.$id),
            Query.orderAsc('orderIndex'),
          ]
        );
        
        // Get exercise details
        const exercisesWithDetails = await Promise.all(
          planExercises.documents.map(async (pe) => {
            try {
              const exercise = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.exercisesCollectionId,
                pe.exerciseId
              );
              return { ...pe, exercise };
            } catch {
              return { ...pe, exercise: null };
            }
          })
        );

        return { ...plan, exercises: exercisesWithDetails };
      })
    );

    return NextResponse.json({
      success: true,
      plans: plansWithExercises,
    });
  } catch (error) {
    console.error('Workout plans fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST - Create a new workout plan
export async function POST(request) {
  try {
    const { user } = await requireValidMembership();

    const data = await request.json();
    const { 
      name, 
      description, 
      type,
      daysPerWeek,
      difficulty,
      estimatedDuration,
      targetMuscleGroups,
      exercises 
    } = data;

    if (!name || !type || !daysPerWeek) {
      return NextResponse.json(
        { success: false, error: 'Name, type, and days per week are required' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    
    // Create the workout plan
    const plan = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutPlansCollectionId,
      ID.unique(),
      {
        userId: user.$id,
        name,
        description: description || '',
        type,
        daysPerWeek: parseInt(daysPerWeek),
        difficulty: difficulty || 'intermediate',
        estimatedDuration: estimatedDuration || null,
        targetMuscleGroups: targetMuscleGroups || [],
        isTemplate: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    // Add exercises to the plan if provided
    if (exercises && exercises.length > 0) {
      await Promise.all(
        exercises.map(async (ex, index) => {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutPlanExercisesCollectionId,
            ID.unique(),
            {
              planId: plan.$id,
              exerciseId: ex.exerciseId,
              dayOfWeek: ex.dayOfWeek || 1,
              orderIndex: ex.orderIndex || index,
              targetSets: ex.targetSets || 3,
              targetReps: ex.targetReps || '8-12',
              restSeconds: ex.restSeconds || 90,
              notes: ex.notes || '',
            }
          );
        })
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error('Create workout plan error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// DELETE - Delete a workout plan
export async function DELETE(request) {
  try {
    const { user } = await requireValidMembership();

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('id');

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    
    // Verify ownership
    const plan = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutPlansCollectionId,
      planId
    );

    if (plan.userId !== user.$id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this plan' },
        { status: 403 }
      );
    }

    // Soft delete
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutPlansCollectionId,
      planId,
      { isActive: false }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
