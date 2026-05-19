import * as tourRepo from '@/repositories/tour.repository';
import type { ToursFilter, ToursSort, TourWithLocale } from '@/types/tour.types';
import type { Locale } from '@/lib/constants';

export function getLocalizedTour(tour: any, locale: Locale): TourWithLocale {
  const translations = tour.translations?.[locale] || {};
  return {
    ...tour,
    localeTitle: translations.title || tour.title,
    localeShortDesc: translations.shortDesc || tour.shortDesc,
    localeDescription: translations.description || tour.description,
    localeHighlights: translations.highlights || tour.highlights,
    localeIncluded: translations.included || tour.included,
    localeNotIncluded: translations.notIncluded || tour.notIncluded,
    localeItinerary: translations.itinerary || tour.itinerary,
  };
}

export async function listTours(
  filters?: ToursFilter,
  sort?: ToursSort,
  locale: Locale = 'en',
  limit = 20,
  offset = 0
) {
  const tours = await tourRepo.findMany(filters, sort, limit, offset);
  return tours.map((tour) => getLocalizedTour(tour, locale));
}

export async function getFeaturedTours(locale: Locale = 'en') {
  const tours = await tourRepo.findFeatured();
  return tours.map((tour) => getLocalizedTour(tour, locale));
}

export async function getBestsellingTours(locale: Locale = 'en') {
  const tours = await tourRepo.findBestsellers();
  return tours.map((tour) => getLocalizedTour(tour, locale));
}

export async function getTourBySlug(slug: string, locale: Locale = 'en') {
  const tour = await tourRepo.findBySlug(slug);
  if (!tour) return null;
  
  const rating = await tourRepo.getAverageRating(tour.id);
  const localized = getLocalizedTour(tour, locale);
  
  return {
    ...localized,
    averageRating: rating?.avg ? Number(rating.avg) : undefined,
    reviewCount: rating?.cnt ? Number(rating.cnt) : undefined,
  };
}

export async function getTourById(id: string, locale: Locale = 'en') {
  const tour = await tourRepo.findById(id);
  if (!tour) return null;
  return getLocalizedTour(tour, locale);
}

export async function getStats() {
  const tours = await tourRepo.countTours();
  const bookings = await tourRepo.countBookings();
  const destinations = await tourRepo.countDestinations();
  return { tours, bookings, destinations };
}