import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { ID, Query } from 'node-appwrite';

// GET all payments
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { databases } = createAdminClient();
    
    let queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('paymentDate')];
    
    if (memberId) {
      queries.push(Query.equal('memberId', memberId));
    }

    const payments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.paymentsCollectionId,
      queries
    );

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST - Create payment
export async function POST(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    const payment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.paymentsCollectionId,
      ID.unique(),
      {
        ...data,
        amount: parseFloat(data.amount),
        paymentDate: data.paymentDate || new Date().toISOString(),
        status: data.status || 'Completed',
      }
    );

    // Update member's total paid
    if (data.memberId) {
      const members = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.membersCollectionId,
        [Query.equal('memberId', data.memberId)]
      );

      if (members.documents.length > 0) {
        const member = members.documents[0];
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.membersCollectionId,
          member.$id,
          {
            totalPaid: parseFloat(member.totalPaid) + parseFloat(data.amount),
          }
        );
      }
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
