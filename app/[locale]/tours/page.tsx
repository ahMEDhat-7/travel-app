'use client';

import Link from 'next/link';
import { use, useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useCurrency } from '@/contexts/CurrencyContext';
import Select from '@/components/ui/Select';

export default function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { theme, resolvedTheme } = useTheme();
  const { formatPrice } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchTours();
  }, [locale]);

  const fetchTours = async () => {
    try {
      const res = await fetch(`/api/tours?locale=${locale}&_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setTours(data.data);
      } else {
        setTours([]);
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedTitle = (tour: any) => {
    if (tour.localeTitle) return tour.localeTitle;
    if (locale === 'ru' && tour.titleRu) return tour.titleRu;
    return tour.titleEn || tour.title;
  };

  const getLocalizedShortDesc = (tour: any) => {
    if (tour.localeShortDesc) return tour.localeShortDesc;
    if (locale === 'ru' && tour.shortDescRu) return tour.shortDescRu;
    return tour.shortDescEn || tour.shortDesc;
  };

  const isDark = mounted && resolvedTheme === 'dark';
  const bg = 'var(--theme-bg)';
  const text = 'var(--theme-text)';
  const textSecondary = 'var(--theme-text-secondary)';
  const accent = 'var(--theme-gold)';
  const border = 'var(--theme-border)';
  const cardBg = 'var(--theme-card)';

  const categories = useMemo(() => {
    const cats = new Set(tours.map((t: any) => t.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [tours]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour: any) => {
      const title = getLocalizedTitle(tour);
      const desc = getLocalizedShortDesc(tour);
      const matchesSearch = title?.toLowerCase()?.includes(search.toLowerCase()) ||
        desc?.toLowerCase()?.includes(search.toLowerCase()) ||
        tour.location?.toLowerCase()?.includes(search.toLowerCase());
      
      const matchesCategory = category === 'All' || tour.category === category;
      
      const matchesPrice = priceRange === 'all' || 
        (priceRange === 'low' && tour.price < 150) ||
        (priceRange === 'medium' && tour.price >= 150 && tour.price < 350) ||
        (priceRange === 'high' && tour.price >= 350);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [search, category, priceRange, tours, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bg }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ borderColor: accent, borderTopColor: 'transparent', borderWidth: 2, borderStyle: 'solid' }} />
      </div>
    );
  }

  const headingGradient = isDark 
    ? 'from-amber-200 via-yellow-300 to-amber-200'
    : 'from-yellow-600 via-amber-600 to-yellow-600';

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: border,
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: cardBg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: border,
    color: text,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}30, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}30, transparent)` }} />
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px]" style={{ backgroundColor: `${accent}20` }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[80px]" style={{ backgroundColor: `${accent}20` }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${headingGradient} bg-clip-text text-transparent mb-4`}>
            {locale === 'ru' ? 'Откройте Шарм-эль-Шейх' : 'Discover Magical Sharm El-Sheikh'}
          </h1>
          <p style={{ color: textSecondary }}>{locale === 'ru' ? 'Найдите идеальное приключение' : 'Find your perfect adventure'}</p>
        </div>

        <div className="rounded-2xl p-4 md:p-6 mb-8" style={cardStyle}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder={locale === 'ru' ? 'Поиск туров...' : 'Search tours, locations...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={inputStyle}
              />
            </div>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories.map((cat) => ({
                value: cat,
                label: cat === 'All' ? (locale === 'ru' ? 'Все категории' : 'All Categories') : cat,
              }))}
            />
            <Select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              options={[
                { value: 'all', label: locale === 'ru' ? 'Любая цена' : 'Any Price' },
                { value: 'low', label: locale === 'ru' ? 'До $150' : 'Under $150' },
                { value: 'medium', label: '$150 - $350' },
                { value: 'high', label: '$350+' },
              ]}
            />
          </div>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl" style={{ color: textSecondary }}>
              {locale === 'ru' ? 'Туры скоро появятся' : 'Tours coming soon'}
            </p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl" style={{ color: textSecondary }}>
              {locale === 'ru' ? 'Нет туров по вашему запросу' : 'No tours found matching your criteria'}
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setPriceRange('all'); }}
              className="mt-4 px-6 py-2 rounded-lg"
              style={{ backgroundColor: accent, color: '#fff' }}
            >
              {locale === 'ru' ? 'Сбросить фильтры' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <Link
                key={tour.id}
                href={`/${locale}/tours/${tour.id}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                style={{ ...cardStyle, boxShadow: `0 0 40px ${accent}20` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={tour.images?.[0]}
                    alt={getLocalizedTitle(tour)}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${bg}, transparent)` }} />
                  {tour.isBestseller && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: accent, color: '#fff' }}>
                      {locale === 'ru' ? 'Бестселлер' : 'Bestseller'}
                    </span>
                  )}
                  {tour.isFeatured && (
                    <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: accent, color: '#fff' }}>
                      {locale === 'ru' ? 'Рекомендуем' : 'Featured'}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm mb-2" style={{ color: accent }}>
                    <span>{tour.location}</span>
                    <span>-</span>
                    <span>{tour.duration}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:opacity-80 transition-opacity" style={{ color: text }}>
                    {getLocalizedTitle(tour)}
                  </h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: textSecondary }}>{getLocalizedShortDesc(tour)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                      {formatPrice(tour.price, locale)}
                    </span>
                    <span 
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{ backgroundColor: cardBg, color: accent }}
                    >
                      {locale === 'ru' ? 'Подробнее' : 'View Details'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}