/**
 * POST /api/sms/send
 * Sends an SMS message
 * 
 * Security:
 * - Admin authentication required
 * - Rate limiting per IP
 * - Input validation and sanitization
 * 
 * Request body:
 * {
 *   "to": "+12345678900",      // E.164 format phone number
 *   "body": "Message text",     // Message content
 *   "type": "notification",     // Optional: verification, promo, reminder, notification, alert
 *   "metadata": {}              // Optional: additional context
 * }
 */

import { NextResponse } from 'next/server';
import { getLoggedInUser, isAdmin } from '@/lib/auth';
import { sendSMS, SMS_TYPES } from '@/lib/orange/sms';
import { checkRateLimit } from '@/lib/orange/rateLimit';
import { createLogger, SMSEvent } from '@/lib/orange/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const logger = createLogger({ endpoint: '/api/sms/send' });

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    // Step 1: Authenticate user
    const user = await getLoggedInUser();
    const adminAccess = await isAdmin();
    
    if (!user || !adminAccess) {
      logger.warn(SMSEvent.SEND_FAILED, 'Unauthorized access attempt', {
        user: user?.email || 'anonymous',
      });
      
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    
    // Step 2: Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check IP rate limit
    const rateLimitCheck = checkRateLimit(ip, 'ip');
    if (!rateLimitCheck.allowed) {
      logger.warn(SMSEvent.RATE_LIMIT_EXCEEDED, 'IP rate limit exceeded', {
        ip,
        remaining: rateLimitCheck.remaining,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: new Date(rateLimitCheck.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitCheck.limit.toString(),
            'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
            'X-RateLimit-Reset': rateLimitCheck.resetAt.toString(),
          },
        }
      );
    }
    
    // Step 3: Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { to, body: messageBody, type, metadata } = body;
    
    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Phone number (to) is required' },
        { status: 400 }
      );
    }
    
    if (!messageBody) {
      return NextResponse.json(
        { success: false, error: 'Message body is required' },
        { status: 400 }
      );
    }
    
    // Validate SMS type
    const validTypes = Object.values(SMS_TYPES);
    const smsType = type || SMS_TYPES.NOTIFICATION;
    
    if (!validTypes.includes(smsType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid SMS type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }
    
    // Step 4: Send SMS
    logger.info(SMSEvent.SEND_INITIATED, 'Admin sending SMS', {
      admin: user.email,
      type: smsType,
      bodyLength: messageBody.length,
    });
    
    const result = await sendSMS({
      to,
      body: messageBody,
      type: smsType,
      metadata: {
        ...metadata,
        sentBy: user.email,
        sentFrom: 'admin_panel',
      },
      requestId: `admin-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    });
    
    const duration = Date.now() - startTime;
    
    // Step 5: Return response
    if (result.success) {
      logger.info(SMSEvent.SEND_SUCCESS, 'SMS sent via admin panel', {
        admin: user.email,
        messageSid: result.sid,
        duration,
      });
      
      return NextResponse.json({
        success: true,
        data: result,
        message: 'SMS sent successfully',
      });
    } else {
      logger.error(SMSEvent.SEND_FAILED, 'Failed to send SMS via admin panel', null, {
        admin: user.email,
        error: result.error,
        duration,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          code: result.code,
        },
        { status: result.code === 'RATE_LIMIT_EXCEEDED' ? 429 : 500 }
      );
    }
    
  } catch (error) {
    logger.error(SMSEvent.SEND_FAILED, 'Unexpected error in SMS send API', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
