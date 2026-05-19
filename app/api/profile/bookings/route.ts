import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userBookings = await db.booking.findMany({
      where: { userId: session.user.id as string },
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: {
            title: true,
            location: true,
            duration: true,
            images: true,
          },
        },
      },
    });

    const bookingsWithTours = userBookings.map((booking) => ({
      id: booking.id,
      tourId: booking.tourId,
      tourDate: booking.tourDate,
      people: booking.people,
      totalPrice: booking.totalPrice,
      status: booking.status,
      contactName: booking.contactName,
      contactEmail: booking.contactEmail,
      contactPhone: booking.contactPhone,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      tourTitle: booking.tour?.title || 'Unknown Tour',
      tourLocation: booking.tour?.location || '',
      tourDuration: booking.tour?.duration || '',
      tourImage: (booking.tour?.images as string[])?.[0] || null,
    }));

    return NextResponse.json({ success: true, data: bookingsWithTours });
  } catch (error) {
    console.error('Profile bookings GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}