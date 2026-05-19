'use client';

import { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2
          px-3 py-2 rounded-lg cursor-pointer
          bg-[var(--theme-card)] border border-[var(--theme-border)]
          text-[var(--theme-text)] hover:border-amber-500/50
          transition-colors appearance-none
          focus:outline-none focus:border-amber-500
          disabled:opacity-50 disabled:cursor-not-allowed
          min-w-[100px]
        `}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className="text-sm truncate">
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--theme-brand-gold)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-1 w-full min-w-[120px]
            py-1 rounded-lg z-50
            bg-[var(--theme-card)] border border-[var(--theme-border)]
            shadow-lg overflow-hidden
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2
                text-sm text-left transition-colors
                hover:bg-[var(--theme-bg-secondary)]
                ${option.value === value ? 'bg-[var(--theme-bg-secondary)]' : ''}
              `}
              style={{ color: 'var(--theme-text)' }}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}