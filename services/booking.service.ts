import { db } from '@/lib/db';
import * as bookingRepo from '@/repositories/booking.repository';
import type { CreateBookingInput } from '@/types/booking.types';

export function calculateTotalPrice(price: number, people: number, childCount = 0, childPrice?: number) {
  const adultPrice = price;
  const childDiscountPrice = childPrice || price * 0.5;
  return (adultPrice * (people - childCount)) + (childDiscountPrice * childCount);
}

export async function createBooking(
  userId: string,
  tour: { id: string; price: number; maxCapacity: number; childPrice?: number },
  input: CreateBookingInput,
  childCount = 0,
  childPrice?: number
) {
  const available = await bookingRepo.getSpotsAvailable(
    tour.id,
    new Date(input.tourDate),
    tour.maxCapacity
  );

  if (available < input.people) {
    throw new Error('capacityExceeded');
  }

  const adults = input.people - childCount;
  const effectiveChildPrice = childPrice ?? tour.childPrice ?? tour.price;
  const totalPrice = calculateTotalPrice(tour.price, input.people, childCount, effectiveChildPrice);

  const booking = await db.booking.create({
    data: {
      tourId: tour.id,
      tourDate: new Date(input.tourDate),
      people: input.people,
      totalPrice,
      status: 'PENDING',
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      notes: input.notes || null,
      userId: userId || null,
    },
  });

  return booking;
}