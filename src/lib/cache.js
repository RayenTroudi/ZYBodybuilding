// Simple in-memory cache with TTL
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 60000) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new SimpleCache();

// Cached fetch wrapper for client-side API calls
export async function cachedFetch(url, options = {}, ttl = 60000) {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached && !options.skipCache) {
    return cached;
  }
  
  // Make request
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Cache successful GET requests
  if (response.ok && (!options.method || options.method === 'GET')) {
    apiCache.set(cacheKey, data, ttl);
  }
  
  return data;
}

// Invalidate cache for a specific pattern
export function invalidateCache(pattern) {
  const keys = Array.from(apiCache.cache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  });
}
