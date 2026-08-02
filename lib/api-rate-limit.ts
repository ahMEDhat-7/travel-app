import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitIdentifier, RateLimitConfig } from './rate-limit';

export function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 60 }
) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const path = request.nextUrl.pathname;
  const identifier = getRateLimitIdentifier(ip, path);

  const result = checkRateLimit(identifier, config);

  if (!result.allowed) {
    const response = NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
    response.headers.set('Retry-After', Math.ceil((result.resetAt - Date.now()) / 1000).toString());
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', result.resetAt.toString());
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetAt.toString());
  
  return response;
}

export const RATE_LIMITS = {
  DEFAULT: { windowMs: 60000, maxRequests: 60 },
  LOGIN: { windowMs: 60000, maxRequests: 5 },
  REGISTER: { windowMs: 3600000, maxRequests: 3 },
  VERIFY_EMAIL: { windowMs: 900000, maxRequests: 5 },
  RESEND_VERIFICATION: { windowMs: 900000, maxRequests: 3 },
  API: { windowMs: 60000, maxRequests: 100 },
};
