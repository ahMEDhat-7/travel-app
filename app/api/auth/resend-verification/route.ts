import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateVerificationCode, getTokenExpiry } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/email';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.RESEND_VERIFICATION);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const input = resendVerificationSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: input.email },
    });

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'If an unverified account exists, a new code has been sent.' },
        { status: 200 }
      );
    }

    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = getTokenExpiry(15);

    await db.user.update({
      where: { email: input.email },
      data: {
        verificationToken: verificationCode,
        verificationTokenExpiry,
      },
    });

    const emailResult = await sendVerificationEmail({
      to: input.email,
      verificationCode,
      userName: user.name,
    });

    if (!emailResult.success) {
      console.error('[Resend] Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Verification code sent. Please check your email inbox.',
      },
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
