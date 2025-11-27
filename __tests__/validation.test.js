/**
 * Unit Tests for Phone Number Validation
 * Tests E.164 formatting, validation, and sanitization
 */

import {
  isValidE164,
  formatToE164,
  sanitizePhoneNumber,
  validateAndFormatPhone,
  maskPhoneNumber,
} from '../src/lib/twilio/validation';

describe('Phone Number Validation', () => {
  describe('isValidE164', () => {
    test('should validate correct E.164 format', () => {
      expect(isValidE164('+12345678900')).toBe(true);
      expect(isValidE164('+33123456789')).toBe(true);
      expect(isValidE164('+447911123456')).toBe(true);
    });

    test('should reject invalid formats', () => {
      expect(isValidE164('12345678900')).toBe(false); // Missing +
      expect(isValidE164('+1')).toBe(false); // Too short (only country code)
      expect(isValidE164('+1234567890123456')).toBe(false); // Too long (16+ digits)
      expect(isValidE164('+0123456789')).toBe(false); // Starts with 0
      expect(isValidE164('')).toBe(false);
      expect(isValidE164(null)).toBe(false);
    });
  });

  describe('formatToE164', () => {
    test('should format US numbers correctly', () => {
      expect(formatToE164('2345678900')).toBe('+12345678900');
      expect(formatToE164('1234567890')).toBe('+11234567890');
    });

    test('should handle already formatted numbers', () => {
      expect(formatToE164('12345678900')).toBe('+12345678900');
    });

    test('should return null for invalid inputs', () => {
      expect(formatToE164('123')).toBe(null);
      expect(formatToE164('')).toBe(null);
    });
  });

  describe('sanitizePhoneNumber', () => {
    test('should remove non-digit characters except +', () => {
      expect(sanitizePhoneNumber('+1 (234) 567-8900')).toBe('+12345678900');
      expect(sanitizePhoneNumber('234-567-8900')).toBe('2345678900');
      expect(sanitizePhoneNumber('+33 1 23 45 67 89')).toBe('+33123456789');
    });

    test('should handle empty/invalid inputs', () => {
      expect(sanitizePhoneNumber('')).toBe('');
      expect(sanitizePhoneNumber(null)).toBe('');
    });
  });

  describe('validateAndFormatPhone', () => {
    test('should validate and format correct numbers', () => {
      const result = validateAndFormatPhone('+12345678900');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('+12345678900');
      expect(result.error).toBe(null);
    });

    test('should format US numbers without country code', () => {
      const result = validateAndFormatPhone('2345678900');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('+12345678900');
    });

    test('should return error for invalid numbers', () => {
      const result = validateAndFormatPhone('123');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should handle empty input', () => {
      const result = validateAndFormatPhone('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });
  });

  describe('maskPhoneNumber', () => {
    test('should mask phone numbers correctly', () => {
      expect(maskPhoneNumber('+12345678900')).toMatch(/^\+1234\*\*\*8900$/);
      expect(maskPhoneNumber('+33123456789')).toMatch(/^\+3312\*\*\*6789$/);
    });

    test('should handle short numbers', () => {
      expect(maskPhoneNumber('+1234567')).toMatch(/\*\*\*/);
    });

    test('should return *** for invalid numbers', () => {
      expect(maskPhoneNumber('invalid')).toBe('***');
    });
  });
});
