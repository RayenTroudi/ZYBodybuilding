import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// GET /api/courses - Fetch all active course types
export async function GET(request) {
  try {
    const { databases } = createAdminClient();

    const courses = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.courseTypesCollectionId,
      [
        Query.equal('isActive', true),
        Query.orderAsc('name')
      ]
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
      { status: 500 }
    );
  }
}
