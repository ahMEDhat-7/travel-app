import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminProviders from '@/components/AdminProviders';
import ThemeToggle from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return null;
  }
  
  return session;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await checkAdminAuth();

  if (!session) {
    redirect('/auth/signin');
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/tours', label: 'Tours', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { href: '/admin/bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { href: '/admin/messages', label: 'Messages', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { href: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { href: '/admin/reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.05c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.085a1 1 0 00.951-.69l1.519-4.674z' },
    { href: '/admin/contact', label: 'Contact Info', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <AdminProviders>
      <div className="min-h-screen bg-[var(--theme-bg)]">
        <div className="flex">
          <aside className="w-64 bg-gradient-to-b from-[#1a1810] to-[#0d0c08] text-white min-h-screen fixed flex flex-col">
            <div className="p-6 border-b border-amber-500/20">
              <div>
                <p className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Admin Panel</p>
                <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  {session.user.email}
                </div>
              </div>
              <div className="mt-3">
                <ThemeToggle />
              </div>
            </div>
            <nav className="flex-1 p-3 overflow-y-auto">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-amber-500/10 hover:text-[var(--theme-gold)] rounded-lg transition-all mb-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-amber-500/20">
              <Link 
                href="/"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[var(--theme-gold)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Back to Website
              </Link>
            </div>
          </aside>
          
          <div className="flex-1 ml-64">
            <header className="bg-[var(--theme-card)] border-b border-[var(--theme-border)] px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Sharm Cloud Tours
                </h1>
                <Link 
                  href="/"
                  className="text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
                >
                  View Site &rarr;
                </Link>
              </div>
            </header>
            
            <main className="p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminProviders>
  );
}
