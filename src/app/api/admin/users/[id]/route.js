import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';

// GET - Get single user
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { users, databases } = createAdminClient();

    // Get user from auth
    const authUser = await users.get(id);

    // Get user metadata (may not exist for users without a metadata doc)
    let userDoc = null;
    try {
      userDoc = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        id
      );
    } catch (docError) {
      if (docError.code !== 404) throw docError;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.$id,
        email: authUser.email,
        name: authUser.name,
        status: authUser.status,
        role: userDoc?.role || 'user',
        createdAt: authUser.$createdAt,
        lastActivity: authUser.accessedAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update user role / status / name
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { role, name, status } = await request.json();
    const { databases, users } = createAdminClient();

    // Update role in metadata doc if provided
    if (role !== undefined) {
      try {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          id,
          { role }
        );
      } catch (docError) {
        if (docError.code !== 404) throw docError;
        // No metadata doc — create one
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          id,
          { userId: id, role }
        );
      }
    }

    // Update status in Appwrite Auth if provided
    if (status !== undefined) {
      await users.updateStatus(id, status);
    }

    // Update name if provided
    if (name) {
      await users.updateName(id, name);
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    
    const { id } = await params;
    const { users, databases } = createAdminClient();

    // Delete user metadata doc if it exists (not all users have one)
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        id
      );
    } catch (docError) {
      if (docError.code !== 404) throw docError;
    }

    // Delete user from auth
    await users.delete(id);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
