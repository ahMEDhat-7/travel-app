'use client';

import { useState } from 'react';

interface TourFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  categories: string[];
  locations: string[];
  durations: string[];
}

export default function TourFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  location,
  onLocationChange,
  duration,
  onDurationChange,
  categories,
  locations,
  durations,
}: TourFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Under $150' },
    { value: 'medium', label: '$150 - $350' },
    { value: 'high', label: 'Over $350' },
  ];

  const durationOptions = [
    { value: 'all', label: 'Any Duration' },
    { value: 'day', label: 'Day Trip' },
    { value: '2-3', label: '2-3 Days' },
    { value: '4+', label: '4+ Days' },
  ];

  return (
    <div className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--theme-text)]">
          Filters
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)]"
          aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          aria-expanded={isExpanded}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
              Search
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--theme-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tours..."
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onPriceRangeChange(range.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    priceRange === range.value
                      ? 'bg-amber-500 text-white'
                      : 'bg-[var(--theme-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] hover:bg-[var(--theme-bg-tertiary)]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] focus:outline-none focus:border-amber-500"
            >
              {durationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              onSearchChange('');
              onCategoryChange('All');
              onPriceRangeChange('all');
              onLocationChange('all');
              onDurationChange('all');
            }}
            className="w-full py-2.5 text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] border border-[var(--theme-border)] rounded-lg hover:bg-[var(--theme-bg-tertiary)] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}