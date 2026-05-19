'use client';

import { use } from 'react';
import Link from 'next/link';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = use(params);
  
  const translations: Record<string, any> = {
    en: {
      title: 'About Sharm Cloud Tours',
      subtitle: 'Discover the magic of Sharm El-Sheikh with our expert-curated tours',
      storyText: 'Sharm Cloud Tours is a premier Sharm El-Sheikh tours booking platform, dedicated to providing unforgettable experiences along the beautiful Red Sea coast.',
      storyTitle: 'Our Story',
      storyDesc: 'Founded with a passion for the Red Sea and Sinai culture, Sharm Cloud Tours has been helping travelers discover the magic of Sharm El-Sheikh for over a decade.',
      whyChooseTitle: 'Why Choose Us',
      reasons: [
        'Expert local guides with deep knowledge of Red Sea and Sinai history',
        'Carefully curated tour itineraries',
        '24/7 customer support',
        'Flexible booking and free cancellation on selected tours',
        'Small group sizes for an intimate experience',
      ],
      teamTitle: 'Our Team',
      teamText: 'Our team consists of passionate local experts, experienced tour guides, and dedicated travel professionals all united by our love for Sharm El-Sheikh.',
      ctaButton: 'Explore Our Tours',
    },
    ru: {
      title: 'О Sharm Cloud Tours',
      subtitle: 'Откройте магию Шарм-эль-Шейха с нашими экспертными турами',
      storyText: 'Sharm Cloud Tours — ведущая платформа для бронирования туров по Шарм-эль-Шейху.',
      storyTitle: 'Наша история',
      storyDesc: 'Основана с любовью к культуре Красного моря и Синая.',
      whyChooseTitle: 'Почему выбирают нас',
      reasons: [
        'Экскурсоводы с глубокими знаниями истории Синая и Красного моря',
        'Тщательно подобранные маршруты',
        'Круглосуточная поддержка',
        'Гибкое бронирование и бесплатная отмена',
        'Небольшие группы для комфортного отдыха',
      ],
      teamTitle: 'Наша команда',
      teamText: 'Наша команда состоит из увлечённых местных экспертов и опытных гидов.',
      ctaButton: 'Смотреть туры',
    },
  };
  
  const t = translations[locale] || translations.en;

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-24 md:py-32 relative">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-4">
            {t.title}
          </h1>
          <p className="text-[var(--theme-text-secondary)] text-lg">
            {t.subtitle}
          </p>
        </div>
        
        <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-8 border border-[var(--theme-border)]">
          <p className="text-[var(--theme-text-secondary)] text-lg mb-8 leading-relaxed">
            {t.storyText}
          </p>
          
          <h2 className="text-2xl font-bold text-[var(--theme-text)] mt-8 mb-4">{t.storyTitle}</h2>
          <p className="text-[var(--theme-text-secondary)] mb-6">
            {t.storyDesc}
          </p>
          
          <h2 className="text-2xl font-bold text-[var(--theme-text)] mt-8 mb-4">{t.whyChooseTitle}</h2>
          <ul className="space-y-3 mb-8">
            {t.reasons.map((reason: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-[var(--theme-text-secondary)]">
                <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400">✓</span>
                {reason}
              </li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold text-[var(--theme-text)] mt-8 mb-4">{t.teamTitle}</h2>
          <p className="text-[var(--theme-text-secondary)]">
            {t.teamText}
          </p>
        </div>

        <div className="text-center mt-12">
          <Link 
            href={`/${locale}/tours`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/30"
          >
            {t.ctaButton}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}