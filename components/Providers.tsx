'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { NotificationProvider } from '@/components/Notification';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <CurrencyProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}