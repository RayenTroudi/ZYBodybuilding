import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// POST - Bulk delete members
export async function POST(request) {
  try {
    await requireAdmin();

    const { ids } = await request.json();
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty ids array' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    const results = {
      success: [],
      failed: [],
    };

    // Delete each member
    for (const id of ids) {
      try {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.membersCollectionId,
          id
        );
        results.success.push(id);
      } catch (error) {
        results.failed.push({ id, error: error.message });
      }
    }

    return NextResponse.json({
      message: `Deleted ${results.success.length} of ${ids.length} members`,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
