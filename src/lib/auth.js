'use server';

import { cookies } from 'next/headers';
import { createSessionClient, createAdminClient } from './appwrite/server';
import { ADMIN_TEAM_ID, appwriteConfig } from './appwrite/config';

export async function getLoggedInUser() {
  try {
    console.log('👤 Getting logged in user...');
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie || !sessionCookie.value) {
      console.log('❌ No session cookie found');
      return null;
    }

    console.log('✅ Session cookie found, parsing session...');
    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (parseError) {
      console.error('❌ Failed to parse session cookie:', parseError.message);
      // Delete invalid cookie
      cookieStore.delete('session');
      return null;
    }
    
    if (!session || !session.secret) {
      console.log('❌ Invalid session data');
      cookieStore.delete('session');
      return null;
    }
    
    const { account } = createSessionClient(session.secret);
    const user = await account.get();
    console.log('✅ User retrieved:', user.email);
    
    return user;
  } catch (error) {
    console.error('❌ getLoggedInUser error:', error.message);
    return null;
  }
}

export async function isAdmin() {
  try {
    console.log('🔐 Checking admin status...');
    const user = await getLoggedInUser();
    if (!user) {
      console.log('❌ No user logged in');
      return false;
    }

    console.log('👥 Checking role for user:', user.email);
    const { databases } = createAdminClient();
    
    try {
      // Check user role in users collection
      const userDoc = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        user.$id
      );
      
      const isAdminUser = userDoc.role === 'admin';
      console.log(isAdminUser ? '✅ User is admin' : '❌ User is not admin');
      return isAdminUser;
    } catch (docError) {
      // If user document doesn't exist, fall back to team check
      console.log('⚠️  User document not found, checking teams...');
      const { teams } = createAdminClient();
      const memberships = await teams.listMemberships(ADMIN_TEAM_ID);
      
      const isAdminUser = memberships.memberships.some(
        membership => membership.userId === user.$id
      );
      
      console.log(isAdminUser ? '✅ User is admin (via team)' : '❌ User is not admin');
      return isAdminUser;
    }
  } catch (error) {
    console.error('❌ isAdmin error:', error.message);
    return false;
  }
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return true;
}

export async function requireUser() {
  const user = await getLoggedInUser();
  if (!user) {
    throw new Error('Unauthorized: Login required');
  }
  return user;
}

export async function signIn(email, password) {
  try {
    console.log('🔧 Creating admin client...');
    const { account } = createAdminClient();
    
    console.log('🔑 Creating email/password session...');
    const session = await account.createEmailPasswordSession(email, password);
    console.log('✅ Session created:', session.$id);
    
    console.log('🍪 Setting session cookie...');
    const cookieStore = await cookies();
    // Store the complete session as JSON
    cookieStore.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    console.log('✅ Cookie set successfully');

    return { success: true };
  } catch (error) {
    console.error('❌ SignIn error:', error);
    return { success: false, error: error.message };
  }
}

export async function register(email, password, name) {
  try {
    console.log('📝 Creating new user account...');
    const { account, databases, users } = createAdminClient();

    // Create user account in Appwrite Auth
    const user = await account.create('unique()', email, password, name);
    console.log('✅ User account created:', user.$id);

    // Disable the account until an admin activates it
    await users.updateStatus(user.$id, false);
    console.log('🔒 User account disabled pending admin approval');

    // Store user metadata in users collection
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user.$id,
      {
        userId: user.$id,
        email: user.email,
        name: user.name || name,
        role: 'user', // default role
        createdAt: new Date().toISOString(),
      }
    );
    console.log('✅ User metadata stored');

    return { success: true, userId: user.$id };
  } catch (error) {
    console.error('❌ Register error:', error);
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (sessionCookie && sessionCookie.value) {
      try {
        const session = JSON.parse(sessionCookie.value);
        if (session && session.secret) {
          const { account } = createSessionClient(session.secret);
          await account.deleteSession('current');
        }
      } catch (parseError) {
        console.log('⚠️  Could not parse session during logout:', parseError.message);
        // Continue to delete cookie anyway
      }
    }
    
    // Always delete the cookie, even if session deletion failed
    cookieStore.delete('session');

    return { success: true };
  } catch (error) {
    console.error('❌ SignOut error:', error);
    // Still try to delete cookie
    try {
      const cookieStore = await cookies();
      cookieStore.delete('session');
    } catch (e) {
      // Ignore
    }
    return { success: false, error: error.message };
  }
}
