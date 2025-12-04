import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

// Helper: Check for time conflicts
async function checkTimeConflict(databases, dayOfWeek, startTime, endTime, coachId, excludeSessionId = null) {
  const sessions = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.scheduleSessionsCollectionId,
    [
      Query.equal('dayOfWeek', dayOfWeek),
      Query.equal('coachId', coachId),
      Query.equal('isActive', true)
    ]
  );

  return sessions.documents.some(session => {
    if (session.$id === excludeSessionId) return false;
    return (startTime < session.endTime && endTime > session.startTime);
  });
}

// GET /api/admin/schedule
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');
    const courseId = searchParams.get('courseId');
    const coachId = searchParams.get('coachId');
    const status = searchParams.get('status');

    const { databases } = createAdminClient();

    let queries = [Query.orderAsc('dayOfWeek'), Query.orderAsc('startTime')];

    if (day && day !== 'all') queries.push(Query.equal('dayOfWeek', parseInt(day)));
    if (courseId && courseId !== 'all') queries.push(Query.equal('courseTypeId', courseId));
    if (coachId && coachId !== 'all') queries.push(Query.equal('coachId', coachId));
    if (status && status !== 'all') queries.push(Query.equal('status', status));

    const sessions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleSessionsCollectionId,
      queries
    );

    // Fetch related data
    const [courseTypes, coaches] = await Promise.all([
      databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.courseTypesCollectionId),
      databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.coachesCollectionId)
    ]);

    // Join data
    const enrichedSessions = sessions.documents.map(session => ({
      ...session,
      courseType: courseTypes.documents.find(c => c.$id === session.courseTypeId),
      coach: coaches.documents.find(c => c.$id === session.coachId)
    }));

    return NextResponse.json({
      success: true,
      sessions: enrichedSessions,
      total: sessions.total
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST /api/admin/schedule
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Validation
    const errors = [];
    if (!data.courseTypeId) errors.push('Course type is required');
    if (!data.coachId) errors.push('Coach is required');
    if (!data.dayOfWeek || data.dayOfWeek < 1 || data.dayOfWeek > 7) {
      errors.push('Valid day of week is required (1-7)');
    }
    if (!data.startTime) errors.push('Start time is required');
    if (!data.endTime) errors.push('End time is required');
    if (data.startTime >= data.endTime) errors.push('End time must be after start time');

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    // Check time conflicts
    const hasConflict = await checkTimeConflict(
      databases,
      data.dayOfWeek,
      data.startTime,
      data.endTime,
      data.coachId
    );

    if (hasConflict) {
      return NextResponse.json(
        { success: false, error: 'Coach already has a session at this time' },
        { status: 409 }
      );
    }

    const session = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleSessionsCollectionId,
      ID.unique(),
      {
        courseTypeId: data.courseTypeId,
        coachId: data.coachId,
        dayOfWeek: parseInt(data.dayOfWeek),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location || '',
        currentCapacity: 0,
        isRecurring: data.isRecurring !== false,
        effectiveDate: data.effectiveDate || '',
        expiryDate: data.expiryDate || '',
        status: data.status || 'active',
        notes: data.notes || '',
        isActive: data.isActive !== false
      }
    );

    return NextResponse.json({
      success: true,
      session
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
