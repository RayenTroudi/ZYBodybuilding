import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireValidMembership } from '@/lib/authHelpers';
import { Query, ID } from 'node-appwrite';

// GET - Get user profile
export async function GET(request) {
  try {
    const { user } = await requireValidMembership();

    const { databases } = createAdminClient();
    
    // Try to get existing profile
    const profiles = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userProfilesCollectionId,
      [Query.equal('userId', user.$id)]
    );

    let profile = profiles.documents[0];

    // Create profile if doesn't exist
    if (!profile) {
      profile = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userProfilesCollectionId,
        ID.unique(),
        {
          userId: user.$id,
          displayName: user.name || '',
          fitnessLevel: 'beginner',
          fitnessGoals: [],
          preferredWorkoutDays: [],
          preferredWorkoutTime: 'morning',
          equipmentAccess: [],
          injuries: '',
          dateOfBirth: null,
          height: null,
          heightUnit: 'cm',
          preferredWeightUnit: 'kg',
        }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request) {
  try {
    const { user } = await requireValidMembership();

    const data = await request.json();

    const { databases } = createAdminClient();
    
    // Get existing profile
    const profiles = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userProfilesCollectionId,
      [Query.equal('userId', user.$id)]
    );

    let profile = profiles.documents[0];

    // Build update object - only include allowed fields
    const allowedFields = [
      'displayName',
      'fitnessLevel',
      'fitnessGoals',
      'preferredWorkoutDays',
      'preferredWorkoutTime',
      'equipmentAccess',
      'injuries',
      'dateOfBirth',
      'height',
      'heightUnit',
      'preferredWeightUnit',
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    if (profile) {
      // Update existing profile
      profile = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userProfilesCollectionId,
        profile.$id,
        updateData
      );
    } else {
      // Create new profile with update data
      profile = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userProfilesCollectionId,
        ID.unique(),
        {
          userId: user.$id,
          ...updateData,
        }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.message === 'MEMBERSHIP_INVALID' || error.message === 'PASSWORD_RESET_REQUIRED') {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
