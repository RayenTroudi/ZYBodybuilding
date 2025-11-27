import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET single plan
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();
    const plan = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plansCollectionId,
      id
    );

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 404 }
    );
  }
}

// PATCH - Update plan
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const data = await request.json();
    const { databases } = createAdminClient();

    const updateData = { ...data };
    if (data.duration) {
      const duration = parseInt(data.duration);
      updateData.duration = duration;
      
      // Auto-generate type based on duration for backward compatibility
      let type = 'Custom';
      if (duration <= 7) type = 'Weekly';
      else if (duration >= 28 && duration <= 31) type = 'Monthly';
      else if (duration >= 84 && duration <= 93) type = '3-Month';
      else if (duration >= 365 && duration <= 366) type = 'Yearly';
      updateData.type = type;
    }
    if (data.price) updateData.price = parseFloat(data.price);

    const plan = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plansCollectionId,
      id,
      updateData
    );

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE plan
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plansCollectionId,
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
