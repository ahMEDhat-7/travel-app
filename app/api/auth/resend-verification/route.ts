import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateToken, getTokenExpiry } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/email';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.DEFAULT);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const input = resendVerificationSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Email is already verified' },
        { status: 400 }
      );
    }

    const verificationToken = generateToken();
    const verificationTokenExpiry = getTokenExpiry(60);

    await db.user.update({
      where: { email: input.email },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    await sendVerificationEmail({
      to: input.email,
      verificationToken,
      userName: user.name,
    });

    return NextResponse.json(
      { success: true, message: 'Verification email sent' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resend verification email' },
      { status: 400 }
    );
  }
}