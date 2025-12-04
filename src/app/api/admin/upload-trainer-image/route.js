import { NextResponse } from 'next/server';
import { Client, Storage, ID } from 'node-appwrite';
import { requireAdmin } from '@/lib/auth';
import { appwriteConfig } from '@/lib/appwrite/config';

export async function POST(request) {
  try {
    // Check admin authentication
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Create Appwrite client with API key
    const client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a File object that node-appwrite can handle
    // We'll convert the buffer to a Blob with proper metadata
    const fileBlob = new File([buffer], file.name, { type: file.type });

    // Upload file to Appwrite Storage
    const uploadedFile = await storage.createFile(
      appwriteConfig.trainerImagesBucketId,
      ID.unique(),
      fileBlob
    );

    // Generate file URL
    const fileUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.trainerImagesBucketId}/files/${uploadedFile.$id}/view?project=${appwriteConfig.projectId}`;

    return NextResponse.json({
      success: true,
      fileId: uploadedFile.$id,
      fileUrl: fileUrl,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload image' },
      { status: error.code || 500 }
    );
  }
}

// Delete image from storage
export async function DELETE(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'No file ID provided' },
        { status: 400 }
      );
    }

    const client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);

    await storage.deleteFile(
      appwriteConfig.trainerImagesBucketId,
      fileId
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete image' },
      { status: error.code || 500 }
    );
  }
}
