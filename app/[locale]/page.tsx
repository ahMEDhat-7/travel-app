import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getStats, getBestsellingTours } from '@/services/tour.service';
import ScrollButton from '@/components/ScrollButton';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const ImagePreviewer = dynamic(() => import('@/components/ImagePreviewer'), { ssr: true });

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const titles: Record<string, string> = {
    en: 'Sharm Cloud Tours - Best Tours in Sharm El-Sheikh',
    ru: 'Sharm Cloud Tours - Лучшие туры в Шарм-эль-Шейхе',
  };
  
  const descriptions: Record<string, string> = {
    en: 'Discover amazing tours in Sharm El-Sheikh. Book Red Sea Diving, Desert Safaris, Snorkeling Adventures and more. Best prices, instant confirmation, free cancellation.',
    ru: 'Откройте для себя удивительные туры в Шарм-эль-Шейхе. Забронируйте дайвинг на Красном море, сафари в пустыне, сноркелинг и многое другое.',
  };
  
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${baseUrl}/${locale}`,
      siteName: 'Sharm Cloud Tours',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
    },
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        ru: `${baseUrl}/ru`,
      },
    },
  };
}

interface Tour {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  price: number;
  location: string;
  duration: string;
  images: string[];
  category?: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  hasFreeCancellation?: boolean;
  localeTitle?: string;
  localeShortDesc?: string;
}

interface Review {
  id: string;
  userName: string;
  tourTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const SAMPLE_TOURS: Tour[] = [
  {
    id: '1',
    slug: 'pyramids-luxor-tour',
    title: 'Pyramids & Luxor Adventure',
    shortDesc: 'Visit the Great Pyramids of Giza and explore the ancient temples of Luxor',
    price: 299,
    location: 'Cairo & Luxor',
    duration: '5 days',
    category: 'Historical',
    images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800'],
    isBestseller: true,
  },
  {
    id: '2', 
    slug: 'nile-cruise',
    title: 'Luxury Nile Cruise',
    shortDesc: 'Sail the Nile River on a private yacht with guided temple visits',
    price: 549,
    location: 'Luxor to Aswan',
    duration: '4 days',
    category: 'Cruise',
    images: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    isFeatured: true,
    isBestseller: false,
    hasFreeCancellation: true,
  },
  {
    id: '3',
    slug: 'desert-safari',
    title: 'White Desert Adventure',
    shortDesc: 'Explore the white desert formations and camp under the stars',
    price: 199,
    location: 'Bahariya Oasis',
    duration: '2 days',
    category: 'Adventure',
    images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800'],
    isBestseller: true,
  },
  {
    id: '4',
    slug: 'dahab-snorkeling',
    title: 'Dahab snorkeling adventure',
    shortDesc: 'Snorkeling in the Blue Hole and relaxing in Dahab beach camps',
    price: 149,
    location: 'Dahab',
    duration: '3 days',
    category: 'Beach',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    isFeatured: true,
  },
];

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    tourTitle: 'Pyramids & Luxor Adventure',
    rating: 5,
    comment: 'An incredible journey! The guides were knowledgeable and the accommodations exceeded our expectations. Highly recommend!',
    createdAt: '2024-12-15',
  },
  {
    id: '2',
    userName: 'Michael K.',
    tourTitle: 'Luxury Nile Cruise',
    rating: 5,
    comment: 'Perfectly organized trip. The cruise ship was stunning and the staff treated us like royalty.',
    createdAt: '2024-11-28',
  },
  {
    id: '3',
    userName: 'Anna L.',
    tourTitle: 'White Desert Adventure',
    rating: 4,
    comment: 'Unique experience camping in the white desert. The guide was excellent and the scenery was breathtaking.',
    createdAt: '2024-11-10',
  },
];

async function fetchFeaturedTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tours?featured=true&limit=6`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success && data.data?.length > 0) {
      return data.data;
    }
    return SAMPLE_TOURS;
  } catch (error) {
    console.log('Using sample tours (DB not connected)');
    return SAMPLE_TOURS;
  }
}

async function fetchBestsellers(): Promise<Tour[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tours?bestseller=true&limit=3`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success && data.data?.length > 0) {
      return data.data;
    }
    return SAMPLE_TOURS.filter(t => t.isBestseller);
  } catch (error) {
    return SAMPLE_TOURS.filter(t => t.isBestseller);
  }
}

async function fetchReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reviews?limit=4`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success && data.data?.length > 0) {
      return data.data.map((r: any) => ({
        id: r.id,
        userName: r.userName || r.user?.name || 'Anonymous',
        tourTitle: r.tourTitle || r.tour?.title || 'Tour',
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }));
    }
    return SAMPLE_REVIEWS;
  } catch (error) {
    return SAMPLE_REVIEWS;
  }
}

