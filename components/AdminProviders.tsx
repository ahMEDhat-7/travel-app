'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { NotificationProvider } from '@/components/Notification';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <CurrencyProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </CurrencyProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CurrencyProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}