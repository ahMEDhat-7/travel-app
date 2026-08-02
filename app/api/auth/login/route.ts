import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.LOGIN);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const input = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(input.password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 400 }
    );
  }
}
