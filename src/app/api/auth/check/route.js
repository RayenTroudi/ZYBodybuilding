import { NextResponse } from 'next/server';
import { getLoggedInUser } from '@/lib/auth';
import { getUserMembershipStatus } from '@/lib/membership';

export async function GET() {
  try {
    const user = await getLoggedInUser();
    
    if (!user) {
      return NextResponse.json({ success: false, user: null });
    }

    // Get membership status for the user (pass email for fallback lookup)
    const membershipStatus = await getUserMembershipStatus(user.$id, user.email);

    return NextResponse.json({
      success: true,
      user: {
        $id: user.$id,
        email: user.email,
        name: user.name,
      },
      membership: {
        isValid: membershipStatus.isValid,
        status: membershipStatus.status,
        daysRemaining: membershipStatus.daysRemaining,
        isInGracePeriod: membershipStatus.isInGracePeriod,
        graceDaysLeft: membershipStatus.graceDaysLeft,
        message: membershipStatus.message,
        requiresPasswordReset: membershipStatus.requiresPasswordReset,
        member: membershipStatus.member ? {
          name: membershipStatus.member.name,
          memberId: membershipStatus.member.memberId,
          planName: membershipStatus.member.planName,
          subscriptionEndDate: membershipStatus.member.subscriptionEndDate,
        } : null,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, user: null });
  }
}
