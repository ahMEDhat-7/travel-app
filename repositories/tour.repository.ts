import { db } from '@/lib/db';
import type { ToursFilter, ToursSort } from '@/types/tour.types';

export async function findMany(
  filters?: ToursFilter,
  sort?: ToursSort,
  limit = 20,
  offset = 0
) {
  const where: any = { isActive: true };

  if (filters?.category) {
    where.category = filters.category;
  }
  if (filters?.location) {
    where.location = filters.location;
  }
  if (filters?.minPrice !== undefined) {
    where.price = { ...where.price, gte: filters.minPrice };
  }
  if (filters?.maxPrice !== undefined) {
    where.price = { ...where.price, lte: filters.maxPrice };
  }
  if (filters?.duration) {
    where.duration = filters.duration;
  }
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { shortDesc: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters?.featured === true) {
    where.isFeatured = true;
  }

  let orderBy: any = { isFeatured: 'desc' as const };
  if (sort?.field === 'price') {
    orderBy = { price: sort.order === 'asc' ? 'asc' : 'desc' };
  } else if (sort?.field === 'popularity') {
    orderBy = { createdAt: 'desc' };
  }

  return db.tour.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
  });
}

export async function findFeatured() {
  return db.tour.findMany({
    where: { isActive: true, isFeatured: true },
    take: 6,
  });
}

export async function findBestsellers() {
  return db.tour.findMany({
    where: { isActive: true, isBestseller: true },
    take: 6,
  });
}

export async function findBySlug(slug: string) {
  return db.tour.findFirst({
    where: { slug, isActive: true },
  });
}

export async function findById(id: string) {
  return db.tour.findUnique({
    where: { id },
  });
}

export async function getAverageRating(tourId: string) {
  const result = await db.review.aggregate({
    where: { tourId, status: 'APPROVED' },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    avg: result._avg.rating || 0,
    cnt: result._count.rating || 0,
  };
}

export async function countTours() {
  return db.tour.count({
    where: { isActive: true },
  });
}

export async function countBookings() {
  return db.booking.count();
}

export async function countDestinations() {
  const result = await db.tour.groupBy({
    by: ['location'],
    where: { isActive: true },
    _count: true,
  });
  return result.length;
}

export async function updateTour(id: string, data: { isActive?: boolean; isFeatured?: boolean; isBestseller?: boolean }) {
  return db.tour.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
  });
}