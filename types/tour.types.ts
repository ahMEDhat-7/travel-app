import type { Tour, User, Booking, Review, Wishlist } from '@/lib/db/schema';

export type { Tour, User, Booking, Review, Wishlist };

export interface TourWithLocale extends Tour {
  localeTitle: string;
  localeShortDesc: string;
  localeDescription: string;
  localeHighlights: string[];
  localeIncluded: string[];
  localeNotIncluded: string[];
  localeItinerary?: { day: number; title: string; description: string }[];
  averageRating?: number;
  reviewCount?: number;
}

export interface ToursFilter {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  search?: string;
  featured?: boolean;
}

export interface ToursSort {
  field?: 'price' | 'rating' | 'popularity';
  order?: 'asc' | 'desc';
}