/**
 * Email Input Validation
 */

/**
 * Validate email address format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    return { valid: false, error: 'Email cannot be empty' };
  }

  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true, email: trimmedEmail };
}

/**
 * Validate email subject
 */
export function validateSubject(subject) {
  if (!subject || typeof subject !== 'string') {
    return { valid: false, error: 'Subject is required' };
  }

  const trimmedSubject = subject.trim();
  
  if (trimmedSubject.length === 0) {
    return { valid: false, error: 'Subject cannot be empty' };
  }

  if (trimmedSubject.length > 200) {
    return { valid: false, error: 'Subject is too long (max 200 characters)' };
  }

  return { valid: true, subject: trimmedSubject };
}

/**
 * Validate email body
 */
export function validateBody(body) {
  if (!body || typeof body !== 'string') {
    return { valid: false, error: 'Email body is required' };
  }

  const trimmedBody = body.trim();
  
  if (trimmedBody.length === 0) {
    return { valid: false, error: 'Email body cannot be empty' };
  }

  if (trimmedBody.length > 50000) {
    return { valid: false, error: 'Email body is too long (max 50,000 characters)' };
  }

  return { valid: true, body: trimmedBody };
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html) {
  // Basic sanitization - remove potentially dangerous tags
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // Remove inline event handlers
}
