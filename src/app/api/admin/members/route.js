import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

// GET all members or search
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { databases } = createAdminClient();
    
    let queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];
    
    if (status && status !== 'all') {
      queries.push(Query.equal('status', status));
    }

    // Note: Not adding search query here, will filter on client side
    // because Query.search() requires a full-text index which may not be set up

    let members = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      queries
    );

    // Filter by search on the server side after fetching
    if (search && members.documents) {
      const searchLower = search.toLowerCase();
      members.documents = members.documents.filter(member => 
        member.name?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.memberId?.toLowerCase().includes(searchLower)
      );
      members.total = members.documents.length;
    }

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST - Create new member
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Calculate subscription end date based on plan duration
    const startDate = new Date(data.subscriptionStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(data.planDuration));

    // Remove fields that aren't part of the member schema
    const { initialPayment, paymentMethod, planDuration, ...memberFields } = data;

    const memberData = {
      ...memberFields,
      subscriptionEndDate: endDate.toISOString(),
      status: 'Active',
      totalPaid: parseFloat(initialPayment || 0),
    };

    const member = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      ID.unique(),
      memberData
    );

    // Create initial payment record if payment was made
    if (initialPayment && parseFloat(initialPayment) > 0) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.paymentsCollectionId,
        ID.unique(),
        {
          memberId: memberData.memberId,
          memberName: memberData.name,
          planId: memberData.planId,
          planName: memberData.planName,
          amount: parseFloat(initialPayment),
          paymentDate: new Date().toISOString(),
          paymentMethod: paymentMethod || 'Cash',
          status: 'Completed',
          notes: 'Initial payment',
        }
      );
    }

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
