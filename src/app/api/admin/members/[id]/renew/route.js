import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID } from 'node-appwrite';

// POST - Renew member subscription
export async function POST(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { planId, planName, planDuration, amount, paymentMethod } = await request.json();
    const { databases } = createAdminClient();

    // Get current member
    const member = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      id
    );

    // Calculate new dates
    const now = new Date();
    let startDate = new Date();
    let isRenewal = false;
    
    // If member has a valid end date and it's in the future, extend from there (renewal)
    if (member.subscriptionEndDate) {
      const currentEndDate = new Date(member.subscriptionEndDate);
      if (!isNaN(currentEndDate.getTime()) && currentEndDate > now) {
        startDate = currentEndDate;
        isRenewal = true;
      }
    }
    
    const newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + parseInt(planDuration));

    // Update member with both start and end dates
    const updatedMember = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      id,
      {
        planId,
        planName,
        subscriptionStartDate: startDate.toISOString(),
        subscriptionEndDate: newEndDate.toISOString(),
        status: 'Active',
        totalPaid: parseFloat(member.totalPaid || 0) + parseFloat(amount),
      }
    );

    // Create payment record
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.paymentsCollectionId,
      ID.unique(),
      {
        memberId: member.memberId,
        memberName: member.name,
        planId,
        planName,
        amount: parseFloat(amount),
        paymentDate: new Date().toISOString(),
        paymentMethod: paymentMethod || 'Cash',
        status: 'Completed',
        notes: 'Renewal payment',
      }
    );

    return NextResponse.json({ 
      member: updatedMember,
      renewalInfo: {
        startDate: startDate.toISOString(),
        endDate: newEndDate.toISOString(),
        isRenewal
      }
    });
  } catch (error) {
    console.error('Error renewing membership:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
