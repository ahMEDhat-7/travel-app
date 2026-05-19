import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const updateBookingSchema = z.object({
  people: z.number().min(1).max(50).optional(),
  tourDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const booking = await db.booking.findFirst({
      where: { id, userId: session.user.id as string },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or access denied' },
        { status: 404 }
      );
    }

    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Can only update pending bookings' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const input = updateBookingSchema.parse(body);

    const updateData: Record<string, any> = {};
    if (input.people) updateData.people = input.people;
    if (input.tourDate) updateData.tourDate = new Date(input.tourDate);
    if (input.notes !== undefined) updateData.notes = input.notes || null;

    const updated = await db.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Profile booking PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const booking = await db.booking.findFirst({
      where: { id, userId: session.user.id as string },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or access denied' },
        { status: 404 }
      );
    }

    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Can only delete pending bookings' },
        { status: 400 }
      );
    }

    const deleted = await db.booking.delete({ where: { id } });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error('Profile booking DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete booking' },
      { status: 400 }
    );
  }
}