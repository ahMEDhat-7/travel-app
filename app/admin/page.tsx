'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  onlineUsers: number;
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalTours: number;
  activeTours: number;
  totalReviews: number;
  pendingReviews: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link 
          href="/admin/bookings?status=PENDING"
          className="block p-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Pending Bookings</p>
              <p className="text-4xl font-bold mt-2">{stats?.pendingBookings || 0}</p>
            </div>
            <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </Link>

        <Link 
          href="/admin/bookings?status=CONFIRMED"
          className="block p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Confirmed Bookings</p>
              <p className="text-4xl font-bold mt-2">{stats?.confirmedBookings || 0}</p>
            </div>
            <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </Link>

        <Link 
          href="/admin/tours"
          className="block p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Active Tours</p>
              <p className="text-4xl font-bold mt-2">{stats?.activeTours || 0}</p>
            </div>
            <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </Link>

        <Link 
          href="/admin/reviews?status=PENDING"
          className="block p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Pending Reviews</p>
              <p className="text-4xl font-bold mt-2">{stats?.pendingReviews || 0}</p>
            </div>
            <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.05c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.085a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Link href="/admin/messages" className="flex items-center gap-2 text-[var(--theme-text-secondary)] hover:text-amber-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Messages {stats?.unreadMessages ? `(${stats.unreadMessages})` : ''}
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-2 text-[var(--theme-text-secondary)] hover:text-amber-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.05c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.085a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              Moderate Reviews
            </Link>
          </div>
        </div>

        <div className="bg-[var(--theme-card)] rounded-2xl p-6 border border-[var(--theme-border)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Today's Bookings</span>
              <span className="font-semibold text-[var(--theme-text)]">{stats?.todayBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Total Bookings</span>
              <span className="font-semibold text-[var(--theme-text)]">{stats?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Total Revenue</span>
              <span className="font-semibold text-green-400">${(stats?.totalRevenue || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Total Users</span>
              <span className="font-semibold text-[var(--theme-text)]">{stats?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--theme-text-secondary)]">Total Reviews</span>
              <span className="font-semibold text-[var(--theme-text)]">{stats?.totalReviews || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-card)] rounded-2xl p-6 border border-[var(--theme-border)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[var(--theme-text-secondary)]">All systems operational</span>
            </div>
            <div className="p-3 bg-[var(--theme-bg-secondary)] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--theme-text-muted)]">Online Users</span>
                <span className="text-lg font-bold text-green-400">{stats?.onlineUsers || 0}</span>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)] mt-1">Active in last 5 minutes</p>
            </div>
            <div className="p-3 bg-[var(--theme-bg-secondary)] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--theme-text-muted)]">Unread Messages</span>
                <span className="text-lg font-bold text-amber-400">{stats?.unreadMessages || 0}</span>
              </div>
            </div>
            <div className="p-3 bg-[var(--theme-bg-secondary)] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--theme-text-muted)]">Pending Bookings</span>
                <span className="text-lg font-bold text-yellow-400">{stats?.pendingBookings || 0}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--theme-text-muted)]">Database connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
