'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import BookingWidget from '@/components/booking/BookingWidget';
import ItineraryAccordion from '@/components/tours/ItineraryAccordion';
import { useCurrency } from '@/contexts/CurrencyContext';

interface TourData {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { day: number; title: string; description: string }[];
  price: number;
  discountPrice?: number;
  location: string;
  duration: string;
  category: string;
  images: string[];
  maxCapacity: number;
  isBestseller?: boolean;
  isFeatured?: boolean;
  hasFreeCancellation?: boolean;
  localeTitle?: string;
  localeShortDesc?: string;
  localeDescription?: string;
  localeHighlights?: string[];
  localeIncluded?: string[];
  localeNotIncluded?: string[];
  averageRating?: number;
  reviewCount?: number;
}

const SAMPLE_TOURS: Record<string, TourData> = {
  'pyramids-luxor-tour': {
    id: '1',
    slug: 'pyramids-luxor-tour',
    title: 'Pyramids & Luxor Adventure',
    shortDesc: 'Experience the wonder of ancient Egypt from Cairo to Luxor',
    description: 'This incredible 5-day journey takes you through the heart of ancient Egypt. Start in Cairo with the iconic Pyramids of Giza and the Sphinx, then fly to Luxor to explore the Valley of the Kings, Karnak Temple, and more.',
    highlights: ['Great Pyramids of Giza', 'Sphinx', 'Valley of the Kings', 'Karnak Temple', 'Luxor Temple'],
    included: ['All entrance fees', '4-star accommodation', 'Breakfast daily', 'Expert guide', 'Airport transfers'],
    notIncluded: ['International flights', 'Visa fees', 'Personal expenses', 'Tips'],
    itinerary: [
      { day: 1, title: 'Arrival in Cairo', description: 'Arrive at Cairo International Airport. Transfer to your hotel. Evening welcome dinner.' },
      { day: 2, title: 'Pyramids Day', description: 'Full day touring the Giza pyramids, Sphinx, and Egyptian Museum.' },
      { day: 3, title: 'Fly to Luxor', description: 'Morning flight to Luxor. Afternoon tour of Karnak Temple.' },
      { day: 4, title: 'Valley of the Kings', description: 'Full day exploring the West Bank tombs and temples.' },
      { day: 5, title: 'Departure', description: 'Transfer to airport for departure.' },
    ],
    price: 299,
    discountPrice: 249,
    location: 'Cairo & Luxor',
    duration: '5 days',
    category: 'Historical',
    images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800'],
    maxCapacity: 20,
    isBestseller: true,
    hasFreeCancellation: false,
  },
  'nile-cruise': {
    id: '2',
    slug: 'nile-cruise',
    title: 'Luxury Nile Cruise',
    shortDesc: 'Sail the Nile in style on this 4-day luxury cruise',
    description: 'Experience the magic of the Nile River aboard a luxury cruise ship. Visit ancient temples and enjoy world-class amenities.',
    highlights: ['Luxor Temple at sunset', 'Edfu Temple', 'Kom Ombo Temple', 'Philae Temple'],
    included: ['All meals onboard', 'Luxury cabin', 'Guided excursions', 'Entrance fees'],
    notIncluded: ['International flights', 'Visa', 'Tips'],
    itinerary: [
      { day: 1, title: 'Luxor Embarkation', description: 'Board your cruise ship. Evening Karnak visit.' },
      { day: 2, title: 'Edfu & Kom Ombo', description: 'Visit Edfu and Kom Ombo temples.' },
      { day: 3, title: 'Aswan', description: 'Visit Philae Temple and botanical gardens.' },
      { day: 4, title: 'Disembarkation', description: 'Morning breakfast and disembarkation.' },
    ],
    price: 549,
    location: 'Luxor to Aswan',
    duration: '4 days',
    category: 'Cruise',
    images: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    maxCapacity: 16,
    isFeatured: true,
    hasFreeCancellation: true,
  },
  'desert-safari': {
    id: '3',
    slug: 'desert-safari',
    title: 'White Desert Adventure',
    shortDesc: 'Camp under the stars in the White Desert',
    description: 'Journey into the Sahara to discover the unique white limestone formations of the White Desert.',
    highlights: ['White Desert formations', 'Black Desert', 'Crystal Mountain', 'Desert camping'],
    included: ['4x4 transfer', 'Meals', 'Camping equipment', 'Guide'],
    notIncluded: ['Personal expenses'],
    itinerary: [
      { day: 1, title: 'Oasis Departure', description: 'Drive to Bahariya Oasis via the Black Desert.' },
      { day: 2, title: 'White Desert', description: 'Full day exploring formations. Night camping.' },
    ],
    price: 199,
    location: 'Bahariya Oasis',
    duration: '2 days',
    category: 'Adventure',
    images: ['https://images.unsplash.com/photo-1547996663-6e5a6f232032?w=800'],
    maxCapacity: 10,
    isBestseller: true,
  },
};

