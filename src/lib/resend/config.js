/**
 * Resend Email Configuration
 */

export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.EMAIL_FROM || 'ZY Bodybuilding <onboarding@resend.dev>',
  fromName: process.env.EMAIL_FROM_NAME || 'ZY Bodybuilding',
  
  // Rate limits
  rateLimitPerHour: parseInt(process.env.EMAIL_RATE_LIMIT_PER_HOUR || '100', 10),
  rateLimitPerDay: parseInt(process.env.EMAIL_RATE_LIMIT_PER_DAY || '500', 10),
  
  // Retry configuration
  maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES || '3', 10),
  retryDelayMs: parseInt(process.env.EMAIL_RETRY_DELAY_MS || '2000', 10),
};

export const EMAIL_TYPES = {
  verification: 'verification',
  welcome: 'welcome',
  promo: 'promo',
  reminder: 'reminder',
  notification: 'notification',
  alert: 'alert',
  paymentReceipt: 'payment_receipt',
  membershipExpiring: 'membership_expiring',
};

// Validate configuration
export function validateEmailConfig() {
  const errors = [];

  if (!emailConfig.apiKey) {
    errors.push('RESEND_API_KEY is not set');
  }

  if (errors.length > 0) {
    throw new Error(`Email configuration errors:\n${errors.join('\n')}`);
  }

  return true;
}
