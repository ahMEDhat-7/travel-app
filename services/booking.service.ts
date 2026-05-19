import * as bookingRepo from '@/repositories/booking.repository';
import type { CreateBookingInput } from '@/types/booking.types';

export function calculateTotalPrice(price: number, people: number, childCount = 0, childPrice?: number) {
  const adultPrice = price;
  const childDiscountPrice = childPrice || price * 0.5;
  return (adultPrice * (people - childCount)) + (childDiscountPrice * childCount);
}

export async function createBooking(
  userId: string,
  tour: { id: string; price: number; maxCapacity: number },
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

  const totalPrice = calculateTotalPrice(tour.price, input.people, childCount, childPrice);
  
  // Database insert will be done when DB is connected
  // For now, return the calculated booking data
  return {
    id: crypto.randomUUID(),
    userId,
    tourId: tour.id,
    tourDate: input.tourDate,
    people: input.people,
    totalPrice,
    status: 'PENDING',
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    notes: input.notes,
    createdAt: new Date(),
  };
}