interface TourDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale, id } = use(params);
  const { formatPrice } = useCurrency();
  const [tour, setTour] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTour();
  }, [id]);

  const getLocalizedField = (field: string | undefined, fallback: string) => {
    return field || fallback;
  };

  const getTourData = (): TourData | null => {
    if (!tour) return null;
    return {
      ...tour,
      title: getLocalizedField(tour.localeTitle, tour.title),
      shortDesc: getLocalizedField(tour.localeShortDesc, tour.shortDesc),
      description: getLocalizedField(tour.localeDescription, tour.description),
      highlights: tour.localeHighlights || tour.highlights,
      included: tour.localeIncluded || tour.included,
      notIncluded: tour.localeNotIncluded || tour.notIncluded,
    };
  };

  const fetchTour = async () => {
    try {
      const res = await fetch(`/api/tours/id/${id}?locale=${locale}`);
      const data = await res.json();
      if (data.success && data.data) {
        setTour(data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching tour:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--theme-text)] mb-4">Tour Not Found</h1>
          <Link href={`/${locale}/tours`} className="text-amber-400 hover:text-amber-300">
            View All Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-4 md:p-6 lg:p-8 border border-[var(--theme-border)]">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[var(--theme-text-secondary)] text-sm mb-4">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{tour.location}</span>
                </div>
                <span>•</span>
                <span>{tour.duration}</span>
                <span>•</span>
                <span className="px-2 md:px-3 py-1 bg-[var(--theme-bg-tertiary)] rounded-full text-xs md:text-sm">{tour.category}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--theme-text)] mb-4">{getTourData()?.title}</h1>
              <p className="text-xl text-[var(--theme-text-secondary)] mb-4">{getTourData()?.shortDesc}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-[var(--theme-text-muted)]">Share this tour:</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://wa.me/?text=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.493.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.974 2.898 1.852 1.853 2.854 4.44 2.854 7.154 0 2.647-1.114 5.026-3.076 6.858l-.622.62z"/>
                    </svg>
                  </a>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="w-8 h-8 bg-[var(--theme-bg-tertiary)] rounded-lg flex items-center justify-center text-[var(--theme-text)] hover:bg-[var(--theme-border)] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                {tour.isBestseller && (
                  <span className="px-4 py-1.5 bg-amber-500 text-slate-900 text-sm font-bold rounded-full shadow-lg shadow-amber-500/30">
                    Bestseller
                  </span>
                )}
                {tour.isFeatured && (
                  <span className="px-4 py-1.5 bg-yellow-500 text-slate-900 text-sm font-bold rounded-full shadow-lg shadow-yellow-500/30">
                    Featured
                  </span>
                )}
                {tour.hasFreeCancellation && (
                  <span className="px-4 py-1.5 bg-green-500/20 border border-green-500/50 text-green-400 text-sm rounded-full">
                    Free Cancellation
                  </span>
                )}
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">Highlights</h2>
                <ul className="space-y-3">
                  {tour.highlights?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm">✓</span>
                      <span className="text-[var(--theme-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">Description</h2>
                <p className="text-[var(--theme-text-secondary)] whitespace-pre-wrap leading-relaxed">{tour.description}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">Included</h2>
                <ul className="space-y-3">
                  {tour.included?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-sm">✓</span>
                      <span className="text-[var(--theme-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">Not Included</h2>
                <ul className="space-y-3">
                  {tour.notIncluded?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-sm">✗</span>
                      <span className="text-[var(--theme-text-muted)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {tour.itinerary && tour.itinerary.length > 0 ? (
                <ItineraryAccordion itinerary={tour.itinerary} />
              ) : null}
            </div>
          </div>

          <div>
            <BookingWidget
              tourId={tour.id}
              price={tour.discountPrice || tour.price}
              maxCapacity={tour.maxCapacity}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}