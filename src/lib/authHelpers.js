import { getLoggedInUser } from './auth';
import { getUserMembershipStatus } from './membership';

/**
 * Require a user with valid membership
 * Throws error if not logged in or membership is invalid
 */
export async function requireValidMembership() {
  const user = await getLoggedInUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Pass user email for fallback lookup if users collection doc doesn't exist
  const membershipStatus = await getUserMembershipStatus(user.$id, user.email);

  // Check for password reset requirement
  if (membershipStatus.requiresPasswordReset) {
    throw new Error('PASSWORD_RESET_REQUIRED');
  }

  // Check membership validity
  if (!membershipStatus.isValid) {
    throw new Error('MEMBERSHIP_INVALID');
  }

  return {
    user,
    membership: membershipStatus,
  };
}

/**
 * Get user with membership info (doesn't throw on invalid membership)
 * Useful for checking status without blocking
 */
export async function getUserWithMembership() {
  const user = await getLoggedInUser();
  
  if (!user) {
    return null;
  }

  // Pass user email for fallback lookup
  const membershipStatus = await getUserMembershipStatus(user.$id, user.email);

  return {
    user,
    membership: membershipStatus,
  };
}
