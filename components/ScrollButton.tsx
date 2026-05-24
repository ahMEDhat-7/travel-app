'use client';

import { useTransition } from 'react';

export default function ScrollButton({ targetId }: { targetId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleScroll = () => {
    startTransition(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <button
      type="button"
      onClick={handleScroll}
      disabled={isPending}
      className="cursor-pointer group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-300 disabled:opacity-50 hover:scale-110"
      aria-label="Scroll to content"
    >
      <svg className="w-6 h-6 animate-bounce text-[var(--theme-gold)] group-hover:text-[var(--theme-gold)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      <span className="absolute -bottom-6 text-xs text-[var(--theme-gold)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Explore</span>
    </button>
  );
}