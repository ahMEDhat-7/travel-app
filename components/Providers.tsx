'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { NotificationProvider } from '@/components/Notification';
import { useEffect } from 'react';

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

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <CurrencyProvider>
          <NotificationProvider>
            <Heartbeat />
            {children}
          </NotificationProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}