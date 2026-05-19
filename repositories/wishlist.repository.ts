import { db } from '@/lib/db';

export async function findByUser(userId: string) {
  return db.wishlist.findMany({
    where: { userId },
  });
}

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

export async function isInWishlist(userId: string, tourId: string) {
  const result = await db.wishlist.findFirst({
    where: { userId, tourId },
  });
  return !!result;
}