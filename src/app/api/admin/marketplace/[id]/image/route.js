import { NextResponse } from 'next/server';
import { Client, Storage, Databases, ID } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

function makeClients() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(process.env.APPWRITE_API_KEY);
  return { storage: new Storage(client), databases: new Databases(client) };
}

// POST — upload an image for a product
export async function POST(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10 MB limit' }, { status: 400 });
    }

    const { storage, databases } = makeClients();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBlob = new File([buffer], file.name, { type: file.type });

    const uploaded = await storage.createFile(
      appwriteConfig.productImagesBucketId,
      ID.unique(),
      fileBlob
    );

    // Append new file ID to the product's imageIds array
    const product = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
      { imageIds: [...(product.imageIds || []), uploaded.$id] }
    );

    const url = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.productImagesBucketId}/files/${uploaded.$id}/view?project=${appwriteConfig.projectId}`;

    return NextResponse.json({ fileId: uploaded.$id, url }, { status: 201 });
  } catch (error) {
    console.error('Error uploading product image:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE — remove a specific image from a product
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
    }

    const { storage, databases } = makeClients();

    await storage.deleteFile(appwriteConfig.productImagesBucketId, fileId);

    const product = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
      { imageIds: (product.imageIds || []).filter((fid) => fid !== fileId) }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
