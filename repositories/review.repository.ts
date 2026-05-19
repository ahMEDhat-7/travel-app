import { db } from '@/lib/db';

export async function findApprovedByTour(tourId: string) {
  return db.review.findMany({
    where: { tourId, status: 'APPROVED' },
    orderBy: { createdAt: 'asc' },
  });
}

export async function findPendingByTour(tourId: string) {
  return db.review.findMany({
    where: { tourId, status: 'PENDING' },
  });
}

export async function findRecentApproved(limit = 6) {
  return db.review.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function createReview(userId: string, tourId: string, rating: number, comment: string) {
  return db.review.create({
    data: {
      userId,
      tourId,
      rating,
      comment,
      status: 'PENDING',
    },
  });
}

export async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
  return db.review.update({
    where: { id },
    data: { status },
  });
}

export async function addReply(id: string, reply: string) {
  return db.review.update({
    where: { id },
    data: { adminReply: reply },
  });
}