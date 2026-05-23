import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { generateVerificationCode, getTokenExpiry } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/email';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
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

    const existing = await db.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(input.password);
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = getTokenExpiry(15);

    const user = await db.user.create({
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

    const emailResult = await sendVerificationEmail({
      to: input.email,
      verificationCode,
      userName: input.name,
    });

    const emailSent = emailResult.success;

    if (!emailSent) {
      console.error('[Register] Failed to send verification email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: false,
        emailSent,
        verificationCode: emailSent ? undefined : verificationCode,
      },
      message: emailSent
        ? 'Registration successful. Please verify your email with the code sent to your inbox.'
        : 'Registration successful. Could not send email — your verification code is shown below.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}