'use client';

import { useState, useEffect } from 'react';

export default function MessageBadge({ locale }: { locale: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) {
        let count = 0;
        data.data.forEach((thread: any) => {
          if (thread.senderType === 'ADMIN' && !thread.isRead) {
            count++;
          }
          thread.replies?.forEach((reply: any) => {
            if (reply.senderType === 'ADMIN' && !reply.isRead) {
              count++;
            }
          });
        });
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  if (!mounted) return null;
  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}