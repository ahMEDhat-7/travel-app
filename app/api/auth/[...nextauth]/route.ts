import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';

const nextAuthHandler = NextAuth(authOptions);

async function handler(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
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

  const resolvedParams = await context.params;
  return nextAuthHandler(request, { params: resolvedParams });
}

export { handler as GET, handler as POST };
