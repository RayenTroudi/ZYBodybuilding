'use server';

import { cookies } from 'next/headers';
import { createSessionClient, createAdminClient } from './appwrite/server';
import { ADMIN_TEAM_ID } from './appwrite/config';

export async function getLoggedInUser() {
  try {
    console.log('👤 Getting logged in user...');
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (!session) {
      console.log('❌ No session cookie found');
      return null;
    }

    console.log('✅ Session cookie found, creating client...');
    const { account } = createSessionClient(session.value);
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

    console.log('👥 Checking team membership for user:', user.email);
    const { teams } = createAdminClient();
    const memberships = await teams.listMemberships(ADMIN_TEAM_ID);
    
    const isAdminUser = memberships.memberships.some(
      membership => membership.userId === user.$id
    );
    
    console.log(isAdminUser ? '✅ User is admin' : '❌ User is not admin');
    return isAdminUser;
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

export async function signIn(email, password) {
  try {
    console.log('🔧 Creating admin client...');
    const { account } = createAdminClient();
    
    console.log('🔑 Creating email/password session...');
    const session = await account.createEmailPasswordSession(email, password);
    console.log('✅ Session created:', session.$id);
    
    console.log('🍪 Setting session cookie...');
    const cookieStore = await cookies();
    cookieStore.set('session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (session) {
      const { account } = createSessionClient(session.value);
      await account.deleteSession('current');
      cookieStore.delete('session');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
