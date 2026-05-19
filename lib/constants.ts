export const SUPPORTED_LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const BOOKING_CUTOFF_HOURS = 24;
export const MAX_TOUR_CAPACITY = 50;
export const REVIEW_MIN_RATING = 1;
export const REVIEW_MAX_RATING = 5;