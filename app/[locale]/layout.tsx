import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';
import '../globals.css';
import FooterController from '@/components/FooterController';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const navTranslations = (messages as any).navigation || {
    home: 'Home',
    tours: 'Tours', 
    about: 'About',
    contact: 'Contact',
    wishlist: 'Wishlist',
    login: 'Log in',
    logout: 'Log out',
  };

  return (
    <Providers>
      <NextIntlClientProvider messages={messages}>
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[var(--theme-brand-gold)] via-[var(--theme-brand-goldBright)] to-[var(--theme-brand-gold)] animate-pulse z-50" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[var(--theme-brand-gold)] via-[var(--theme-brand-goldBright)] to-[var(--theme-brand-gold)] animate-pulse z-50" />
            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-[var(--theme-brand-gold)] via-[var(--theme-brand-goldBright)] to-[var(--theme-brand-gold)] animate-pulse z-50" />
            <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-[var(--theme-brand-gold)] via-[var(--theme-brand-goldBright)] to-[var(--theme-brand-gold)] animate-pulse z-50" />
            
            <Navbar locale={locale} translations={navTranslations} />
            <main className="flex-1 pt-14 md:pt-20">{children}</main>
            <FooterController locale={locale} />
          </div>
        </NextIntlClientProvider>
    </Providers>
  );
}