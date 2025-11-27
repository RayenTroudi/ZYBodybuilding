/**
 * GET /api/sms/metrics
 * Returns SMS metrics and statistics
 * 
 * Security: Admin authentication required
 */

import { NextResponse } from 'next/server';
import { getLoggedInUser, isAdmin } from '@/lib/auth';
import { getMetrics } from '@/lib/orange/metrics';
import { getOrangeStatus } from '@/lib/orange/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const user = await getLoggedInUser();
    const adminAccess = await isAdmin();
    
    if (!user || !adminAccess) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const metrics = getMetrics();
    const orangeStatus = await getOrangeStatus();
    
    return NextResponse.json({
      success: true,
      data: {
        orange: orangeStatus,
        metrics,
      },
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
