const rateLimitStore = new Map();

export const RATE_LIMITS = {
  ip: {
    maxRequests: parseInt(process.env.SMS_RATE_LIMIT_PER_HOUR) || 100,
    windowMs: 60 * 60 * 1000,
  },
  phone: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  },
  global: {
    maxRequests: parseInt(process.env.SMS_RATE_LIMIT_PER_DAY) || 500,
    windowMs: 24 * 60 * 60 * 1000,
  },
};

export function checkRateLimit(key, type = 'ip') {
  const limit = RATE_LIMITS[type];
  if (!limit) {
    throw new Error(`Invalid rate limit type: ${type}`);
  }

  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (!record || now >= record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + limit.windowMs,
    });
    return {
      allowed: true,
      remaining: limit.maxRequests - 1,
      resetAt: now + limit.windowMs,
      limit: limit.maxRequests,
    };
  }

  if (record.count >= limit.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      limit: limit.maxRequests,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: limit.maxRequests - record.count,
    resetAt: record.resetAt,
    limit: limit.maxRequests,
  };
}

export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now >= record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupRateLimits, 60 * 60 * 1000);
