import { db } from '@/lib/db';

export async function checkCapacity(tourId: string, tourDate: Date, maxCapacity: number) {
  const result = await db.booking.aggregate({
    where: {
      tourId,
      tourDate,
      status: 'PENDING',
    },
    _sum: { people: true },
  });

  const currentBookings = result._sum.people || 0;
  return currentBookings < maxCapacity;
}

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

export async function findAllAdmin() {
  return db.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: string) {
  return db.booking.findUnique({
    where: { id },
  });
}

export async function updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
  return db.booking.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
}