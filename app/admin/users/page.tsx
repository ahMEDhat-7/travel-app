'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: string;
  createdAt: string;
  lastActiveAt: string | null;
  phone: string | null;
  bookingsCount: number;
  reviewsCount: number;
  isOnline: boolean;
}

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--theme-text)]">Users</h1>
          <p className="text-[var(--theme-text-secondary)] mt-1">
            {users.length} registered user{users.length !== 1 ? 's' : ''} • {users.filter(u => u.isOnline).length} online
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[var(--theme-text-muted)]">
            No users found.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-amber-500">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--theme-card)] ${
                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--theme-text)] truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-[var(--theme-text-muted)] truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${user.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </span>
                    {user.role === 'ADMIN' && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded text-xs font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--theme-border)]">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-[var(--theme-text)]">{user.bookingsCount}</p>
                    <p className="text-xs text-[var(--theme-text-muted)]">Bookings</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--theme-text)]">{user.reviewsCount}</p>
                    <p className="text-xs text-[var(--theme-text-muted)]">Reviews</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--theme-text)]">
                      {user.lastActiveAt
                        ? new Date(user.lastActiveAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '-'}
                    </p>
                    <p className="text-xs text-[var(--theme-text-muted)]">Last Active</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-[var(--theme-text-muted)]">
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {user.phone && ` • ${user.phone}`}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
