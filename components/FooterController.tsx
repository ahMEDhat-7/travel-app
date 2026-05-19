'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Footer from '@/components/layout/Footer';

export default function FooterController({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideFooterRoutes = ['/messages', '/profile', '/wishlist'];
  const shouldHideFooter = mounted && hideFooterRoutes.some(route => pathname.includes(route));

  if (shouldHideFooter) {
    return null;
  }

  return <Footer locale={locale} />;
}