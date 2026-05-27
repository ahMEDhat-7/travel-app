'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import BookingWidget from '@/components/booking/BookingWidget';
import ItineraryAccordion from '@/components/tours/ItineraryAccordion';
import TourJsonLd from '@/components/tours/TourJsonLd';
import ReviewCard from '@/components/reviews/ReviewCard';
import RatingBreakdown from '@/components/reviews/RatingBreakdown';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getVideoUrl } from '@/lib/cloudinary-url';
import { createPortal } from 'react-dom';

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
  adminReply: string | null;
}

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
  childPrice?: number;
  location: string;
  duration: string;
  category: string;
  images: string[];
  videos: string[];
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
  localeItinerary?: { day: number; title: string; description: string }[];
  localeLocation?: string;
  localeDuration?: string;
  localeCategory?: string;
  averageRating?: number;
  reviewCount?: number;
}

interface TourDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale, id } = use(params);
  const t = useTranslations('common');
  const tTourDetail = useTranslations('tourDetail');
  const tReviews = useTranslations('reviews');
  const { formatPrice } = useCurrency();
  const [tour, setTour] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [imageLightboxIndex, setImageLightboxIndex] = useState<number | null>(null);
  const [loadedVideos, setLoadedVideos] = useState<Record<number, boolean>>({});
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const handleLightboxClose = () => setSelectedVideo(null);

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
      itinerary: tour.localeItinerary || tour.itinerary,
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

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?tourId=${id}&limit=50`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (imageLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setImageLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setImageLightboxIndex(prev => {
          if (prev === null || !tour?.images?.length) return null;
          return prev === 0 ? tour.images.length - 1 : prev - 1;
        });
      } else if (e.key === 'ArrowRight') {
        setImageLightboxIndex(prev => {
          if (prev === null || !tour?.images?.length) return null;
          return prev === tour.images.length - 1 ? 0 : prev + 1;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageLightboxIndex, tour?.images?.length]);

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (dist[r.rating as keyof typeof dist] !== undefined) {
        dist[r.rating as keyof typeof dist]++;
      }
    });
    return dist;
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

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
          <h1 className="text-3xl font-bold text-[var(--theme-text)] mb-4">{tTourDetail('tourNotFound')}</h1>
          <Link href={`/${locale}/tours`} className="text-amber-400 hover:text-amber-300">
            View All Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      {tour && (
        <TourJsonLd
          tour={{
            name: getTourData()?.title || '',
            description: getTourData()?.shortDesc || '',
            image: tour.images?.[0],
            price: tour.discountPrice || tour.price,
            rating: tour.averageRating,
            reviewCount: tour.reviewCount,
            location: tour.location,
            duration: tour.duration,
          }}
        />
      )}
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
                  <span>{tour.localeLocation || tour.location}</span>
                </div>
                <span>•</span>
                <span>{tour.localeDuration || tour.duration}</span>
                <span>•</span>
                <span className="px-2 md:px-3 py-1 bg-[var(--theme-bg-tertiary)] rounded-full text-xs md:text-sm">{tour.localeCategory || tour.category}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--theme-text)] mb-4">{getTourData()?.title}</h1>
              <p className="text-xl text-[var(--theme-text-secondary)] mb-4">{getTourData()?.shortDesc}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-[var(--theme-text-muted)]">{t('shareThisTour')}</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://wa.me/?text=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    aria-label="Share on WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                    aria-label="Copy tour link"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                {tour.isBestseller && (
                  <span className="px-4 py-1.5 bg-amber-500 text-slate-900 text-sm font-bold rounded-full shadow-lg shadow-amber-500/30">
                    {t('bestseller')}
                  </span>
                )}
                {tour.isFeatured && (
                  <span className="px-4 py-1.5 bg-yellow-500 text-slate-900 text-sm font-bold rounded-full shadow-lg shadow-yellow-500/30">
                    {t('featured')}
                  </span>
                )}
                {tour.hasFreeCancellation && (
                  <span className="px-4 py-1.5 bg-green-500/20 border border-green-500/50 text-green-400 text-sm rounded-full">
                    {t('freeCancellation')}
                  </span>
                )}
              </div>

              {tour.images && tour.images.length > 0 ? (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">{tTourDetail('gallery')}</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {tour.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImageLightboxIndex(idx)}
                        className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border)] hover:border-amber-500/50 transition-all duration-200 cursor-pointer"
                      >
                        <img
                          src={img}
                          alt={`${getTourData()?.title} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {tour.videos && tour.videos.length > 0 ? (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">Tour Videos</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tour.videos.map((video, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVideo(getVideoUrl(video));
                          setLightboxLoaded(false);
                        }}
                        className="group relative aspect-video rounded-xl overflow-hidden bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border)] hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
                      >
                        {!loadedVideos[idx] && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        <video
                          src={getVideoUrl(video)}
                          className={`w-full h-full object-cover transition-opacity duration-500 ${loadedVideos[idx] ? 'opacity-100' : 'opacity-0'}`}
                          preload="metadata"
                          onLoadedData={() => setLoadedVideos(prev => ({ ...prev, [idx]: true }))}
                          onError={() => setLoadedVideos(prev => ({ ...prev, [idx]: true }))}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">
                          Tour Video {idx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Video Lightbox */}
      {selectedVideo && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={handleLightboxClose}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleLightboxClose}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {!lightboxLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <video
              src={selectedVideo}
              className={`w-full max-h-[85vh] object-contain bg-black transition-opacity duration-500 ${lightboxLoaded ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              loop
              playsInline
              onLoadedData={() => setLightboxLoaded(true)}
              onError={() => setLightboxLoaded(true)}
            />
          </div>
        </div>,
        document.body
      )}

      {imageLightboxIndex !== null && tour?.images?.length && tour.images[imageLightboxIndex] && createPortal(
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setImageLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImageLightboxIndex(null);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImageLightboxIndex(prev => {
                if (prev === null || !tour?.images?.length) return null;
                return prev === 0 ? tour.images.length - 1 : prev - 1;
              });
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Previous"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={tour.images[imageLightboxIndex]}
            alt={`${getTourData()?.title} - Image ${imageLightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImageLightboxIndex(prev => {
                if (prev === null || !tour?.images?.length) return null;
                return prev === tour.images.length - 1 ? 0 : prev + 1;
              });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Next"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {imageLightboxIndex + 1} / {tour.images.length}
          </div>
        </div>,
        document.body
      )}

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">{t('highlights')}</h2>
                <ul className="space-y-3">
                  {getTourData()?.highlights?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-sm">✓</span>
                      <span className="text-[var(--theme-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">{t('description')}</h2>
                <p className="text-[var(--theme-text-secondary)] whitespace-pre-wrap leading-relaxed">{getTourData()?.description}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">{t('included')}</h2>
                <ul className="space-y-3">
                  {getTourData()?.included?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 text-sm">✓</span>
                      <span className="text-[var(--theme-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">{t('notIncluded')}</h2>
                <ul className="space-y-3">
                  {getTourData()?.notIncluded?.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 text-sm">✗</span>
                      <span className="text-[var(--theme-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {getTourData()?.itinerary && getTourData()!.itinerary.length > 0 ? (
<ItineraryAccordion 
                itinerary={getTourData()!.itinerary.map(item => ({
                  day: item.day,
                  title: locale === 'ru' ? (tour.localeItinerary?.find(i => i.day === item.day)?.title || item.title) : item.title,
                  description: locale === 'ru' ? (tour.localeItinerary?.find(i => i.day === item.day)?.description || item.description) : item.description,
                }))} 
                locale={locale} 
              />
              ) : null}

              <section className="mb-8 mt-8 pt-8 border-t border-[var(--theme-border)]">
                <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-6">{tReviews('reviews')}</h2>

                {reviews.length > 0 && (
                  <div className="mb-8">
                    <RatingBreakdown
                      ratings={ratingDistribution}
                      totalReviews={reviews.length}
                      averageRating={avgRating}
                    />
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  {reviewsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-center text-[var(--theme-text-muted)] py-8">
                      {tReviews('noReviews') || 'No reviews yet'}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <ReviewForm tourId={tour.id} onSuccess={fetchReviews} />
                </div>
              </section>
            </div>
          </div>

          <div>
            <BookingWidget
              tourId={tour.id}
              price={tour.price}
              discountPrice={tour.discountPrice}
              childPrice={tour.childPrice}
              maxCapacity={tour.maxCapacity}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}