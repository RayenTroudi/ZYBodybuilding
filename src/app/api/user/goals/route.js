import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query, ID } from 'node-appwrite';

// GET - List user's fitness goals
export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const { databases } = createAdminClient();
    
    let queries = [
      Query.equal('userId', user.$id),
      Query.orderDesc('$createdAt'),
    ];

    if (status) {
      queries.push(Query.equal('status', status));
    }

    const goals = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fitnessGoalsCollectionId,
      queries
    );

    return NextResponse.json({
      success: true,
      goals: goals.documents,
      total: goals.total,
    });
  } catch (error) {
    console.error('Fitness goals fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST - Create a new fitness goal
export async function POST(request) {
  try {
    const { user } = await requireValidMembership();

    const data = await request.json();
    const { 
      goalType, 
      title, 
      targetValue, 
      currentValue, 
      unit, 
      targetDate, 
      notes 
    } = data;

    if (!goalType || !title || targetValue === undefined) {
      return NextResponse.json(
        { success: false, error: 'Goal type, title, and target value are required' },
        { status: 400 }
      );
    }

    // Validate goal type
    const validTypes = ['weight', 'strength', 'endurance', 'consistency', 'custom'];
    if (!validTypes.includes(goalType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid goal type' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    
    const goal = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fitnessGoalsCollectionId,
      ID.unique(),
      {
        userId: user.$id,
        goalType,
        title,
        targetValue: parseFloat(targetValue),
        currentValue: parseFloat(currentValue || 0),
        unit: unit || '',
        targetDate: targetDate || null,
        status: 'active',
        notes: notes || '',
      }
    );

    return NextResponse.json({
      success: true,
      goal,
    });
  } catch (error) {
    console.error('Create fitness goal error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
