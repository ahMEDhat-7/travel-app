import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
        lastActiveAt: true,
        phone: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const usersWithStatus = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt,
      phone: user.phone,
      bookingsCount: user._count.bookings,
      reviewsCount: user._count.reviews,
      isOnline: user.lastActiveAt ? user.lastActiveAt > fiveMinutesAgo : false,
    }));

    return NextResponse.json({ success: true, data: usersWithStatus });
  } catch (error: any) {
    console.error('Admin users GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 },
    );
  }
}
