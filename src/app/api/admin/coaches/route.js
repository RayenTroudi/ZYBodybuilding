import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

// GET /api/admin/coaches
export async function GET(request) {
  try {
    await requireAdmin();

    const { databases } = createAdminClient();

    const coaches = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.coachesCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    return NextResponse.json({
      success: true,
      coaches: coaches.documents,
      total: coaches.total
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST /api/admin/coaches
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Validation
    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const coach = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.coachesCollectionId,
      ID.unique(),
      {
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        photoUrl: data.photoUrl || '',
        specialties: data.specialties || [],
        certification: data.certification || '',
        isActive: data.isActive !== false
      }
    );

    return NextResponse.json({
      success: true,
      coach
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating coach:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
