'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

export default function AdminShell({
  children,
  session,
  navItems,
}: {
  children: React.ReactNode;
  session: { user?: { email?: string | null } };
  navItems: NavItem[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`w-64 bg-[var(--theme-card)] border-r border-[var(--theme-border)] min-h-screen fixed z-40 flex flex-col transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          {/* Close button - mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-border)] transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 border-b border-[var(--theme-border)]">
            <div>
              <p className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Admin Panel
              </p>
              <div className="flex items-center gap-2 text-xs text-[var(--theme-text-muted)] mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                {session.user?.email ?? ''}
              </div>
            </div>
            <div className="mt-3">
              <ThemeToggle />
            </div>
          </div>

          <nav className="flex-1 p-3 overflow-y-auto">
            <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--theme-text-disabled)]">
              Navigate
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                    isActive
                      ? 'bg-[var(--theme-gold)]/10 text-[var(--theme-gold)] border-l-2 border-[var(--theme-gold)]'
                      : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-tertiary)] hover:text-[var(--theme-text)] border-l-2 border-transparent'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[var(--theme-border)]">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Back to Website
            </Link>
          </div>
        </aside>

        <div className="flex-1 min-w-0 lg:ml-64">
          <header className="bg-[var(--theme-card)] border-b border-[var(--theme-border)] px-4 sm:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-[var(--theme-text)] bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-border)] transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Sharm Cloud Tours
                </h1>
              </div>
              <Link
                href="/"
                className="text-xs sm:text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors whitespace-nowrap"
              >
                View Site &rarr;
              </Link>
            </div>
          </header>

          <main className="p-4 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
