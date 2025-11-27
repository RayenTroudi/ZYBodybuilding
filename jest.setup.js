import '@testing-library/jest-dom';

process.env.ORANGE_SMS_CLIENT_ID = 'test-client-id';
process.env.ORANGE_SMS_CLIENT_SECRET = 'test-client-secret';
process.env.ORANGE_SMS_SENDER_NAME = 'TestGym';
process.env.ORANGE_SMS_SENDER_PHONE = '+1234567890';
process.env.SMS_RATE_LIMIT_PER_HOUR = '100';
process.env.SMS_RATE_LIMIT_PER_DAY = '500';
process.env.SMS_MAX_RETRIES = '3';
process.env.SMS_RETRY_DELAY_MS = '2000';
process.env.NODE_ENV = 'test';

