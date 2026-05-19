'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ReviewFormProps {
  tourId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ tourId, onSuccess }: ReviewFormProps) {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setRating(0);
        setComment('');
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] p-5 text-center">
        <p className="text-[var(--theme-text-muted)]">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] p-5 text-center">
        <p className="text-[var(--theme-text-secondary)] mb-3">
          Please sign in to leave a review
        </p>
        <a
          href="/auth/signin"
          className="inline-block px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] p-5 text-center">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold text-[var(--theme-text)] mb-2">Thank you!</h3>
        <p className="text-[var(--theme-text-secondary)] text-sm">
          Your review has been submitted and is pending approval.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] p-5">
      <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            Your Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-amber-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this tour..."
            rows={4}
            className="w-full px-4 py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:border-amber-500 resize-none"
          />
          <p className="text-sm text-[var(--theme-text-muted)] mt-1">
            Minimum 10 characters
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}