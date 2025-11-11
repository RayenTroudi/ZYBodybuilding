'use server';

import { cookies } from 'next/headers';
import { createSessionClient, createAdminClient } from './appwrite/server';
import { ADMIN_TEAM_ID } from './appwrite/config';

export async function getLoggedInUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (!session) {
      return null;
    }

    const { account } = createSessionClient(session.value);
    const user = await account.get();
    
    return user;
  } catch (error) {
    return null;
  }
}

export async function isAdmin() {
  try {
    const user = await getLoggedInUser();
    if (!user) return false;

    const { teams } = createAdminClient();
    const memberships = await teams.listMemberships(ADMIN_TEAM_ID);
    
    return memberships.memberships.some(
      membership => membership.userId === user.$id
    );
  } catch (error) {
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
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    
    const cookieStore = await cookies();
    cookieStore.set('session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return { success: true };
  } catch (error) {
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
