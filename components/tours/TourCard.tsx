'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/contexts/CurrencyContext';

interface TourCardProps {
  tour: {
    id: string;
    slug: string;
    localeTitle: string;
    localeShortDesc: string;
    price: number;
    discountPrice?: number | null;
    location: string;
    duration: string;
    images: string[];
    isBestseller?: boolean | null;
    hasFreeCancellation?: boolean | null;
    isFeatured?: boolean | null;
    averageRating?: number;
    reviewCount?: number;
  };
  locale: string;
}

export default function TourCard({ tour, locale }: TourCardProps) {
  const t = useTranslations('common');
  const { formatPrice } = useCurrency();
  const displayPrice = tour.discountPrice || tour.price;

  return (
    <Link
      href={`/${locale}/tours/${tour.slug}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video rounded-t-lg overflow-hidden">
        <Image
          src={tour.images[0] || '/images/placeholder.jpg'}
          alt={tour.localeTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {tour.isBestseller && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
            {t('bestseller')}
          </span>
        )}
        {tour.hasFreeCancellation && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
            {t('freeCancellation')}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>{tour.location}</span>
          <span>•</span>
          <span>{tour.duration}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {tour.localeTitle}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.localeShortDesc}
        </p>

        <div className="flex items-center justify-between">
          <div>
            {tour.discountPrice && (
              <span className="text-gray-400 line-through text-sm mr-2">
                {formatPrice(tour.price, locale)}
              </span>
            )}
            <span className="text-xl font-bold text-sky-500">
              {formatPrice(displayPrice, locale)}
            </span>
            <span className="text-gray-500 text-sm"> {t('from')}</span>
          </div>

          {tour.averageRating && (
            <div className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              <span className="font-medium">
                {tour.averageRating.toFixed(1)}
              </span>
              {tour.reviewCount && (
                <span className="text-gray-400 text-sm">
                  ({tour.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}