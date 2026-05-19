'use client';

import { useState } from 'react';

interface ItineraryAccordionProps {
  itinerary: { day: number; title: string; description: string }[];
}

export default function ItineraryAccordion({ itinerary }: ItineraryAccordionProps) {
  const [openDay, setOpenDay] = useState<number | null>(null);

  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-white mb-4">Itinerary</h2>
      {itinerary.map((day, index) => (
        <div 
          key={index} 
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
        >
          <button
            onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
            className="w-full px-5 py-4 flex justify-between items-center text-left"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
                {day.day}
              </span>
              <span className="text-white font-medium">
                {day.title}
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform ${openDay === day.day ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openDay === day.day && (
            <div className="px-5 pb-5 pt-2 border-t border-white/10">
              <p className="text-slate-200 leading-relaxed">
                {day.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}