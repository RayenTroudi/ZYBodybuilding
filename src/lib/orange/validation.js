export function isValidE164(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

export function formatToE164(phoneNumber, defaultCountryCode = '1') {
  if (!phoneNumber) return null;
  
  const cleaned = sanitizePhoneNumber(phoneNumber);
  
  if (cleaned.startsWith('+')) {
    return isValidE164(cleaned) ? cleaned : null;
  }
  
  const withCountryCode = `+${defaultCountryCode}${cleaned}`;
  return isValidE164(withCountryCode) ? withCountryCode : null;
}

export function sanitizePhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/[^\d+]/g, '');
}

export function validateAndFormatPhone(phoneNumber, defaultCountryCode = '1') {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      valid: false,
      formatted: null,
      error: 'Phone number is required',
    };
  }

  const sanitized = sanitizePhoneNumber(phoneNumber);
  
  if (isValidE164(sanitized)) {
    return {
      valid: true,
      formatted: sanitized,
      error: null,
    };
  }

  const formatted = formatToE164(phoneNumber, defaultCountryCode);
  
  if (formatted) {
    return {
      valid: true,
      formatted: formatted,
      error: null,
    };
  }

  return {
    valid: false,
    formatted: null,
    error: 'Invalid phone number format. Use E.164 format (e.g., +12345678900)',
  };
}

export function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return '***';
  }
  
  const cleaned = sanitizePhoneNumber(phoneNumber);
  
  if (cleaned.length < 8) {
    return '***';
  }
  
  const firstPart = cleaned.slice(0, 4);
  const lastPart = cleaned.slice(-4);
  const maskedLength = cleaned.length - 8;
  const masked = '*'.repeat(maskedLength);
  
  return `${firstPart}${masked}${lastPart}`;
}
