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
    { href: '/admin/reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.05c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.085a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  return (
    <AdminProviders>
      <div className="min-h-screen bg-[var(--theme-bg)]">
        <div className="flex">
          <aside className="w-64 bg-gradient-to-b from-[#1a1810] to-[#0d0c08] text-white min-h-screen fixed">
            <div className="p-6 border-b border-amber-500/20">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Traveloo
              </h1>
              <p className="text-xs text-amber-200/60 mt-1">Admin Panel</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-200/50">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {session.user.email}
              </div>
              <div className="mt-3">
                <ThemeToggle />
              </div>
            </div>
            <nav className="mt-4 px-3">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-200 rounded-lg transition-all mb-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-500/20">
              <Link 
                href="/"
                className="flex items-center gap-2 text-sm text-amber-200/50 hover:text-amber-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Back to Website
              </Link>
            </div>
          </aside>
          
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProviders>
  );
}