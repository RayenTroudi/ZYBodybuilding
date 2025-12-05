/**
 * Email Event Logger
 */

export const EmailEvent = {
  SEND_ATTEMPT: 'EMAIL_SEND_ATTEMPT',
  SEND_SUCCESS: 'EMAIL_SEND_SUCCESS',
  SEND_FAILED: 'EMAIL_SEND_FAILED',
  SEND_RETRY: 'EMAIL_SEND_RETRY',
  RATE_LIMIT_HIT: 'EMAIL_RATE_LIMIT_HIT',
  VALIDATION_ERROR: 'EMAIL_VALIDATION_ERROR',
};

export function createLogger(context = {}) {
  const logWithContext = (level, event, message, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      message,
      ...context,
      ...data,
    };

    const logMessage = `[${logEntry.timestamp}] [${level.toUpperCase()}] [${event}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, logEntry);
        break;
      case 'warn':
        console.warn(logMessage, logEntry);
        break;
      case 'info':
      default:
        console.log(logMessage, logEntry);
        break;
    }

    return logEntry;
  };

  return {
    info: (event, message, data) => logWithContext('info', event, message, data),
    warn: (event, message, data) => logWithContext('warn', event, message, data),
    error: (event, message, data) => logWithContext('error', event, message, data),
  };
}
