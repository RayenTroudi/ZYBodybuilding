import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// GET /api/programs - Fetch all active programs
export async function GET(request) {
  try {
    const { databases } = await createSessionClient();

    const programs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.programsCollectionId,
      [
        Query.equal('isActive', true),
        Query.orderAsc('order')
      ]
    );

    return NextResponse.json({
      success: true,
      programs: programs.documents
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
