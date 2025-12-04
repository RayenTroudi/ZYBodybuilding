import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/coaches/[id]
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    const coach = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.coachesCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      coach
    });
  } catch (error) {
    console.error('Error fetching coach:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 404 }
    );
  }
}

// PATCH /api/admin/coaches/[id]
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const data = await request.json();
    const { databases } = createAdminClient();

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.photoUrl !== undefined) updateData.photoUrl = data.photoUrl;
    if (data.specialties !== undefined) updateData.specialties = data.specialties;
    if (data.certification !== undefined) updateData.certification = data.certification;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const coach = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.coachesCollectionId,
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      coach
    });
  } catch (error) {
    console.error('Error updating coach:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE /api/admin/coaches/[id]
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.coachesCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Coach deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coach:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
