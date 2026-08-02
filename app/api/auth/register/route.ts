import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { generateVerificationCode, getTokenExpiry } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/email';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().min(5).max(30),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.REGISTER);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const input = registerSchema.parse(body);

    const hashedPassword = await hashPassword(input.password);
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = getTokenExpiry(15);

    let user;
    try {
      user = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          phone: input.phone,
          role: 'USER',
          verificationToken: verificationCode,
          verificationTokenExpiry,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 400 }
        );
      }
      throw error;
    }

    const emailResult = await sendVerificationEmail({
      to: input.email,
      verificationCode,
      userName: input.name,
    });

    if (!emailResult.success) {
      await db.user.delete({ where: { id: user.id } });
      console.error('[Register] Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: false,
      },
      message: 'Registration successful. Please verify your email with the code sent to your inbox.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please check your input and try again.' },
      { status: 400 }
    );
  }
}
