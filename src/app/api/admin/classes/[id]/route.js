import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET - Fetch single class
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { databases } = createAdminClient();

    const classDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.classesCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      class: classDoc
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PATCH - Update class
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const data = await request.json();
    const { databases } = createAdminClient();

    // Build update object (only include provided fields)
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.trainerId !== undefined) updateData.trainerId = data.trainerId;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.caloriesBurn !== undefined) updateData.caloriesBurn = data.caloriesBurn;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.availableSpots !== undefined) updateData.availableSpots = data.availableSpots;
    if (data.bookedSpots !== undefined) updateData.bookedSpots = data.bookedSpots;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    const classDoc = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.classesCollectionId,
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      class: classDoc
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE - Delete class
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { databases } = createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.classesCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
