'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageSwitcherProps {
  currentLocale: string;
}

const defaultLanguages = [
  { code: 'en', name: 'English', nativeName: 'EN' },
  { code: 'ru', name: 'Russian', nativeName: 'RU' },
];

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [languages, setLanguages] = useState<Language[]>(defaultLanguages);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/languages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.languages) {
          setLanguages(data.languages);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentLang =
    languages.find((l) => l.code === currentLocale) || {
      code: currentLocale,
      name: currentLocale.toUpperCase(),
      nativeName: currentLocale.toUpperCase(),
    };
  const otherLanguages = languages.filter((l) => l.code !== currentLocale);

  const switchLanguage = (newLocale: string) => {
    setIsOpen(false);
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  if (!mounted) {
    return (
      <div
        className="px-2 py-1.5 text-xs rounded-lg bg-[var(--theme-card)] border border-[var(--theme-border)] text-[var(--theme-text)] min-w-[50px] text-center"
      >
        EN
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1 px-2 py-1.5
          text-xs rounded-lg min-w-[50px]
          bg-[var(--theme-card)] border border-[var(--theme-border)]
          text-[var(--theme-text)] hover:border-amber-500/50
          cursor-pointer transition-all
          focus:outline-none focus:border-amber-500
        "
      >
        <span>{currentLang.nativeName.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--theme-brand-gold)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && otherLanguages.length > 0 && (
        <div className="absolute top-full right-0 mt-1 py-1 rounded-lg bg-[var(--theme-card)] border border-[var(--theme-border)] shadow-lg z-50 min-w-[80px]">
          {otherLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => switchLanguage(lang.code)}
              className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--theme-bg-secondary)] transition-colors"
              style={{ color: 'var(--theme-text)' }}
            >
              {lang.nativeName.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}