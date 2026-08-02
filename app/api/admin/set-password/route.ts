import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.LOGIN);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_EMAIL environment variable is not set' },
        { status: 500 }
      );
    }

    const hashedPassword = hashPassword(password);

    let admin = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });

    if (!admin) {
      admin = await db.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'ADMIN',
          password: hashedPassword,
          emailVerified: true,
        }
      });
    } else {
      admin = await db.user.update({
        where: { email: ADMIN_EMAIL },
        data: {
          name: 'Admin',
          role: 'ADMIN',
          password: hashedPassword,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin password updated successfully',
      email: ADMIN_EMAIL,
      role: admin.role
    });
  } catch (error: any) {
    console.error('Set password error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin password' },
      { status: 500 }
    );
  }
}
