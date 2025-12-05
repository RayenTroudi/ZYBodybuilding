import '@testing-library/jest-dom';

process.env.RESEND_API_KEY = 'test-api-key';
process.env.EMAIL_FROM = 'test@example.com';
process.env.EMAIL_FROM_NAME = 'TestGym';
process.env.EMAIL_RATE_LIMIT_PER_HOUR = '100';
process.env.EMAIL_RATE_LIMIT_PER_DAY = '500';
process.env.EMAIL_MAX_RETRIES = '3';
process.env.EMAIL_RETRY_DELAY_MS = '2000';
process.env.NODE_ENV = 'test';


