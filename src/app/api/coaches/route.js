import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// GET /api/coaches - Fetch all active coaches
export async function GET(request) {
  try {
    const { databases } = createAdminClient();

    const coaches = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.coachesCollectionId,
      [
        Query.equal('isActive', true),
        Query.orderAsc('name')
      ]
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
      { status: 500 }
    );
  }
}
