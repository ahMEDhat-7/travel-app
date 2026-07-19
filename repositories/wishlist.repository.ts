import { db } from '@/lib/db';

export async function add(userId: string, tourId: string) {
  return db.wishlist.create({
    data: { userId, tourId },
  }).catch(() => null);
}

export async function remove(userId: string, tourId: string) {
  return db.wishlist.deleteMany({
    where: { userId, tourId },
  });
}
