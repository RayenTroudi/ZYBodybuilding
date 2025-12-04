import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { Query } from 'node-appwrite';

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

// GET /api/admin/schedule/[id]
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    const session = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleSessionsCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 404 }
    );
  }
}

// PATCH /api/admin/schedule/[id]
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const data = await request.json();
    const { databases } = createAdminClient();

    // If updating time/coach, check conflicts
    if (data.dayOfWeek || data.startTime || data.endTime || data.coachId) {
      const currentSession = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.scheduleSessionsCollectionId,
        id
      );

      const dayOfWeek = data.dayOfWeek || currentSession.dayOfWeek;
      const startTime = data.startTime || currentSession.startTime;
      const endTime = data.endTime || currentSession.endTime;
      const coachId = data.coachId || currentSession.coachId;

      const hasConflict = await checkTimeConflict(
        databases,
        dayOfWeek,
        startTime,
        endTime,
        coachId,
        id
      );

      if (hasConflict) {
        return NextResponse.json(
          { success: false, error: 'Time conflict with another session' },
          { status: 409 }
        );
      }
    }

    const updateData = {};
    if (data.courseTypeId !== undefined) updateData.courseTypeId = data.courseTypeId;
    if (data.coachId !== undefined) updateData.coachId = data.coachId;
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = parseInt(data.dayOfWeek);
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.currentCapacity !== undefined) updateData.currentCapacity = parseInt(data.currentCapacity);
    if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring;
    if (data.effectiveDate !== undefined) updateData.effectiveDate = data.effectiveDate;
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const session = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleSessionsCollectionId,
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE /api/admin/schedule/[id]
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleSessionsCollectionId,
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
