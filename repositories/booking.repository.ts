import { db } from '@/lib/db';

export async function getSpotsAvailable(tourId: string, tourDate: Date, maxCapacity: number) {
  const result = await db.booking.aggregate({
    where: {
      tourId,
      tourDate,
      status: 'PENDING',
    },
    _sum: { people: true },
  });

  const booked = result._sum.people || 0;
  return maxCapacity - booked;
}
