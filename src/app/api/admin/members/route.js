import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

/**
 * Create a user account for a gym member
 * Uses memberId as initial password (member must change on first login)
 */
async function createMemberUserAccount(memberData) {
  try {
    const { account, databases } = createAdminClient();
    
    // Check if user with this email already exists
    try {
      const existingUsers = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email', memberData.email), Query.limit(1)]
      );
      
      if (existingUsers.documents.length > 0) {
        console.log('⚠️ User account already exists for:', memberData.email);
        return { success: true, existing: true };
      }
    } catch (e) {
      // Collection might not exist yet, continue
    }

    // Create user account in Appwrite Auth with memberId as initial password
    const user = await account.create(
      ID.unique(),
      memberData.email,
      memberData.memberId, // Initial password is the memberId
      memberData.name
    );
    console.log('✅ User account created for member:', user.$id);

    // Store user metadata in users collection
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user.$id,
      {
        userId: user.$id,
        email: memberData.email,
        name: memberData.name,
        role: 'member', // Role is 'member' for gym members
        memberId: memberData.memberId,
        requiresPasswordReset: true, // Must change password on first login
        createdAt: new Date().toISOString(),
        createdByAdmin: true,
      }
    );
    console.log('✅ User metadata stored for member');

    return { success: true, userId: user.$id };
  } catch (error) {
    console.error('❌ Failed to create member user account:', error.message);
    // Don't fail the member creation if user account fails
    return { success: false, error: error.message };
  }
}

// GET all members or search
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '5000');
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

    return NextResponse.json(members, {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60'
      }
    });
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
    const { initialPayment, paymentMethod, planDuration, includeAssurance, ...memberFields } = data;

    const memberData = {
      ...memberFields,
      subscriptionEndDate: endDate.toISOString(),
      status: 'Active',
      totalPaid: parseFloat(initialPayment || 0),
      hasAssurance: includeAssurance || false,
      assuranceAmount: includeAssurance ? 20 : 0,
    };

    const member = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      ID.unique(),
      memberData
    );

    // Create initial payment record if payment was made
    if (initialPayment && parseFloat(initialPayment) > 0) {
      const paymentNotes = data.includeAssurance 
        ? 'Initial payment (includes 20 DT assurance)'
        : 'Initial payment';
      
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
          paymentDate: startDate.toISOString(),
          paymentMethod: paymentMethod || 'Cash',
          status: 'Completed',
          notes: paymentNotes,
          includesAssurance: data.includeAssurance || false,
          assuranceAmount: data.includeAssurance ? 20 : 0,
        }
      );
    }

    // Create user account for the member (for dashboard access)
    const userAccountResult = await createMemberUserAccount(memberData);
    
    return NextResponse.json({
      ...member,
      userAccountCreated: userAccountResult.success,
      userAccountError: userAccountResult.error || null,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
