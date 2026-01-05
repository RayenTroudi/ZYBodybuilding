import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const revalidate = 300; // Revalidate every 5 minutes

// GET /api/coaches - Fetch all active coaches
export async function GET(request) {
  try {
    const { databases } = createAdminClient();

    if (!appwriteConfig.coachesCollectionId) {
      throw new Error('Missing coachesCollectionId configuration');
    }

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
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
