export const orangeConfig = {
  clientId: process.env.ORANGE_SMS_CLIENT_ID,
  clientSecret: process.env.ORANGE_SMS_CLIENT_SECRET,
  senderName: process.env.ORANGE_SMS_SENDER_NAME,
  senderPhone: process.env.ORANGE_SMS_SENDER_PHONE,
  apiBaseUrl: process.env.ORANGE_SMS_API_BASE_URL || 'https://api.orange.com/smsmessaging/v1',
  tokenUrl: process.env.ORANGE_SMS_TOKEN_URL || 'https://api.orange.com/oauth/v3/token',
  rateLimits: {
    perHour: parseInt(process.env.SMS_RATE_LIMIT_PER_HOUR) || 100,
    perDay: parseInt(process.env.SMS_RATE_LIMIT_PER_DAY) || 500,
  },
  retry: {
    maxRetries: parseInt(process.env.SMS_MAX_RETRIES) || 3,
    delayMs: parseInt(process.env.SMS_RETRY_DELAY_MS) || 2000,
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export function validateOrangeConfig() {
  const missingVars = [];
  if (!orangeConfig.clientId) missingVars.push('ORANGE_SMS_CLIENT_ID');
  if (!orangeConfig.clientSecret) missingVars.push('ORANGE_SMS_CLIENT_SECRET');
  if (!orangeConfig.senderPhone) missingVars.push('ORANGE_SMS_SENDER_PHONE');
  if (missingVars.length > 0) {
    throw new Error(`Missing Orange SMS configuration: ${missingVars.join(', ')}`);
  }
  return true;
}

export function getOrangeFallback() {
  return {
    configured: false,
    mode: 'development',
    message: 'Orange SMS not configured. Set environment variables.',
  };
}
