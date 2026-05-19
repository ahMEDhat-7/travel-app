'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--theme-border)]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[var(--theme-accent)] border-transparent animate-spin"></div>
        </div>
        <p className="text-[var(--theme-text-secondary)] text-lg">Loading...</p>
      </div>
    </div>
  );
}