/**
 * POST /api/email/send
 * Sends an email using Resend
 * 
 * Security:
 * - Admin authentication required
 * - Rate limiting per IP
 * - Input validation and sanitization
 * 
 * Request body:
 * {
 *   "to": "user@example.com",
 *   "subject": "Email subject",
 *   "html": "<p>Email content</p>",
 *   "text": "Email content",     // Optional: plain text fallback
 *   "type": "notification",      // Optional: verification, welcome, promo, reminder, notification, alert
 *   "metadata": {}               // Optional: additional context
 * }
 */

import { NextResponse } from 'next/server';
import { getLoggedInUser, isAdmin } from '@/lib/auth';
import { sendEmail, EMAIL_TYPES } from '@/lib/resend/email';
import { checkRateLimit, recordRateLimitUsage } from '@/lib/resend/rateLimit';
import { createLogger, EmailEvent } from '@/lib/resend/logger';
import { validateEmail, validateSubject, validateBody, sanitizeHtml } from '@/lib/resend/validation';
import { getGenericEmailHtml } from '@/lib/resend/templates';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const logger = createLogger({ endpoint: '/api/email/send' });

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    // Step 1: Authenticate user
    const user = await getLoggedInUser();
    const adminAccess = await isAdmin();
    
    if (!user || !adminAccess) {
      logger.warn(EmailEvent.SEND_FAILED, 'Unauthorized access attempt', {
        user: user?.email || 'anonymous',
      });
      
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    
    // Step 2: Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    
    // Step 3: Check rate limit
    const rateLimitCheck = await checkRateLimit(ip);
    
    if (!rateLimitCheck.allowed) {
      logger.warn(EmailEvent.RATE_LIMIT_HIT, 'Rate limit exceeded', {
        ip,
        reason: rateLimitCheck.reason,
        limit: rateLimitCheck.limit,
        current: rateLimitCheck.current,
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: rateLimitCheck.reason,
          resetAt: rateLimitCheck.resetAt,
        },
        { status: 429 }
      );
    }
    
    // Step 4: Parse and validate request body
    const body = await request.json();
    const { to, subject, html, text, type = EMAIL_TYPES.notification, metadata = {} } = body;
    
    // Validate email
    const emailValidation = validateEmail(to);
    if (!emailValidation.valid) {
      logger.warn(EmailEvent.VALIDATION_ERROR, 'Invalid email address', {
        error: emailValidation.error,
        to,
      });
      
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      );
    }
    
    // Validate subject
    const subjectValidation = validateSubject(subject);
    if (!subjectValidation.valid) {
      logger.warn(EmailEvent.VALIDATION_ERROR, 'Invalid subject', {
        error: subjectValidation.error,
      });
      
      return NextResponse.json(
        { success: false, error: subjectValidation.error },
        { status: 400 }
      );
    }
    
    // Validate body
    const bodyValidation = validateBody(html);
    if (!bodyValidation.valid) {
      logger.warn(EmailEvent.VALIDATION_ERROR, 'Invalid email body', {
        error: bodyValidation.error,
      });
      
      return NextResponse.json(
        { success: false, error: bodyValidation.error },
        { status: 400 }
      );
    }
    
    // Validate email type
    if (!Object.values(EMAIL_TYPES).includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email type' },
        { status: 400 }
      );
    }
    
    // Process content - convert newlines to HTML paragraphs
    let processedHtml = html;
    
    // If content doesn't contain HTML tags, convert plain text to HTML
    if (!html.includes('<') && !html.includes('>')) {
      // Split by double newlines for paragraphs
      const paragraphs = html.split('\n\n').filter(p => p.trim());
      processedHtml = paragraphs.map(p => {
        // Convert single newlines to <br> within paragraphs
        const withBreaks = p.trim().replace(/\n/g, '<br>');
        return `<p>${withBreaks}</p>`;
      }).join('\n');
    }
    
    // Sanitize HTML
    const sanitizedHtml = sanitizeHtml(processedHtml);
    
    // Wrap content in branded template
    const brandedHtml = getGenericEmailHtml(subjectValidation.subject, sanitizedHtml);
    
    // Step 5: Send email
    logger.info(EmailEvent.SEND_ATTEMPT, 'Attempting to send email', {
      to: emailValidation.email,
      subject: subjectValidation.subject,
      type,
      admin: user.email,
    });
    
    const result = await sendEmail({
      to: emailValidation.email,
      subject: subjectValidation.subject,
      html: brandedHtml,
      text,
      type,
      metadata: {
        ...metadata,
        sentBy: user.email,
        sentFrom: ip,
      },
    });
    
    // Step 6: Record rate limit usage
    await recordRateLimitUsage(ip);
    
    // Step 7: Return success response
    const duration = Date.now() - startTime;
    
    logger.info(EmailEvent.SEND_SUCCESS, 'Email sent successfully via API', {
      to: emailValidation.email,
      subject: subjectValidation.subject,
      type,
      messageId: result.messageId,
      duration,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        messageId: result.messageId,
        to: result.to,
        subject: result.subject,
        type: result.type,
        sentAt: new Date().toISOString(),
      },
      rateLimit: {
        hourly: rateLimitCheck.hourly,
        daily: rateLimitCheck.daily,
      },
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error(EmailEvent.SEND_FAILED, 'Email send request failed', {
      error: error.message,
      stack: error.stack,
      duration,
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send email',
      },
      { status: 500 }
    );
  }
}
