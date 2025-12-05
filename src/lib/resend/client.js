/**
 * Resend Email Client
 */

import { Resend } from 'resend';
import { emailConfig, validateEmailConfig } from './config';

let resendClient = null;

/**
 * Get or create Resend client instance
 */
export function getResendClient() {
  if (!resendClient) {
    try {
      validateEmailConfig();
      resendClient = new Resend(emailConfig.apiKey);
    } catch (error) {
      console.error('Failed to initialize Resend client:', error.message);
      throw error;
    }
  }
  
  return resendClient;
}

/**
 * Reset client (useful for testing)
 */
export function resetResendClient() {
  resendClient = null;
}
