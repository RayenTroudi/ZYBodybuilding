import { sendOrangeSMS } from './client';
import { validateAndFormatPhone, maskPhoneNumber } from './validation';
import { checkRateLimit } from './rateLimit';
import { createLogger, SMSEvent } from './logger';
import { incrementMetric } from './metrics';
import { orangeConfig } from './config';

const logger = createLogger({ service: 'sms' });

export const SMS_TYPES = {
  NOTIFICATION: 'notification',
  REMINDER: 'reminder',
  ALERT: 'alert',
  SUBSCRIPTION_EXPIRY: 'subscription_expiry',
};

export async function sendSMS({ to, body, type = SMS_TYPES.NOTIFICATION, metadata = {}, requestId = null }) {
  const startTime = Date.now();

  logger.info(SMSEvent.SEND_INITIATED, {
    to: maskPhoneNumber(to),
    type,
    requestId,
  });

  const validatedPhone = validateAndFormatPhone(to);
  if (!validatedPhone.valid) {
    logger.error(SMSEvent.VALIDATION_ERROR, {
      error: validatedPhone.error,
      to: maskPhoneNumber(to),
    });
    incrementMetric('errors', 'validation');
    return {
      success: false,
      error: validatedPhone.error,
      code: 'INVALID_PHONE_NUMBER',
    };
  }

  const phoneLimit = checkRateLimit(validatedPhone.formatted, 'phone');
  if (!phoneLimit.allowed) {
    logger.warn(SMSEvent.RATE_LIMITED, {
      to: maskPhoneNumber(validatedPhone.formatted),
      resetAt: new Date(phoneLimit.resetAt).toISOString(),
    });
    incrementMetric('rateLimit', 'phone');
    return {
      success: false,
      error: 'Rate limit exceeded for this phone number',
      code: 'RATE_LIMITED',
      resetAt: phoneLimit.resetAt,
    };
  }

  const globalLimit = checkRateLimit('global', 'global');
  if (!globalLimit.allowed) {
    logger.warn(SMSEvent.RATE_LIMITED, {
      type: 'global',
      resetAt: new Date(globalLimit.resetAt).toISOString(),
    });
    return {
      success: false,
      error: 'Daily SMS limit reached',
      code: 'GLOBAL_RATE_LIMITED',
      resetAt: globalLimit.resetAt,
    };
  }

  const maxRetries = orangeConfig.retry.maxRetries;
  const baseDelay = orangeConfig.retry.delayMs;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendOrangeSMS(validatedPhone.formatted, body);

      logger.info(SMSEvent.SEND_SUCCESS, {
        to: maskPhoneNumber(validatedPhone.formatted),
        messageId: result.messageId,
        type,
        duration: Date.now() - startTime,
        attempt,
      });

      incrementMetric('sms', 'sent');
      incrementMetric('sms', 'delivered');

      return {
        success: true,
        messageId: result.messageId,
        status: result.status,
        to: validatedPhone.formatted,
        type,
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      lastError = error;

      logger.warn(SMSEvent.SEND_FAILED, {
        to: maskPhoneNumber(validatedPhone.formatted),
        error: error.message,
        attempt,
        willRetry: attempt < maxRetries,
      });

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  logger.error(SMSEvent.SEND_FAILED, {
    to: maskPhoneNumber(validatedPhone.formatted),
    error: lastError?.message,
    attempts: maxRetries,
  });

  incrementMetric('sms', 'failed');
  incrementMetric('errors', 'api');

  return {
    success: false,
    error: lastError?.message || 'Failed to send SMS',
    code: 'SEND_FAILED',
  };
}

export async function sendBulkSMS(recipients) {
  const results = [];

  for (const recipient of recipients) {
    const result = await sendSMS(recipient);
    results.push({
      to: recipient.to,
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}
