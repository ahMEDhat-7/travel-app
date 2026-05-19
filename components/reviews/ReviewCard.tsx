'use client';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
  tourTitle?: string;
  adminReply?: string | null;
}

interface ReviewCardProps {
  review: Review;
  showTourTitle?: boolean;
}

export default function ReviewCard({ review, showTourTitle = false }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[var(--theme-text)]">
              {review.userName}
            </span>
            {renderStars(review.rating)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">
              {formatDate(review.createdAt)}
            </span>
            {showTourTitle && review.tourTitle && (
              <>
                <span className="text-[var(--theme-text-muted)]">•</span>
                <span className="text-[var(--theme-text-secondary)]">
                  {review.tourTitle}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-[var(--theme-text-secondary)] mb-4 leading-relaxed">
        {review.comment}
      </p>

      {review.adminReply && (
        <div className="mt-4 pl-4 border-l-2 border-amber-500/50">
          <p className="text-sm font-medium text-[var(--theme-text)] mb-1">
            Admin Response
          </p>
          <p className="text-sm text-[var(--theme-text-secondary)] italic">
            "{review.adminReply}"
          </p>
        </div>
      )}
    </div>
  );
}