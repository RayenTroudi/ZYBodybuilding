import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

/**
 * POST - Create user accounts for existing members who don't have one
 * This is an admin utility to retroactively create accounts
 */
export async function POST(request) {
  try {
    await requireAdmin();

    const { memberId } = await request.json();
    const { account, databases } = createAdminClient();

    // If memberId provided, create for specific member
    // Otherwise, create for all members without accounts
    let members;
    
    if (memberId) {
      members = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.membersCollectionId,
        [Query.equal('memberId', memberId), Query.limit(1)]
      );
    } else {
      // Get all active members
      members = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.membersCollectionId,
        [Query.equal('status', 'Active'), Query.limit(1000)]
      );
    }

    const results = {
      created: [],
      skipped: [],
      failed: [],
    };

    for (const member of members.documents) {
      try {
        // Check if user already exists
        const existingUsers = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          [Query.equal('email', member.email), Query.limit(1)]
        );

        if (existingUsers.documents.length > 0) {
          results.skipped.push({
            memberId: member.memberId,
            email: member.email,
            reason: 'User account already exists',
          });
          continue;
        }

        // Create user account
        const user = await account.create(
          ID.unique(),
          member.email,
          member.memberId, // Initial password
          member.name
        );

        // Create user document
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          user.$id,
          {
            userId: user.$id,
            email: member.email,
            name: member.name,
            role: 'member',
            memberId: member.memberId,
            requiresPasswordReset: true,
            createdAt: new Date().toISOString(),
            createdByAdmin: true,
          }
        );

        results.created.push({
          memberId: member.memberId,
          email: member.email,
          userId: user.$id,
        });
      } catch (error) {
        results.failed.push({
          memberId: member.memberId,
          email: member.email,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: members.documents.length,
        created: results.created.length,
        skipped: results.skipped.length,
        failed: results.failed.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
