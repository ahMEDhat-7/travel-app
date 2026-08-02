import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { isTokenExpired } from '@/lib/token';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.VERIFY_EMAIL);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const input = verifyEmailSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: input.email },
    });

    if (!user || user.emailVerified || !user.verificationToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    if (isTokenExpired(user.verificationTokenExpiry)) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const tokenBuffer = Buffer.from(user.verificationToken);
    const inputBuffer = Buffer.from(input.code);

    if (tokenBuffer.length !== inputBuffer.length || !crypto.timingSafeEqual(tokenBuffer, inputBuffer)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify email' },
      { status: 400 }
    );
  }
}
