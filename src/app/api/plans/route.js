import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

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

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}
