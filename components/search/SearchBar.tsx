'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  image?: string;
}

interface SearchBarProps {
  locale: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ locale, placeholder, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTours = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/tours?search=${encodeURIComponent(query)}&locale=${locale}&limit=5`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setResults(data.data.slice(0, 5));
          setIsOpen(true);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchTours, 300);
    return () => clearTimeout(debounce);
  }, [query, locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      window.location.href = `/${locale}/tours?search=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || (locale === 'ru' ? 'Поиск туров...' : 'Search tours...')}
            className="w-full px-5 py-3 pl-12 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-[var(--theme-text-muted)] border-t-amber-500 rounded-full animate-spin" />
            ) : (
              <svg
                className="w-5 h-5 text-[var(--theme-text-muted)]"
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
            )}
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            {locale === 'ru' ? 'Найти' : 'Search'}
          </button>
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl shadow-lg overflow-hidden z-50">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/${locale}/tours/${result.slug}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-3 hover:bg-[var(--theme-bg-tertiary)] transition-colors"
            >
              <div className="w-16 h-12 bg-[var(--theme-bg-tertiary)] rounded-lg overflow-hidden flex-shrink-0">
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--theme-text-muted)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--theme-text)] truncate">
                  {result.title}
                </p>
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  {result.location}
                </p>
              </div>
              <div className="text-amber-500 font-semibold">
                ${result.price}
              </div>
            </Link>
          ))}
          <Link
            href={`/${locale}/tours?search=${encodeURIComponent(query)}`}
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-sm text-amber-500 hover:text-amber-600 border-t border-[var(--theme-border)]"
          >
            {locale === 'ru' ? 'Показать все результаты' : 'View all results'}
          </Link>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl shadow-lg p-4 text-center">
          <p className="text-[var(--theme-text-secondary)]">
            {locale === 'ru' ? 'Ничего не найдено' : 'No tours found'}
          </p>
        </div>
      )}
    </div>
  );
}