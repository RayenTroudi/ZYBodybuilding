import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query, ID } from 'node-appwrite';
import { requireAdmin } from '@/lib/auth';

// GET - Fetch all trainers
export async function GET(request) {
  try {
    await requireAdmin();

    const { databases } = createAdminClient();

    const trainers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.trainersCollectionId,
      [
        Query.orderAsc('order'),
        Query.orderAsc('name')
      ]
    );

    return NextResponse.json({
      success: true,
      trainers: trainers.documents
    });
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST - Create new trainer
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Validation
    if (!data.name || data.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Create trainer document
    const trainerData = {
      name: data.name,
      email: data.email || '',
      bio: data.bio || '',
      specialty: data.specialty || '',
      imageUrl: data.imageUrl || '',
      certifications: data.certifications || '',
      experienceYears: data.experienceYears || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: data.order || 0
    };

    const trainer = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.trainersCollectionId,
      ID.unique(),
      trainerData
    );

    return NextResponse.json({
      success: true,
      trainer
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating trainer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
