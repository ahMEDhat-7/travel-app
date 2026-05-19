'use client';

import { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export default function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`
        w-full px-4 py-3 rounded-xl cursor-pointer
        bg-[var(--theme-card)] border border-[var(--theme-border)]
        text-[var(--theme-text)] hover:border-amber-500/50
        focus:outline-none focus:border-amber-500
        transition-colors appearance-none
        ${className}
      `}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C8A227'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '16px',
        paddingRight: '40px',
      }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[var(--theme-card)]">
          {opt.label}
        </option>
      ))}
    </select>
  );
}