import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendBookingConfirmation, sendAdminBookingNotification } from '@/lib/email';
import { withRateLimit, RATE_LIMITS } from '@/lib/api-rate-limit';

const createBookingSchema = z.object({
  tourId: z.string().uuid(),
  tourDate: z.string().optional(),
  people: z.number().min(1).max(50),
  adults: z.number().optional(),
  children: z.number().optional(),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  notes: z.string().nullable().optional(),
});

const updateBookingSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = withRateLimit(request, RATE_LIMITS.DEFAULT);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const session = await getServerSession(authOptions);
    
    const body = await request.json();
    const input = createBookingSchema.parse(body);

    const tour = await db.tour.findUnique({
      where: { id: input.tourId },
      select: { title: true, price: true, childPrice: true },
    });
    
    if (!tour) {
      return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
    }

    const adults = input.adults ?? input.people;
    const children = input.children ?? 0;
    const childPrice = tour.childPrice ?? tour.price;
    const totalPrice = (adults * tour.price) + (children * childPrice);

    const booking = await db.booking.create({
      data: {
        tourId: input.tourId,
        tourDate: input.tourDate ? new Date(input.tourDate) : new Date(),
        people: input.people,
        totalPrice,
        status: 'PENDING',
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        notes: input.notes || null,
        userId: session?.user?.id || null,
      },
    });

    sendBookingConfirmation({
      to: input.contactEmail,
      customerName: input.contactName,
      tourName: tour.title,
      tourDate: input.tourDate || new Date().toISOString().split('T')[0],
      people: input.people,
      totalPrice,
      bookingId: booking.id,
    });

    sendAdminBookingNotification({
      tourName: tour.title,
      tourDate: input.tourDate || new Date().toISOString().split('T')[0],
      people: input.people,
      totalPrice,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      notes: input.notes || undefined,
      bookingId: booking.id,
    });

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = updateBookingSchema.parse(body);

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const updated = await db.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 400 }
    );
  }
}