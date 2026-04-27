import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// Public GET — returns active, in-stock products only
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const { databases } = createAdminClient();

    const queries = [
      Query.equal('isActive', true),
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ];

    if (category && category !== 'all') {
      queries.push(Query.equal('category', category));
    }

    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      queries
    );

    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
