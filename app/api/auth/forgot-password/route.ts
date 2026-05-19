import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateToken, getTokenExpiry } from '@/lib/token';
import { sendPasswordReset } from '@/lib/email';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.DEFAULT);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const input = forgotPasswordSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: true, message: 'If the email exists, a reset link will be sent' },
        { status: 200 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { success: true, message: 'If the email exists, a reset link will be sent' },
        { status: 200 }
      );
    }

    const resetToken = generateToken();
    const resetTokenExpiry = getTokenExpiry(60);

    await db.user.update({
      where: { email: input.email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await sendPasswordReset({
      to: input.email,
      resetToken,
      userName: user.name,
    });

    return NextResponse.json(
      { success: true, message: 'If the email exists, a reset link will be sent' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 400 }
    );
  }
}