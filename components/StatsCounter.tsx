'use client';

import { useState, useEffect, useRef } from 'react';

interface StatsCounterProps {
  tours: number;
  bookings: number;
  destinations: number;
  statTours: string;
  statTravelers: string;
  statDestinations: string;
}

function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return <>{count.toLocaleString()}+</>;
}

export default function StatsCounter({
  tours,
  bookings,
  destinations,
  statTours,
  statTravelers,
  statDestinations,
}: StatsCounterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
          <AnimatedNumber target={tours} />
        </div>
        <div className="text-white/60 text-sm mt-1">{statTours}</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
          <AnimatedNumber target={bookings} />
        </div>
        <div className="text-white/60 text-sm mt-1">{statTravelers}</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
          <AnimatedNumber target={destinations} />
        </div>
        <div className="text-white/60 text-sm mt-1">{statDestinations}</div>
      </div>
    </div>
  );
}
