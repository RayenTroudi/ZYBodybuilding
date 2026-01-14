import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query } from 'node-appwrite';

export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { searchParams } = new URL(request.url);
    const muscleGroup = searchParams.get('muscleGroup');
    const equipment = searchParams.get('equipment');
    const difficulty = searchParams.get('difficulty');

    const { databases } = createAdminClient();
    
    let queries = [Query.equal('isActive', true), Query.limit(200), Query.orderAsc('name')];
    
    if (muscleGroup) {
      queries.push(Query.equal('muscleGroup', muscleGroup));
    }
    if (equipment) {
      queries.push(Query.equal('equipment', equipment));
    }
    if (difficulty) {
      queries.push(Query.equal('difficulty', difficulty));
    }

    const exerciseDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.exercisesCollectionId,
      queries
    );

    return NextResponse.json({
      success: true,
      exercises: exerciseDocs.documents,
    });
  } catch (error) {
    console.error('Exercises fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
