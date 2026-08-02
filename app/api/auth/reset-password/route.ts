import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { isTokenExpired } from '@/lib/token';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.RESET_PASSWORD);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const input = resetPasswordSchema.parse(body);

    const user = await db.user.findFirst({
      where: {
        resetToken: input.token,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    if (isTokenExpired(user.resetTokenExpiry)) {
      return NextResponse.json(
        { success: false, error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(input.newPassword);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 400 }
    );
  }
}
