'use client';

import { useEffect, useState } from 'react';
import { useNotification } from '@/components/Notification';
import Select from '@/components/ui/Select';

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  adminReply: string | null;
  createdAt: string;
  tourTitle: string;
  userEmail: string;
  userName: string;
}

interface Tour {
  id: string;
  title: string;
}

interface ReviewFormData {
  tourId: string;
  rating: number;
  comment: string;
  status: string;
}

const initialFormData: ReviewFormData = {
  tourId: '',
  rating: 5,
  comment: '',
  status: 'PENDING',
};

function AdminReviewsContent() {
  const { showNotification, showConfirm } = useNotification();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [reviewsRes, toursRes] = await Promise.all([
        fetch('/api/admin/reviews'),
        fetch('/api/tours?limit=100'),
      ]);
      const reviewsData = await reviewsRes.json();
      const toursData = await toursRes.json();
      
      setReviews(reviewsData.data || []);
      setTours(toursData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reviews`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/admin/reviews`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, adminReply: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, adminReply: replyText } : r));
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    showConfirm('Are you sure you want to delete this review?', async () => {
      setDeletingId(reviewId);
      try {
        await fetch(`/api/admin/reviews?id=${reviewId}`, { method: 'DELETE' });
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        showNotification('Review deleted successfully');
      } catch (error) {
        console.error('Failed to delete review:', error);
        showNotification('Failed to delete review', 'error');
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        const selectedTour = tours.find(t => t.id === formData.tourId);
        const newReview = {
          ...data.data,
          tourTitle: selectedTour?.title || 'Unknown',
          userEmail: 'N/A',
          userName: 'Admin',
        };
        setReviews(prev => [newReview, ...prev]);
        setShowModal(false);
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Failed to create review:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500/20 text-green-500';
      case 'REJECTED': return 'bg-red-500/20 text-red-500';
      default: return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (filter !== 'all' && review.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        review.userName?.toLowerCase().includes(searchLower) ||
        review.userEmail.toLowerCase().includes(searchLower) ||
        review.tourTitle?.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-text)]">Reviews</h1>
          <p className="text-[var(--theme-text-secondary)] mt-1">Moderate customer reviews</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          + Add New Review
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:border-amber-500"
        />
<Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Reviews' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] p-8 text-center text-[var(--theme-text-muted)]">
            No reviews found.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] p-6 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {(review.userName || review.userEmail || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--theme-text)]">{review.userName || review.userEmail || 'Anonymous'}</p>
                      <p className="text-sm text-[var(--theme-text-muted)]">{review.tourTitle || 'Unknown Tour'} • {formatDate(review.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {renderStars(review.rating)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <p className="text-[var(--theme-text-secondary)] mb-4">{review.comment}</p>

                  {review.adminReply && (
                    <div className="bg-[var(--theme-bg-tertiary)] rounded-lg p-4 border-l-4 border-amber-500">
                      <p className="text-sm text-[var(--theme-text-muted)] mb-1">Admin Reply:</p>
                      <p className="text-[var(--theme-text)]">{review.adminReply}</p>
                    </div>
                  )}

                  {replyingTo === review.id && (
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]"
                        onKeyDown={(e) => e.key === 'Enter' && handleReply(review.id)}
                      />
                      <button
                        onClick={() => handleReply(review.id)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        className="px-4 py-2 bg-[var(--theme-bg-tertiary)] text-[var(--theme-text)] rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {review.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(review.id, 'APPROVED')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(review.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {!review.adminReply && (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="px-4 py-2 bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)] rounded-lg hover:bg-amber-500/20 hover:text-amber-500 text-sm font-medium"
                    >
                      Reply
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 text-sm font-medium disabled:opacity-50"
                  >
                    {deletingId === review.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--theme-card)] rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">Create New Review</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Tour</label>
<Select
                  value={formData.tourId}
                  onChange={(e) => setFormData({ ...formData, tourId: e.target.value })}
                  options={[{ value: '', label: 'Select a tour' }, ...tours.map((tour) => ({ value: tour.id, label: tour.title }))]}
                  className="py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Rating</label>
                <Select
                  value={String(formData.rating)}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  options={[1, 2, 3, 4, 5].map(star => ({ value: String(star), label: `${star} Star${star > 1 ? 's' : ''}` }))}
                  className="py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Comment</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  rows={4}
                  minLength={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Status</label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'APPROVED', label: 'Approved' },
                    { value: 'REJECTED', label: 'Rejected' },
                  ]}
                  className="py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[var(--theme-bg-tertiary)] text-[var(--theme-text)] rounded-lg hover:bg-[var(--theme-border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminReviewsPage() {
  return <AdminReviewsContent />;
}