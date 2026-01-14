import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query, ID } from 'node-appwrite';

// GET - List user's body metrics
export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');

    const { databases } = createAdminClient();
    
    const metrics = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bodyMetricsCollectionId,
      [
        Query.equal('userId', user.$id),
        Query.orderDesc('recordedAt'),
        Query.limit(limit),
      ]
    );

    return NextResponse.json({
      success: true,
      metrics: metrics.documents,
      total: metrics.total,
    });
  } catch (error) {
    console.error('Body metrics fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST - Add a new body metric record
export async function POST(request) {
  try {
    const { user } = await requireValidMembership();

    const data = await request.json();
    const { 
      recordedAt, 
      weight, 
      bodyFat, 
      muscleMass,
      chest,
      waist,
      hips,
      bicepsLeft,
      bicepsRight,
      thighLeft,
      thighRight,
      calfLeft,
      calfRight,
      neck,
      shoulders,
      forearmLeft,
      forearmRight,
      notes 
    } = data;

    const { databases } = createAdminClient();
    
    // Build document with only provided fields
    const docData = {
      userId: user.$id,
      recordedAt: recordedAt || new Date().toISOString(),
    };

    // Only add fields that have values
    if (weight !== undefined && weight !== null) docData.weight = parseFloat(weight);
    if (bodyFat !== undefined && bodyFat !== null) docData.bodyFat = parseFloat(bodyFat);
    if (muscleMass !== undefined && muscleMass !== null) docData.muscleMass = parseFloat(muscleMass);
    if (chest !== undefined && chest !== null) docData.chest = parseFloat(chest);
    if (waist !== undefined && waist !== null) docData.waist = parseFloat(waist);
    if (hips !== undefined && hips !== null) docData.hips = parseFloat(hips);
    if (bicepsLeft !== undefined && bicepsLeft !== null) docData.bicepsLeft = parseFloat(bicepsLeft);
    if (bicepsRight !== undefined && bicepsRight !== null) docData.bicepsRight = parseFloat(bicepsRight);
    if (thighLeft !== undefined && thighLeft !== null) docData.thighLeft = parseFloat(thighLeft);
    if (thighRight !== undefined && thighRight !== null) docData.thighRight = parseFloat(thighRight);
    if (calfLeft !== undefined && calfLeft !== null) docData.calfLeft = parseFloat(calfLeft);
    if (calfRight !== undefined && calfRight !== null) docData.calfRight = parseFloat(calfRight);
    if (neck !== undefined && neck !== null) docData.neck = parseFloat(neck);
    if (shoulders !== undefined && shoulders !== null) docData.shoulders = parseFloat(shoulders);
    if (forearmLeft !== undefined && forearmLeft !== null) docData.forearmLeft = parseFloat(forearmLeft);
    if (forearmRight !== undefined && forearmRight !== null) docData.forearmRight = parseFloat(forearmRight);
    if (notes) docData.notes = notes;

    const metric = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bodyMetricsCollectionId,
      ID.unique(),
      docData
    );

    return NextResponse.json({
      success: true,
      metric,
    });
  } catch (error) {
    console.error('Create body metric error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// DELETE - Delete a body metric
export async function DELETE(request) {
  try {
    const { user } = await requireValidMembership();

    const { searchParams } = new URL(request.url);
    const metricId = searchParams.get('id');

    if (!metricId) {
      return NextResponse.json(
        { success: false, error: 'Metric ID is required' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    
    // Verify ownership
    const metric = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bodyMetricsCollectionId,
      metricId
    );

    if (metric.userId !== user.$id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this metric' },
        { status: 403 }
      );
    }

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bodyMetricsCollectionId,
      metricId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete body metric error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
