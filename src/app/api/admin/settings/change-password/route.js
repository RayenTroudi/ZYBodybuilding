import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionClient } from '@/lib/appwrite/server';
import { isAdmin } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    // Check if user is admin
    const adminAccess = await isAdmin();
    if (!adminAccess) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Get the request body
    const { oldPassword, newPassword } = await request.json();

    // Validate input
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Old password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from old password' },
        { status: 400 }
      );
    }

    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    // Parse the session JSON
    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (parseError) {
      console.error('❌ Failed to parse session cookie:', parseError);
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 401 }
      );
    }

    if (!session || !session.secret) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 401 }
      );
    }

    // Create session client to update password
    const { account } = createSessionClient(session.secret);

    // Update password using Appwrite's updatePassword method
    // This method requires the old password for verification
    await account.updatePassword(newPassword, oldPassword);

    // Delete the session cookie since password change invalidates sessions
    cookieStore.delete('session');

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });

  } catch (error) {
    console.error('❌ Password change error:', error);
    
    // Handle specific Appwrite errors
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status: 500 }
    );
  }
}
