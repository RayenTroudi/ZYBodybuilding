import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { Query } from 'node-appwrite';

// GET /api/admin/programs - Fetch all programs (including inactive)
export async function GET(request) {
  try {
    await requireAdmin();

    const { databases } = createAdminClient();

    const programs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.programsCollectionId,
      [Query.orderAsc('order')]
    );

    return NextResponse.json({
      success: true,
      programs: programs.documents
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST /api/admin/programs - Create new program
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Validation
    const errors = [];
    if (!data.title || data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    const programData = {
      title: data.title.trim(),
      description: data.description.trim(),
      icon: data.icon || '🏋️',
      imageUrl: data.imageUrl || null,
      color: data.color || '#CC1303',
      order: data.order !== undefined ? parseInt(data.order) : 0,
      features: Array.isArray(data.features) ? JSON.stringify(data.features) : (data.features || null),
      targetAudience: data.targetAudience || null,
      duration: data.duration || null,
      isActive: data.isActive !== undefined ? data.isActive : true
    };

    const program = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.programsCollectionId,
      'unique()',
      programData
    );

    return NextResponse.json({
      success: true,
      program
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
