import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
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
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      return NextResponse.json({
        success: false,
        error: 'ADMIN_EMAIL environment variable is required'
      }, { status: 400 });
    }

    let admin = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });

    if (!admin) {
      admin = await db.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'ADMIN',
          emailVerified: true,
        },
      });
    } else {
      admin = await db.user.update({
        where: { email: ADMIN_EMAIL },
        data: {
          role: 'ADMIN',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account ready',
      admin: { email: admin.email, name: admin.name, role: admin.role }
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete admin setup' },
      { status: 500 }
    );
  }
}
