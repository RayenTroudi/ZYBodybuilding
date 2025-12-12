/**
 * Email Sending Functions
 */

import { getResendClient } from './client';
import { emailConfig, EMAIL_TYPES } from './config';
import { createLogger, EmailEvent } from './logger';
import { recordEmailMetric } from './metrics';
import {
  getWelcomeEmailHtml,
  getClassReminderEmailHtml,
  getPaymentReminderEmailHtml,
  getMembershipExpiringEmailHtml,
  getPromoEmailHtml,
  getGenericEmailHtml,
} from './templates';

const logger = createLogger({ module: 'email' });

/**
 * Send an email using Resend
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML email content
 * @param {string} [params.text] - Plain text email content (fallback)
 * @param {string} [params.type] - Email type for tracking
 * @param {Object} [params.metadata] - Additional metadata for logging
 * @returns {Promise<Object>} - Send result with messageId
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  type = EMAIL_TYPES.notification,
  metadata = {},
}) {
  const startTime = Date.now();
  
  try {
    // Validate inputs
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters: to, subject, html');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    const resend = getResendClient();

    // Send email with retry logic
    let lastError = null;
    for (let attempt = 1; attempt <= emailConfig.maxRetries; attempt++) {
      try {
        logger.info(EmailEvent.SEND_ATTEMPT, `Sending email (attempt ${attempt}/${emailConfig.maxRetries})`, {
          to,
          subject,
          type,
          attempt,
        });

        const result = await resend.emails.send({
          from: emailConfig.fromEmail,
          to: [to],
          subject,
          html,
          text: text || stripHtml(html),
          headers: {
            'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          },
          tags: [
            {
              name: 'category',
              value: type || 'general',
            },
          ],
        });

        // Check if result has error
        if (result.error) {
          throw new Error(`Resend API error: ${JSON.stringify(result.error)}`);
        }

        const duration = Date.now() - startTime;

        logger.info(EmailEvent.SEND_SUCCESS, 'Email sent successfully', {
          to,
          subject,
          type,
          messageId: result.data?.id || result.id,
          duration,
          attempt,
        });

        // Record metrics
        await recordEmailMetric({
          to,
          type,
          status: 'sent',
          messageId: result.data?.id || result.id,
          duration,
          metadata,
        });

        return {
          success: true,
          messageId: result.data?.id || result.id,
          to,
          subject,
          type,
          duration,
        };

      } catch (error) {
        lastError = error;
        
        // Log detailed error information
        const errorMessage = error.message || 'Unknown error';
        const errorDetails = {
          to,
          subject,
          attempt,
          error: errorMessage,
          statusCode: error.statusCode,
          name: error.name,
        };
        
        // Check for specific error types
        if (error.statusCode === 403) {
          errorDetails.reason = 'API key invalid or revoked';
        } else if (error.statusCode === 429) {
          errorDetails.reason = 'Rate limit exceeded';
        } else if (error.statusCode === 422) {
          errorDetails.reason = 'Invalid email data';
        }
        
        logger.warn(EmailEvent.SEND_RETRY, `Email send attempt ${attempt} failed`, errorDetails);

        // Wait before retry (except on last attempt)
        if (attempt < emailConfig.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, emailConfig.retryDelayMs * attempt));
        }
      }
    }

    // All retries failed
    const duration = Date.now() - startTime;
    
    logger.error(EmailEvent.SEND_FAILED, 'Email send failed after all retries', {
      to,
      subject,
      type,
      error: lastError.message,
      duration,
    });

    await recordEmailMetric({
      to,
      type,
      status: 'failed',
      error: lastError.message,
      duration,
      metadata,
    });

    throw lastError;

  } catch (error) {
    logger.error(EmailEvent.SEND_FAILED, 'Email send error', {
      to,
      subject,
      type,
      error: error.message,
    });

    throw error;
  }
}

/**
 * Strip HTML tags for plain text fallback
 */
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to, memberName) {
  const subject = 'Bienvenue chez ZY Bodybuilding!';
  const html = getWelcomeEmailHtml(memberName);

  return sendEmail({
    to,
    subject,
    html,
    type: EMAIL_TYPES.welcome,
    metadata: { memberName },
  });
}

/**
 * Send class reminder email
 */
export async function sendClassReminderEmail(to, className, date, time) {
  const subject = `Rappel: Cours ${className} Aujourd'hui`;
  const html = getClassReminderEmailHtml(className, date, time);

  return sendEmail({
    to,
    subject,
    html,
    type: EMAIL_TYPES.reminder,
    metadata: { className, date, time },
  });
}

/**
 * Send payment reminder email
 */
export async function sendPaymentReminderEmail(to, memberName, amount, dueDate) {
  const subject = 'Rappel de Paiement - ZY Bodybuilding';
  const html = getPaymentReminderEmailHtml(memberName, amount, dueDate);

  return sendEmail({
    to,
    subject,
    html,
    type: EMAIL_TYPES.reminder,
    metadata: { memberName, amount, dueDate },
  });
}

/**
 * Send membership expiring email
 */
export async function sendMembershipExpiringEmail(to, memberName, daysRemaining) {
  const subject = 'Votre Adhésion Expire Bientôt';
  const html = getMembershipExpiringEmailHtml(memberName, daysRemaining);

  return sendEmail({
    to,
    subject,
    html,
    type: EMAIL_TYPES.alert,
    metadata: { memberName, daysRemaining },
  });
}

/**
 * Send promotional email
 */
export async function sendPromoEmail(to, promoTitle, promoDescription, discount, validUntil) {
  const subject = `🎉 Offre Spéciale: ${promoTitle}`;
  const html = getPromoEmailHtml(promoTitle, promoDescription, discount, validUntil);

  return sendEmail({
    to,
    subject,
    html,
    type: EMAIL_TYPES.promo,
    metadata: { promoTitle, discount, validUntil },
  });
}

export { EMAIL_TYPES };
