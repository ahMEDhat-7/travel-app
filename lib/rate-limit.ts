const MAX_STORE_SIZE = 10000;
const CLEANUP_INTERVAL = 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 60,
};

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    if (rateLimitStore.size >= MAX_STORE_SIZE) {
      cleanupRateLimitStore();
    }
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetTime,
  };
}

export function getRateLimitIdentifier(ip: string, path: string): string {
  return `${ip}:${path}`;
}

export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      keysToDelete.push(key);
    }
  }
  for (const key of keysToDelete) {
    rateLimitStore.delete(key);
  }
  if (rateLimitStore.size > MAX_STORE_SIZE) {
    rateLimitStore.clear();
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, CLEANUP_INTERVAL);
}
