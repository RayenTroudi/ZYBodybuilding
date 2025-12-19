import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// GET - List all users
export async function GET() {
  try {
    await requireAdmin();
    
    const { databases, users } = createAdminClient();

    // Get all users from auth
    const authUsers = await users.list();
    
    // Get user metadata from users collection
    const userDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.limit(500)]
    );

    // Merge auth data with metadata
    const usersWithMetadata = authUsers.users.map(authUser => {
      const metadata = userDocs.documents.find(doc => doc.userId === authUser.$id);
      return {
        id: authUser.$id,
        email: authUser.email,
        name: authUser.name,
        status: authUser.status,
        role: metadata?.role || 'user',
        createdAt: authUser.$createdAt,
        lastActivity: authUser.accessedAt,
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithMetadata,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request) {
  try {
    await requireAdmin();
    
    const { name, email, password, role } = await request.json();
    const { account, databases } = createAdminClient();

    // Create user in Appwrite Auth
    const user = await account.create('unique()', email, password, name);

    // Store user metadata
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user.$id,
      {
        userId: user.$id,
        email: user.email,
        name: user.name || name,
        role: role || 'user',
        createdAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
        role: role || 'user',
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
