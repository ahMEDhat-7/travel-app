'use client';

import TourCard from './TourCard';

interface Tour {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  price: number;
  discountPrice?: number;
  location: string;
  duration: string;
  images: string[];
  category: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  hasFreeCancellation?: boolean;
  rating?: number;
  reviewCount?: number;
  localeTitle?: string;
  localeShortDesc?: string;
}

interface TourGridProps {
  tours: Tour[];
  locale: string;
  loading?: boolean;
}

export default function TourGrid({ tours, locale, loading }: TourGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] overflow-hidden animate-pulse"
          >
            <div className="aspect-[4/3] bg-[var(--theme-bg-tertiary)]" />
            <div className="p-5 space-y-3">
              <div className="h-6 bg-[var(--theme-bg-tertiary)] rounded w-3/4" />
              <div className="h-4 bg-[var(--theme-bg-tertiary)] rounded w-1/2" />
              <div className="h-10 bg-[var(--theme-bg-tertiary)] rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-[var(--theme-bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-[var(--theme-text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[var(--theme-text)] mb-2">
          No tours found
        </h3>
        <p className="text-[var(--theme-text-secondary)]">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour, index) => (
        <TourCard
          key={tour.id}
          tour={{
            ...tour,
            localeTitle: tour.localeTitle || tour.title,
            localeShortDesc: tour.localeShortDesc || tour.shortDesc,
          }}
          locale={locale}
        />
      ))}
    </div>
  );
}