/**
 * GET /api/email/metrics
 * Get email sending metrics and statistics
 * 
 * Security:
 * - Admin authentication required
 * 
 * Query parameters:
 * - startDate: ISO date string (default: 7 days ago)
 * - endDate: ISO date string (default: now)
 */

import { NextResponse } from 'next/server';
import { getLoggedInUser, isAdmin } from '@/lib/auth';
import { getEmailStats, getEmailMetrics } from '@/lib/resend/metrics';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    // Authenticate user
    const user = await getLoggedInUser();
    const adminAccess = await isAdmin();
    
    if (!user || !adminAccess) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    // Default to last 7 days
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam 
      ? new Date(startDateParam) 
      : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get metrics and stats
    const [metrics, stats] = await Promise.all([
      getEmailMetrics(startDate, endDate),
      getEmailStats(startDate, endDate),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        metrics,
        stats,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
    });
    
  } catch (error) {
    console.error('Error fetching email metrics:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email metrics' },
      { status: 500 }
    );
  }
}
