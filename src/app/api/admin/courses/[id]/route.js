import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/courses/[id]
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    const course = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.courseTypesCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 404 }
    );
  }
}

// PATCH /api/admin/courses/[id]
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const data = await request.json();
    const { databases } = createAdminClient();

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.duration !== undefined) updateData.duration = parseInt(data.duration);
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.maxCapacity !== undefined) updateData.maxCapacity = parseInt(data.maxCapacity);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const course = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.courseTypesCollectionId,
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE /api/admin/courses/[id]
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.courseTypesCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
