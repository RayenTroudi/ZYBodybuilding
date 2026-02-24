import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { Client, Storage } from 'node-appwrite';

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
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.trainerId !== undefined) updateData.trainerId = data.trainerId;
    if (data.imageFileId !== undefined) updateData.imageFileId = data.imageFileId;

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

    // Get class to check if it has an image
    const classDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.classesCollectionId,
      id
    );

    // Delete associated image if exists
    if (classDoc.imageFileId) {
      try {
        const client = new Client()
          .setEndpoint(appwriteConfig.endpoint)
          .setProject(appwriteConfig.projectId)
          .setKey(process.env.APPWRITE_API_KEY);

        const storage = new Storage(client);
        await storage.deleteFile(
          appwriteConfig.trainerImagesBucketId,
          classDoc.imageFileId
        );
      } catch (deleteError) {
        console.error('Failed to delete image:', deleteError);
        // Continue with class deletion even if image deletion fails
      }
    }

    // Delete class document
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
