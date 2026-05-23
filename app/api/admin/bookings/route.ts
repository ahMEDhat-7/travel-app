import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendBookingStatusUpdate } from "@/lib/email";
import { Prisma } from "@prisma/client";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

const createBookingSchema = z.object({
  tourId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  tourDate: z.string(),
  people: z.number().min(1).max(50),
  totalPrice: z.number().min(0).optional(),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  notes: z.string().nullable().optional(),
});

const updateBookingSchema = z.object({
  id: z.string().uuid(),
  tourId: z.string().uuid().optional(),
  tourDate: z.string().optional(),
  people: z.number().min(1).max(50).optional(),
  totalPrice: z.number().min(0).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  contactName: z.string().min(2).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(5).optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");

    if (id) {
      const booking = await db.booking.findUnique({
        where: { id },
        include: {
          tour: { select: { title: true } },
          user: { select: { email: true } },
        },
      });

      if (!booking) {
        return NextResponse.json(
          { success: false, error: "Booking not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...booking,
          tourTitle: booking.tour?.title || "Unknown",
          userEmail: booking.user?.email || "Unknown",
        },
      });
    }

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        tour: { select: { title: true } },
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const bookingsWithDetails = bookings.map((booking: Prisma.BookingGetPayload<{ include: { tour: { select: { title: true } }; user: { select: { email: true } } } }>) => ({
      id: booking.id,
      userId: booking.userId,
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
      tourTitle: booking.tour?.title || "Unknown Tour",
      userEmail: booking.user?.email || "Unknown",
    }));

    return NextResponse.json({ success: true, data: bookingsWithDetails });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const input = createBookingSchema.parse(body);

    let totalPrice = input.totalPrice;
    if (!totalPrice) {
      const tour = await db.tour.findUnique({
        where: { id: input.tourId },
        select: { price: true },
      });
      totalPrice = tour ? tour.price * input.people : 0;
    }

    const booking = await db.booking.create({
      data: {
        tourId: input.tourId,
        tourDate: new Date(input.tourDate),
        people: input.people,
        totalPrice,
        status: "PENDING",
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        notes: input.notes,
        userId: input.userId || undefined,
      },
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const input = updateBookingSchema.parse(body);

    if (!input.id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (input.tourDate) updateData.tourDate = new Date(input.tourDate);
    if (input.status) updateData.status = input.status;
    if (input.people) updateData.people = input.people;
    if (input.totalPrice) updateData.totalPrice = input.totalPrice;
    if (input.contactName) updateData.contactName = input.contactName;
    if (input.contactEmail) updateData.contactEmail = input.contactEmail;
    if (input.contactPhone) updateData.contactPhone = input.contactPhone;
    if (input.notes !== undefined) updateData.notes = input.notes;

    const currentBooking = await db.booking.findUnique({
      where: { id: input.id },
      include: { tour: { select: { title: true } } },
    });

    const booking = await db.booking.update({
      where: { id: input.id },
      data: updateData,
      include: { tour: { select: { title: true } } },
    });

    if (input.status && currentBooking && currentBooking.status !== input.status) {
      const tourDate = booking.tourDate 
        ? new Date(booking.tourDate).toISOString().split('T')[0] 
        : 'N/A';
      
      sendBookingStatusUpdate({
        to: booking.contactEmail,
        customerName: booking.contactName,
        tourName: booking.tour?.title || 'Unknown Tour',
        tourDate,
        people: booking.people,
        totalPrice: booking.totalPrice,
        bookingId: booking.id,
        status: input.status as 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
        adminNotes: booking.notes || undefined,
      }).catch(err => console.error('Failed to send status update email:', err));
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const deleted = await db.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
