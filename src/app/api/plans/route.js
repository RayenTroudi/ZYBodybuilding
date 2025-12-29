import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const revalidate = 300; // Revalidate every 5 minutes

// GET active plans for public display
export async function GET() {
  try {
    const { databases } = createAdminClient();

    const plans = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.plansCollectionId,
      [
        Query.equal('isActive', true),
        Query.orderAsc('duration')
      ]
    );

    return NextResponse.json(plans, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}
