export const SMSEvent = {
  SEND_INITIATED: 'SEND_INITIATED',
  SEND_SUCCESS: 'SEND_SUCCESS',
  SEND_FAILED: 'SEND_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SUBSCRIPTION_EXPIRY_CHECK: 'SUBSCRIPTION_EXPIRY_CHECK',
  SUBSCRIPTION_EXPIRY_FOUND: 'SUBSCRIPTION_EXPIRY_FOUND',
  SUBSCRIPTION_NOTIFICATION_SENT: 'SUBSCRIPTION_NOTIFICATION_SENT',
};

export class SMSLogger {
  constructor(context = {}) {
    this.context = context;
  }

  log(level, event, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      service: 'orange-sms',
      environment: process.env.NODE_ENV || 'development',
      context: this.context,
      ...data,
    };

    const message = JSON.stringify(logEntry);

    switch (level) {
      case 'ERROR':
        console.error(message);
        break;
      case 'WARN':
        console.warn(message);
        break;
      case 'DEBUG':
        if (process.env.NODE_ENV === 'development') {
          console.debug(message);
        }
        break;
      default:
        console.log(message);
    }
  }

  info(event, data) {
    this.log('INFO', event, data);
  }

  error(event, data) {
    this.log('ERROR', event, data);
  }

  warn(event, data) {
    this.log('WARN', event, data);
  }

  debug(event, data) {
    this.log('DEBUG', event, data);
  }
}

export function createLogger(context) {
  return new SMSLogger(context);
}
