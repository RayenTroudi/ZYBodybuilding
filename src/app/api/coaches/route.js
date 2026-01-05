import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/coaches - Fetch all active coaches
export async function GET(request) {
  try {
    if (!appwriteConfig.coachesCollectionId) {
      console.warn('Missing coachesCollectionId configuration');
      return NextResponse.json({
        success: true,
        coaches: [],
        total: 0
      });
    }

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
    return NextResponse.json({
      success: true,
      coaches: [],
      total: 0
    });
  }
}
