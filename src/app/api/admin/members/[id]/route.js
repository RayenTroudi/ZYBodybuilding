import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';
import { Query } from 'node-appwrite';

// GET single member
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();
    const member = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      id
    );

    // Get payment history for this member
    const payments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.paymentsCollectionId,
      [
        Query.equal('memberId', member.memberId),
        Query.orderDesc('paymentDate'),
      ]
    );

    return NextResponse.json({ member, payments: payments.documents });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 404 }
    );
  }
}

// PATCH - Update member
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const data = await request.json();
    const { databases } = createAdminClient();

    const member = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      id,
      data
    );

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE member
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { databases } = createAdminClient();
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
