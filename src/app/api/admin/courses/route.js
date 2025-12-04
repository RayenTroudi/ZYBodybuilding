import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

// GET /api/admin/courses - Fetch all course types (including inactive)
export async function GET(request) {
  try {
    await requireAdmin();

    const { databases } = createAdminClient();

    const courses = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.courseTypesCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    return NextResponse.json({
      success: true,
      courses: courses.documents,
      total: courses.total
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST /api/admin/courses - Create new course type
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Validation
    if (!data.name || !data.duration) {
      return NextResponse.json(
        { success: false, error: 'Name and duration are required' },
        { status: 400 }
      );
    }

    const course = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.courseTypesCollectionId,
      ID.unique(),
      {
        name: data.name,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        color: data.color || '#CC1303',
        icon: data.icon || '🏋️',
        duration: parseInt(data.duration),
        difficulty: data.difficulty || '',
        maxCapacity: data.maxCapacity ? parseInt(data.maxCapacity) : 20,
        isActive: data.isActive !== false
      }
    );

    return NextResponse.json({
      success: true,
      course
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
