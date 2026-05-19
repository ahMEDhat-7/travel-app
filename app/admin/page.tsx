'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalTours: number;
  activeTours: number;
  totalReviews: number;
  pendingReviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [bookingsRes, toursRes, reviewsRes] = await Promise.all([
          fetch('/api/admin/bookings'),
          fetch('/api/tours'),
          fetch('/api/admin/reviews'),
        ]);

        const bookingsData = await bookingsRes.json();
        const toursData = await toursRes.json();
        const reviewsData = await reviewsRes.json();

        const bookings = bookingsData.data || [];
        const tours = toursData.data || [];
        const reviews = reviewsData.data || [];

        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === 'PENDING').length,
          confirmedBookings: bookings.filter((b: any) => b.status === 'CONFIRMED').length,
          totalTours: tours.length,
          activeTours: tours.filter((t: any) => t.isActive).length,
          totalReviews: reviews.length,
          pendingReviews: reviews.filter((r: any) => r.status === 'PENDING').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { 
      label: 'Pending Bookings', 
      value: stats?.pendingBookings || 0, 
      href: '/admin/bookings?status=PENDING', 
      color: 'from-yellow-500 to-amber-500',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    { 
      label: 'Confirmed Bookings', 
      value: stats?.confirmedBookings || 0, 
      href: '/admin/bookings?status=CONFIRMED', 
      color: 'from-green-500 to-emerald-500',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    { 
      label: 'Active Tours', 
      value: stats?.activeTours || 0, 
      href: '/admin/tours', 
      color: 'from-blue-500 to-cyan-500',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    },
    { 
      label: 'Pending Reviews', 
      value: stats?.pendingReviews || 0, 
      href: '/admin/reviews?status=PENDING', 
      color: 'from-purple-500 to-pink-500',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.05c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.085a1 1 0 00.951-.69l1.519-4.674z'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--theme-text)]">Dashboard</h1>
        <p className="text-[var(--theme-text-secondary)] mt-1">Overview of your travel business</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link 
            key={card.label} 
            href={card.href}
            className={`block p-6 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">{card.label}</p>
                <p className="text-4xl font-bold mt-2">{card.value}</p>
              </div>
              <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--theme-card)] rounded-2xl p-6 border border-[var(--theme-border)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/tours" className="flex items-center gap-2 text-[var(--theme-text-secondary)] hover:text-amber-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Manage Tours
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-2 text-[var(--theme-text-secondary)] hover:text-amber-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              View Bookings
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-2 text-[var(--theme-text-secondary)] hover:text-amber-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.05c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.085a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              Moderate Reviews
            </Link>
          </div>
        </div>

        <div className="bg-[var(--theme-card)] rounded-2xl p-6 border border-[var(--theme-border)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">Total Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Total Bookings</span>
              <span className="font-semibold text-[var(--theme-text)]">{stats?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Total Tours</span>
              <span className="font-semibold text-[var(--theme-text)]">{stats?.totalTours || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Total Reviews</span>
              <span className="font-semibold text-[var(--theme-text)]">{stats?.totalReviews || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-card)] rounded-2xl p-6 border border-[var(--theme-border)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">System Status</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[var(--theme-text-secondary)]">All systems operational</span>
          </div>
          <p className="text-sm text-[var(--theme-text-muted)] mt-2">Database connected</p>
        </div>
      </div>
    </div>
  );
}