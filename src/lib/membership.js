import { createAdminClient } from './appwrite/server';
import { appwriteConfig } from './appwrite/config';
import { Query } from 'node-appwrite';

/**
 * Membership status constants
 */
export const MEMBERSHIP_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  PAUSED: 'Paused',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
};

/**
 * Grace period in days - allow access for this many days after expiration
 */
export const GRACE_PERIOD_DAYS = 3;

/**
 * Get member data by user ID (linked via email)
 * Tries to find via users collection first, falls back to direct email lookup
 */
export async function getMemberByUserId(userId, userEmail = null) {
  try {
    const { databases } = createAdminClient();
    
    let email = userEmail;
    
    // First try to get the user document to find the email
    if (!email) {
      try {
        const userDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          userId
        );
        email = userDoc?.email;
      } catch (e) {
        // User document doesn't exist, will use userEmail if provided
        console.log('User document not found, will try email lookup');
      }
    }

    if (!email) {
      return null;
    }

    // Find member by email
    const members = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      [Query.equal('email', email), Query.limit(1)]
    );

    return members.documents[0] || null;
  } catch (error) {
    console.error('getMemberByUserId error:', error);
    return null;
  }
}

/**
 * Get member by their member ID
 */
export async function getMemberByMemberId(memberId) {
  try {
    const { databases } = createAdminClient();
    
    const members = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      [Query.equal('memberId', memberId), Query.limit(1)]
    );

    return members.documents[0] || null;
  } catch (error) {
    console.error('getMemberByMemberId error:', error);
    return null;
  }
}

/**
 * Get member by email
 */
export async function getMemberByEmail(email) {
  try {
    const { databases } = createAdminClient();
    
    const members = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      [Query.equal('email', email), Query.limit(1)]
    );

    return members.documents[0] || null;
  } catch (error) {
    console.error('getMemberByEmail error:', error);
    return null;
  }
}

/**
 * Check if membership is currently valid (active and not expired)
 * Returns: { isValid: boolean, status: string, daysRemaining: number, isInGracePeriod: boolean }
 */
export function checkMembershipValidity(member) {
  if (!member) {
    return { 
      isValid: false, 
      status: 'not_found', 
      daysRemaining: 0, 
      isInGracePeriod: false,
      message: 'No membership found'
    };
  }

  const now = new Date();
  const endDate = new Date(member.subscriptionEndDate);
  const diffTime = endDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Check for paused membership
  if (member.status === MEMBERSHIP_STATUS.PAUSED) {
    return {
      isValid: false,
      status: 'paused',
      daysRemaining: Math.max(0, daysRemaining),
      isInGracePeriod: false,
      message: 'Your membership is currently paused'
    };
  }

  // Check for cancelled membership
  if (member.status === MEMBERSHIP_STATUS.CANCELLED) {
    return {
      isValid: false,
      status: 'cancelled',
      daysRemaining: 0,
      isInGracePeriod: false,
      message: 'Your membership has been cancelled'
    };
  }

  // Check if membership is expired
  if (daysRemaining < 0) {
    // Check grace period
    const daysExpired = Math.abs(daysRemaining);
    if (daysExpired <= GRACE_PERIOD_DAYS) {
      return {
        isValid: true, // Still allow access during grace period
        status: 'grace_period',
        daysRemaining: 0,
        daysExpired,
        isInGracePeriod: true,
        graceDaysLeft: GRACE_PERIOD_DAYS - daysExpired,
        message: `Your membership expired ${daysExpired} day(s) ago. You have ${GRACE_PERIOD_DAYS - daysExpired} grace day(s) remaining.`
      };
    }

    return {
      isValid: false,
      status: 'expired',
      daysRemaining: 0,
      daysExpired,
      isInGracePeriod: false,
      message: 'Your membership has expired'
    };
  }

  // Active membership
  return {
    isValid: true,
    status: 'active',
    daysRemaining,
    isInGracePeriod: false,
    message: daysRemaining <= 7 
      ? `Your membership expires in ${daysRemaining} day(s)` 
      : 'Membership active'
  };
}

/**
 * Check if user requires password reset (first login with memberId as password)
 */
export async function checkRequiresPasswordReset(userId) {
  try {
    const { databases } = createAdminClient();
    
    const userDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    return userDoc.requiresPasswordReset === true;
  } catch (error) {
    // If user document doesn't exist, they don't need password reset
    // (they registered normally, not via admin-created member account)
    if (error.code === 404) {
      return false;
    }
    console.error('checkRequiresPasswordReset error:', error);
    return false;
  }
}

/**
 * Mark password reset as completed
 */
export async function markPasswordResetCompleted(userId) {
  try {
    const { databases } = createAdminClient();
    
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      {
        requiresPasswordReset: false,
        passwordResetCompletedAt: new Date().toISOString(),
      }
    );

    return { success: true };
  } catch (error) {
    console.error('markPasswordResetCompleted error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get full membership status for a user
 * @param {string} userId - The Appwrite auth user ID
 * @param {string} userEmail - Optional email for fallback lookup
 */
export async function getUserMembershipStatus(userId, userEmail = null) {
  const member = await getMemberByUserId(userId, userEmail);
  const validity = checkMembershipValidity(member);
  const requiresPasswordReset = await checkRequiresPasswordReset(userId);

  return {
    member,
    ...validity,
    requiresPasswordReset,
  };
}
