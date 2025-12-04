import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET - Fetch single trainer
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { databases } = createAdminClient();

    const trainer = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.trainersCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      trainer
    });
  } catch (error) {
    console.error('Error fetching trainer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PATCH - Update trainer
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const data = await request.json();
    const { databases } = createAdminClient();

    // Build update object (only include provided fields)
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.specialty !== undefined) updateData.specialty = data.specialty;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.certifications !== undefined) updateData.certifications = data.certifications;
    if (data.experienceYears !== undefined) updateData.experienceYears = data.experienceYears;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    const trainer = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.trainersCollectionId,
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      trainer
    });
  } catch (error) {
    console.error('Error updating trainer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE - Delete trainer
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { databases } = createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.trainersCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Trainer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
