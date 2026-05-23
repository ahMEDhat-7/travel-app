'use client';

import { useState, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { NotificationProvider } from '@/components/Notification';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

function Heartbeat() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const sendHeartbeat = () => {
      fetch('/api/profile/heartbeat', { method: 'POST' }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 120000);
    return () => clearInterval(interval);
  }, [session]);

  return null;
}

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <SessionProvider>
        <CurrencyProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </CurrencyProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Heartbeat />
        <CurrencyProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