async function fetchStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/stats`);
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.log('Stats not available');
    return null;
  }
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const navT = await getTranslations({ locale, namespace: 'navigation' });
  const homeT = await getTranslations({ locale, namespace: 'home' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  
  const featuredTours = await fetchFeaturedTours();
  const bestsellers = await fetchBestsellers();
  const reviews = await fetchReviews();
  const stats = await fetchStats();

  const allTours = [...featuredTours, ...bestsellers].filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i).slice(0, 6);

  const getTourTitle = (tour: Tour) => tour.localeTitle || tour.title;
  const getTourDesc = (tour: Tour) => tour.localeShortDesc || tour.shortDesc;

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <ImagePreviewer livePreview={commonT('livePreview')} />

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[var(--theme-bg)] py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg)] via-[#1a1810] to-[var(--theme-bg)]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 text-center px-4 py-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm">{homeT('hero.subtitle')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              {homeT('hero.title')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
            {homeT('hero.description')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link 
              href={`/${locale}/tours`} 
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
            >
              {navT('tours')}
            </Link>
            <Link 
              href={`/${locale}/about`}
              className="px-8 py-4 bg-white/5 border border-white/20 text-[var(--theme-text)] font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-lg"
              aria-label={locale === 'ru' ? 'Узнать больше о нас' : 'Learn more about us'}
            >
              {commonT('learnMore')}
            </Link>
          </div>
          
          <div className="flex justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">{stats?.tours || '50'}+</div>
              <div className="text-white/60 text-sm mt-1">{homeT('hero.statTours')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">{stats?.bookings || '2k'}+</div>
              <div className="text-white/60 text-sm mt-1">{homeT('hero.statTravelers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">{stats?.destinations || '15'}+</div>
              <div className="text-white/60 text-sm mt-1">{homeT('hero.statDestinations')}</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollButton targetId="featured-section" />
        </div>
      </section>

      <section id="featured-section" className="relative py-24 px-4 bg-[var(--theme-bg)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-4">
              {commonT('featured')}
            </h2>
            <p className="text-[var(--theme-text-secondary)]">{homeT('featuredTours')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTours.map((tour) => (
              <Link 
                key={tour.id} 
                href={`/${locale}/tours/${tour.id}`} 
                className="group relative bg-[var(--theme-card)] backdrop-blur-lg rounded-3xl overflow-hidden border border-[var(--theme-border)] hover:border-amber-400/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(251,191,36,0.2)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={tour.images?.[0] || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800'} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-transparent" />
                  
                  {tour.isBestseller && (
                    <span className="absolute top-4 left-4 px-4 py-1.5 bg-amber-500 text-slate-900 text-sm font-bold rounded-full shadow-lg shadow-amber-500/30">
                      {commonT('bestseller')}
                    </span>
                  )}
                  {tour.isFeatured && (
                    <span className="absolute top-4 right-4 px-4 py-1.5 bg-yellow-500 text-slate-900 text-sm font-bold rounded-full shadow-lg shadow-yellow-500/30">
                      {commonT('featured')}
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[var(--theme-gold)] text-sm mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{tour.location}</span>
                    <span className="text-[var(--theme-text-secondary)]">-</span>
                    <span>{tour.duration}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[var(--theme-text)] mb-2 group-hover:text-[var(--theme-gold)] transition-colors">
                      {getTourTitle(tour)}
                    </h3>
                    <p className="text-[var(--theme-text-secondary)] text-sm mb-4 line-clamp-2">{getTourDesc(tour)}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                        ${tour.price}
                      </span>
                      <span className="text-[var(--theme-text-secondary)] text-sm"> {commonT('perPerson')}</span>
                    </div>
                    <span className="px-4 py-2 bg-white/5 text-[var(--theme-gold)] rounded-xl text-sm font-medium group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                      {commonT('viewDetails')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href={`/${locale}/tours`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-lg"
            >
              {commonT('viewAll')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 bg-[var(--theme-bg)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-4">
              {homeT('reviews')}
            </h2>
            <p className="text-[var(--theme-text-secondary)]">{homeT('travelersSay')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="relative bg-[var(--theme-card)] backdrop-blur-lg rounded-3xl p-6 border border-[var(--theme-border)]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-[var(--theme-text)] mb-4 italic">"{review.comment}"</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--theme-gold)] font-medium">{review.userName}</p>
                    <p className="text-[var(--theme-text-secondary)] text-sm">{review.tourTitle}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-[var(--theme-gold)] font-bold">{review.userName.charAt(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}