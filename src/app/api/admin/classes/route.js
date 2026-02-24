import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query, ID } from 'node-appwrite';
import { requireAdmin } from '@/lib/auth';

// GET - Fetch all classes
export async function GET(request) {
  try {
    await requireAdmin();

    const { databases } = createAdminClient();

    const classes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.classesCollectionId,
      [
        Query.orderAsc('dayOfWeek'),
        Query.orderAsc('startTime')
      ]
    );

    return NextResponse.json({
      success: true,
      classes: classes.documents
    }, {
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST - Create new class
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Validation
    if (!data.title || data.title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }
    if (!data.dayOfWeek) {
      return NextResponse.json(
        { success: false, error: 'Day of week is required' },
        { status: 400 }
      );
    }
    if (!data.startTime) {
      return NextResponse.json(
        { success: false, error: 'Start time is required' },
        { status: 400 }
      );
    }
    if (!data.endTime) {
      return NextResponse.json(
        { success: false, error: 'End time is required' },
        { status: 400 }
      );
    }

    // Create class document
    const classData = {
      title: data.title,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      trainerId: data.trainerId || '',
      imageFileId: data.imageFileId || '',
    };

    const classDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.classesCollectionId,
      ID.unique(),
      classData
    );

    return NextResponse.json({
      success: true,
      class: classDoc
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
