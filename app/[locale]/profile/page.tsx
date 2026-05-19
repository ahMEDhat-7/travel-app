'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: string;
  createdAt: string;
}

interface Booking {
  id: string;
  tourId: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string | null;
  createdAt: string;
  tourTitle: string;
  tourLocation: string;
  tourDuration: string;
  tourImage: string | null;
}

interface Review {
  id: string;
  tourId: string;
  rating: number;
  comment: string;
  status: string;
  adminReply: string | null;
  createdAt: string;
  tourTitle: string;
  tourImage: string | null;
}

type TabType = 'bookings' | 'reviews' | 'settings';

export default function ProfilePage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const locale = params.locale;
  const { data: session, status } = useSession();
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [userRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/profile/bookings'),
        fetch('/api/profile/reviews'),
      ]);

      const userData = await userRes.json();
      const bookingsData = await bookingsRes.json();
      const reviewsData = await reviewsRes.json();

      if (userData.success) {
        setUser(userData.data);
        setEditName(userData.data.name || '');
        setEditEmail(userData.data.email || '');
      }
      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }
      if (reviewsData.success) {
        setReviews(reviewsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data);
        setSuccessMessage('Profile updated successfully!');
      } else {
        setErrorMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`/api/profile/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b)));
      } else {
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-400';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400';
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-24 relative">
        <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl border border-[var(--theme-border)] p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center justify-center text-black text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-1">{user?.name || 'User'}</h1>
              <p className="text-[var(--theme-text-secondary)] mb-2">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                  {user?.role || 'USER'}
                </span>
                <span className="px-3 py-1 bg-[var(--theme-bg-secondary)] text-[var(--theme-text-secondary)] rounded-full text-sm">
                  Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl border border-[var(--theme-border)] overflow-hidden">
          <div className="flex border-b border-[var(--theme-border)]">
            {(['bookings', 'reviews', 'settings'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-4 text-center font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-amber-500/10 text-amber-400 border-b-2 border-amber-400'
                    : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-bg-secondary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-[var(--theme-bg-secondary)] rounded-xl"
                      >
                        {booking.tourImage && (
                          <img
                            src={booking.tourImage}
                            alt={booking.tourTitle}
                            className="w-full md:w-32 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <h3 className="font-semibold text-[var(--theme-text)]">{booking.tourTitle}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--theme-text-secondary)] mb-2">
                            {booking.tourLocation} • {booking.tourDuration} • {booking.people} people
                          </p>
                          <p className="text-sm text-[var(--theme-text-secondary)] mb-2">
                            Date: {formatDate(booking.tourDate)} • Booked: {formatDate(booking.createdAt)}
                          </p>
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                              {formatPrice(booking.totalPrice)}
                            </span>
                            {booking.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[var(--theme-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[var(--theme-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-[var(--theme-text-secondary)]">No bookings yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-[var(--theme-bg-secondary)] rounded-xl">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <div>
                            <h3 className="font-semibold text-[var(--theme-text)]">{review.tourTitle}</h3>
                            <p className="text-xs text-[var(--theme-text-secondary)]">{formatDate(review.createdAt)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                            {review.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-[var(--theme-text)] mb-2">{review.comment}</p>
                        {review.adminReply && (
                          <div className="pl-4 border-l-2 border-amber-500/30">
                            <p className="text-sm text-[var(--theme-text-secondary)]">
                              <span className="font-medium text-amber-400">Admin reply:</span> {review.adminReply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[var(--theme-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[var(--theme-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <p className="text-[var(--theme-text-secondary)]">No reviews yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <form onSubmit={handleUpdateProfile} className="max-w-md">
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg">{successMessage}</div>
                )}
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg">{errorMessage}</div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-yellow-300 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}