import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/programs/[id]
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    const program = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.programsCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      program
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 404 }
    );
  }
}

// PATCH /api/admin/programs/[id]
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const data = await request.json();
    const { databases } = createAdminClient();

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.order !== undefined) updateData.order = parseInt(data.order);
    if (data.features !== undefined) {
      updateData.features = Array.isArray(data.features) 
        ? JSON.stringify(data.features) 
        : data.features;
    }
    if (data.targetAudience !== undefined) updateData.targetAudience = data.targetAudience;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const program = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.programsCollectionId,
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      program
    });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE /api/admin/programs/[id]
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.programsCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
