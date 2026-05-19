'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BookingWidgetProps {
  tourId: string;
  price: number;
  maxCapacity: number;
  locale: string;
}

export default function BookingWidget({
  tourId,
  price,
  maxCapacity,
  locale,
}: BookingWidgetProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formatPrice } = useCurrency();
  const [people, setPeople] = useState(1);
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  const [date, setDate] = useState(defaultDate.toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const total = people * price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          tourDate: date,
          people,
          contactName: name,
          contactEmail: email,
          contactPhone: phone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/${locale}/wishlist`);
        }, 2000);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push(`/${locale}/auth/signin?callbackUrl=/${locale}/tours/${tourId}`);
  };

  if (status === 'loading') {
    return (
      <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-6 border border-[var(--theme-border)] sticky top-4">
        <div className="animate-pulse flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-6 border border-[var(--theme-border)] sticky top-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--theme-text)] mb-2">Login Required</h3>
          <p className="text-[var(--theme-text-muted)] mb-6">Please login to book this tour</p>
          <button
            onClick={handleLoginRedirect}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30"
          >
            Login to Book
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-6 border border-[var(--theme-border)] sticky top-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--theme-text)] mb-2">Booking Submitted!</h3>
          <p className="text-[var(--theme-text-muted)]">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-[var(--theme-border)] sticky top-4">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div>
          <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
            {formatPrice(price, locale)}
          </span>
          <span className="text-[var(--theme-text-muted)] text-sm md:text-base"> /person</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 md:px-4 py-2 md:py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
            People
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="px-4 py-2 md:py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] hover:bg-[var(--theme-bg-secondary)] transition-all text-sm md:text-base"
            >
              -
            </button>
            <span className="flex-1 text-center text-[var(--theme-text)] font-medium text-sm md:text-base">{people}</span>
            <button
              type="button"
              onClick={() => setPeople(Math.min(maxCapacity, people + 1))}
              className="px-4 py-2 md:py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] hover:bg-[var(--theme-bg-secondary)] transition-all text-sm md:text-base"
            >
              +
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--theme-border)] pt-3 md:pt-4">
          <div className="flex justify-between mb-3 md:mb-4">
            <span className="text-[var(--theme-text-secondary)] text-sm md:text-base">Total Price</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
              {formatPrice(total, locale)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full px-3 md:px-4 py-2 md:py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full px-3 md:px-4 py-2 md:py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+20 123 456 789"
            required
            className="w-full px-3 md:px-4 py-2 md:py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-base"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 text-sm md:text-base"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}