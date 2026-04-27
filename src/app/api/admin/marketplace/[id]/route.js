import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET single product
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();
    const product = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id
    );

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 404 }
    );
  }
}

// PATCH — partial update
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const data = await request.json();
    const { databases } = createAdminClient();

    const updateData = {};
    const allowed = [
      'name_en', 'name_fr', 'description_en', 'description_fr',
      'category', 'imageIds', 'inStock', 'isActive', 'featured',
    ];

    for (const key of allowed) {
      if (key in data) updateData[key] = data[key];
    }
    if ('price' in data) updateData.price = parseFloat(data.price);

    const product = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
      updateData
    );

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE — remove product and its images from storage
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases, storage } = createAdminClient();

    // Fetch product first to clean up its images
    const product = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id
    );

    // Delete images from storage bucket
    if (product.imageIds?.length) {
      await Promise.allSettled(
        product.imageIds.map((fileId) =>
          storage.deleteFile(appwriteConfig.productImagesBucketId, fileId)
        )
      );
    }

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
