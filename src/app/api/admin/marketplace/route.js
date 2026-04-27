import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

const CATEGORIES = ['supplements', 'apparel', 'equipment', 'accessories'];

// GET all products (admin sees everything, including inactive)
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const { databases } = createAdminClient();

    const queries = [Query.orderDesc('$createdAt'), Query.limit(200)];
    if (category && category !== 'all') {
      queries.push(Query.equal('category', category));
    }

    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      queries
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST — create a new product
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    if (!data.name_en || !data.name_fr) {
      return NextResponse.json({ error: 'English and French names are required' }, { status: 400 });
    }
    if (!data.price || isNaN(parseFloat(data.price))) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }
    if (!CATEGORIES.includes(data.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const product = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      ID.unique(),
      {
        name_en: data.name_en.trim(),
        name_fr: data.name_fr.trim(),
        description_en: data.description_en?.trim() || '',
        description_fr: data.description_fr?.trim() || '',
        price: parseFloat(data.price),
        category: data.category,
        imageIds: data.imageIds || [],
        inStock: data.inStock !== false,
        isActive: data.isActive !== false,
        featured: data.featured === true,
      }
    );

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
