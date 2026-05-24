'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CurrencySelector from '@/components/CurrencySelector';
import MessageBadge from '@/components/MessageBadge';

interface NavbarProps {
  locale: string;
  translations: {
    home: string;
    tours: string;
    about: string;
    contact: string;
    wishlist: string;
    login: string;
    logout: string;
    dashboard: string;
  };
}

export default function Navbar({ locale, translations }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'dark') setTheme('dark');
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleStorage = () => {
      const stored = localStorage.getItem('theme-mode');
      setTheme(stored === 'dark' ? 'dark' : 'light');
    };
    window.addEventListener('storage', handleStorage);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (userMenuOpen && !target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const isDark = theme === 'dark';
  const gold = isDark ? '#D4AF37' : '#C8A227';
  const goldBright = isDark ? '#F2D675' : '#E0BC4D';

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ 
        backgroundColor: scrolled ? 'var(--theme-bg)' : 'transparent',
        boxShadow: scrolled ? 'var(--theme-shadow-soft)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 md:h-20 items-center">
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div 
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center"
              style={{ 
                background: `var(--theme-gradient-gold)`,
                boxShadow: 'var(--theme-shadow-goldGlow)'
              }}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span 
              className="text-lg md:text-2xl font-bold"
              style={{ 
                color: 'var(--theme-brand-gold)',
                fontFamily: 'var(--theme-font-heading)'
              }}
            >
              Sharm Cloud Tours
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 lg:gap-8">
            {['tours', 'about', 'contact'].map((key) => (
              <Link 
                key={key} 
                href={`/${locale}/${key}`}
                className="group relative text-sm lg:text-base hover:opacity-80 transition-opacity"
                style={{ color: 'var(--theme-text)' }}
                aria-current={pathname === `/${locale}/${key}` ? 'page' : undefined}
              >
                {translations[key as keyof typeof translations]}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: gold }} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <div className="hidden lg:block">
              <CurrencySelector />
            </div>
            <div className="hidden lg:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            <Link 
              href={`/${locale}/wishlist`}
              className="hidden lg:block p-2 hover:opacity-80 transition-all"
              style={{ color: 'var(--theme-brand-gold)' }}
              aria-label={translations.wishlist}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            {session && (
              <Link 
                href={`/${locale}/messages`}
                className="hidden lg:block p-2 hover:opacity-80 transition-all relative"
                style={{ color: 'var(--theme-brand-gold)' }}
                aria-label="Messages"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <MessageBadge locale={locale} />
              </Link>
            )}
            {session ? (
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="user-menu flex items-center gap-2 px-3 py-1.5 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all"
                  style={{ 
                    background: 'var(--theme-btn-primary-bg)',
                    color: 'var(--theme-btn-primary-text)'
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline">{session.user?.name || 'Profile'}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-2 border-b border-[var(--theme-border)]">
                      <p className="text-sm font-medium text-[var(--theme-text)]">{session.user?.name || 'User'}</p>
                      <p className="text-xs text-[var(--theme-text-secondary)]">{session.user?.email}</p>
                    </div>
                    <button
                      onClick={() => { router.push(`/${locale}/profile`); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--theme-text)] hover:bg-[var(--theme-bg-secondary)] flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>
                    {session.user?.role === 'ADMIN' && (
                      <button
                        onClick={() => { router.push('/admin'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-[var(--theme-text)] hover:bg-[var(--theme-bg-secondary)] flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: `/${locale}` }); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--theme-bg-secondary)] flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {translations.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href={`/${locale}/auth/signin`}
                className="hidden lg:block px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all"
                style={{ 
                  background: 'var(--theme-btn-primary-bg)',
                  color: 'var(--theme-btn-primary-text)'
                }}
              >
                {translations.login}
              </Link>
            )}
            
            <button 
              className="lg:hidden p-2 cursor-pointer"
              style={{ color: 'var(--theme-text)' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? (locale === 'ru' ? 'Закрыть меню' : 'Close menu') : (locale === 'ru' ? 'Открыть меню' : 'Open menu')}
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {menuOpen && (
          <div className="lg:hidden py-4 border-t" style={{ backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase" style={{ color: 'var(--theme-text-secondary)' }}>Navigate</span>
                {['tours', 'about', 'contact'].map((key) => (
                  <Link 
                    key={key} 
                    href={`/${locale}/${key}`}
                    className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors"
                    style={{ color: 'var(--theme-text)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {translations[key as keyof typeof translations] || key}
                  </Link>
                ))}
                {session?.user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin"
                    className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors"
                    style={{ color: 'var(--theme-brand-gold)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {translations.dashboard}
                  </Link>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase" style={{ color: 'var(--theme-text-secondary)' }}>Settings</span>
                <div className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors">
                  <ThemeToggle />
                </div>
                <div className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors">
                  <CurrencySelector />
                </div>
                <div className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors">
                  <LanguageSwitcher currentLocale={locale} />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase" style={{ color: 'var(--theme-text-secondary)' }}>Account</span>
                <Link 
                  href={`/${locale}/wishlist`}
                  className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors flex items-center gap-2"
                  style={{ color: 'var(--theme-brand-gold)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {translations.wishlist}
                </Link>
                
                {session ? (
                  <>
                    <Link 
                      href={`/${locale}/messages`}
                      className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors flex items-center gap-2"
                      style={{ color: 'var(--theme-brand-gold)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Messages
                    </Link>
                    <Link 
                      href={`/${locale}/profile`}
                      className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors flex items-center gap-2"
                      style={{ color: 'var(--theme-text)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <button 
                      onClick={() => { signOut({ callbackUrl: `/${locale}` }); setMenuOpen(false); }}
                      className="py-2 px-3 rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors flex items-center gap-2 text-left text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {translations.logout}
                    </button>
                  </>
                ) : (
                  <Link 
                    href={`/${locale}/auth/signin`}
                    className="py-2 px-3 text-center font-semibold rounded-lg"
                    style={{ background: 'var(--theme-btn-primary-bg)', color: 'var(--theme-btn-primary-text)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {translations.login}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}