import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';

// PATCH - Update a fitness goal
export async function PATCH(request, { params }) {
  try {
    const { user } = await requireValidMembership();

    const { id } = await params;
    const data = await request.json();

    const { databases } = createAdminClient();
    
    // Verify ownership
    const goal = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fitnessGoalsCollectionId,
      id
    );

    if (goal.userId !== user.$id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this goal' },
        { status: 403 }
      );
    }

    // Build update object
    const updateData = {};
    if (data.currentValue !== undefined) updateData.currentValue = parseFloat(data.currentValue);
    if (data.targetValue !== undefined) updateData.targetValue = parseFloat(data.targetValue);
    if (data.status) updateData.status = data.status;
    if (data.title) updateData.title = data.title;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.targetDate !== undefined) updateData.targetDate = data.targetDate;

    // Auto-complete if current >= target for certain goal types
    if (updateData.currentValue !== undefined && goal.goalType !== 'weight') {
      const targetVal = updateData.targetValue || goal.targetValue;
      if (updateData.currentValue >= targetVal) {
        updateData.status = 'completed';
        updateData.completedDate = new Date().toISOString();
      }
    }

    const updatedGoal = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fitnessGoalsCollectionId,
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      goal: updatedGoal,
    });
  } catch (error) {
    console.error('Update fitness goal error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// DELETE - Delete a fitness goal
export async function DELETE(request, { params }) {
  try {
    const { user } = await requireValidMembership();

    const { id } = await params;

    const { databases } = createAdminClient();
    
    // Verify ownership
    const goal = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fitnessGoalsCollectionId,
      id
    );

    if (goal.userId !== user.$id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this goal' },
        { status: 403 }
      );
    }

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fitnessGoalsCollectionId,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete fitness goal error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
