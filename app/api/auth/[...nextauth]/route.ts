import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

async function handler(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';
  const identifier = getRateLimitIdentifier(ip, '/api/auth/callback');

  const result = checkRateLimit(identifier, { windowMs: 60000, maxRequests: 10 });

  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return NextAuth(authOptions)(request as any, {} as any);
}

export { handler as GET, handler as POST };
