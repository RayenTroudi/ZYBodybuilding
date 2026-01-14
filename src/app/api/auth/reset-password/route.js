import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient, createSessionClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { getLoggedInUser } from '@/lib/auth';
import { markPasswordResetCompleted } from '@/lib/membership';

export async function POST(request) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const { account } = createSessionClient(session.secret);

    try {
      // Update password using Appwrite's account.updatePassword
      // This requires the current password and validates it
      await account.updatePassword(newPassword, currentPassword);
      
      // Mark password reset as completed in our database
      await markPasswordResetCompleted(user.$id);

      return NextResponse.json({ 
        success: true,
        message: 'Password updated successfully' 
      });
    } catch (updateError) {
      console.error('Password update error:', updateError);
      
      // Handle specific Appwrite errors
      if (updateError.code === 401 || updateError.message?.includes('Invalid credentials')) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: updateError.message || 'Failed to update password' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
