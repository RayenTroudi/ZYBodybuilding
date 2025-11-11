import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// This endpoint can be called by a cron job to automatically check and update expired subscriptions
export async function POST(request) {
  try {
    // Optional: Add a secret key check for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { databases } = createAdminClient();
    const now = new Date();

    // Get all active members
    const activeMembers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      [Query.equal('status', 'Active'), Query.limit(500)]
    );

    let updatedCount = 0;
    const expiredMembers = [];

    // Check each member's subscription end date
    for (const member of activeMembers.documents) {
      const endDate = new Date(member.subscriptionEndDate);

      if (endDate < now) {
        // Update status to Expired
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.membersCollectionId,
          member.$id,
          { status: 'Expired' }
        );

        expiredMembers.push({
          id: member.memberId,
          name: member.name,
          email: member.email,
          endDate: member.subscriptionEndDate,
        });

        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Checked ${activeMembers.documents.length} active members`,
      updatedCount,
      expiredMembers,
      timestamp: now.toISOString(),
    });

  } catch (error) {
    console.error('Error checking subscriptions:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to view subscription status
export async function GET(request) {
  try {
    const { databases } = createAdminClient();
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Get all members
    const allMembers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      [Query.limit(500)]
    );

    const stats = {
      total: allMembers.total,
      active: 0,
      expired: 0,
      expiringSoon: [],
    };

    for (const member of allMembers.documents) {
      const endDate = new Date(member.subscriptionEndDate);

      if (member.status === 'Active') {
        stats.active++;

        // Check if expiring soon
        if (endDate <= sevenDaysFromNow && endDate > now) {
          const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          stats.expiringSoon.push({
            id: member.memberId,
            name: member.name,
            email: member.email,
            daysLeft,
            endDate: member.subscriptionEndDate,
          });
        }
      } else if (member.status === 'Expired') {
        stats.expired++;
      }
    }

    return NextResponse.json(stats);

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
