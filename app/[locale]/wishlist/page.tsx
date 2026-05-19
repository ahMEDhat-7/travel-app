import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const SAMPLE_TOURS_DB = {
  'pyramids-luxor-tour': {
    id: '1',
    slug: 'pyramids-luxor-tour',
    title: 'Pyramids & Luxor Adventure',
    price: 299,
    location: 'Cairo & Luxor',
    duration: '5 days',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800',
  },
  'nile-cruise': {
    id: '2',
    slug: 'nile-cruise',
    title: 'Luxury Nile Cruise', 
    price: 549,
    location: 'Luxor to Aswan',
    duration: '4 days',
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800',
  },
};

const SAMPLE_WISHLIST = [
  { tourId: '1', tour: SAMPLE_TOURS_DB['pyramids-luxor-tour'] },
  { tourId: '2', tour: SAMPLE_TOURS_DB['nile-cruise'] },
];

export default async function WishlistPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'wishlist' });

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-4">
            {t('wishlist')}
          </h1>
          <p className="text-[var(--theme-text-secondary)] text-lg">Your saved adventures</p>
        </div>
        
        {SAMPLE_WISHLIST.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_WISHLIST.map((item) => (
              <Link 
                key={item.tourId} 
                href={`/${locale}/tours/${item.tour.slug}`} 
                className="group bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl overflow-hidden border border-[var(--theme-border)] hover:border-amber-400/50 transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={item.tour.image} alt={item.tour.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[var(--theme-text)] mb-2 group-hover:text-amber-200 transition-colors">{item.tour.title}</h3>
                  <p className="text-[var(--theme-text-secondary)] text-sm mb-3">{item.tour.location} • {item.tour.duration}</p>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    ${item.tour.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[var(--theme-card)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[var(--theme-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-[var(--theme-text-secondary)] mb-4">{t('emptyWishlist')}</p>
            <Link href={`/${locale}/tours`} className="text-amber-400 hover:text-amber-300">
              {t('emptyWishlistDesc')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}