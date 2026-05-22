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

export async function GET() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      onlineUsers,
      totalBookings,
      todayBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
      totalTours,
      activeTours,
      totalReviews,
      pendingReviews,
      unreadMessages,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { lastActiveAt: { gte: fiveMinutesAgo } } }),
      db.booking.count(),
      db.booking.count({ where: { createdAt: { gte: today } } }),
      db.booking.count({ where: { status: 'PENDING' } }),
      db.booking.count({ where: { status: 'CONFIRMED' } }),
      db.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      }),
      db.tour.count(),
      db.tour.count({ where: { isActive: true } }),
      db.review.count(),
      db.review.count({ where: { status: 'PENDING' } }),
      db.message.count({ where: { isReadByAdmin: false, senderType: 'USER' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        onlineUsers,
        totalBookings,
        todayBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalTours,
        activeTours,
        totalReviews,
        pendingReviews,
        unreadMessages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
