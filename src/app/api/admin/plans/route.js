import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

// GET all plans
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const { databases } = createAdminClient();
    
    let queries = [Query.orderAsc('duration')];
    
    if (activeOnly) {
      queries.push(Query.equal('isActive', true));
    }

    const plans = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.plansCollectionId,
      queries
    );

    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST - Create plan
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    const duration = parseInt(data.duration);
    
    // Auto-generate type based on duration for backward compatibility
    let type = 'Custom';
    if (duration <= 7) type = 'Weekly';
    else if (duration >= 28 && duration <= 31) type = 'Monthly';
    else if (duration >= 84 && duration <= 93) type = '3-Month';
    else if (duration >= 365 && duration <= 366) type = 'Yearly';

    const plan = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plansCollectionId,
      ID.unique(),
      {
        ...data,
        type,
        duration,
        price: parseFloat(data.price),
        isActive: data.isActive !== false,
      }
    );

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
