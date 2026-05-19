'use client';

import { useEffect, useState } from 'react';
import { NotificationProvider, useNotification } from '@/components/Notification';
import Select from '@/components/ui/Select';

interface Booking {
  id: string;
  tourDate: string;
  people: number;
  totalPrice: number;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string | null;
  createdAt: string;
  tourTitle: string;
  userEmail: string;
}

interface Tour {
  id: string;
  title: string;
  price: number;
}

interface BookingFormData {
  tourId: string;
  tourDate: string;
  people: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

const initialFormData: BookingFormData = {
  tourId: '',
  tourDate: new Date().toISOString().split('T')[0],
  people: 1,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  notes: '',
};

function AdminBookingsContent() {
  const { showNotification, showConfirm } = useNotification();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [bookingsRes, toursRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/tours?limit=100'),
      ]);
      const bookingsData = await bookingsRes.json();
      const toursData = await toursRes.json();
      
      setBookings(bookingsData.data || []);
      setTours(toursData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (bookingId: string) => {
    showConfirm('Are you sure you want to delete this booking?', async () => {
      setDeletingId(bookingId);
      try {
        await fetch(`/api/admin/bookings?id=${bookingId}`, { method: 'DELETE' });
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        showNotification('Booking deleted successfully');
      } catch (error) {
        console.error('Failed to delete booking:', error);
        showNotification('Failed to delete booking', 'error');
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      tourId: '',
      tourDate: new Date(booking.tourDate).toISOString().split('T')[0],
      people: booking.people,
      contactName: booking.contactName,
      contactEmail: booking.contactEmail,
      contactPhone: booking.contactPhone,
      notes: booking.notes || '',
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingBooking(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const selectedTour = tours.find(t => t.id === formData.tourId);
    const totalPrice = selectedTour ? selectedTour.price * formData.people : 0;

    try {
      let data: { success: boolean; data?: any; error?: string };
      if (editingBooking) {
        const res = await fetch(`/api/admin/bookings?id=${editingBooking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            tourDate: formData.tourDate,
            totalPrice,
            status: editingBooking.status,
          }),
        });
        data = await res.json();
        if (data.success) {
          setBookings(prev => prev.map(b => b.id === editingBooking.id ? { ...b, ...data.data, tourTitle: editingBooking.tourTitle } : b));
          showNotification('Booking updated successfully');
        }
      } else {
        const res = await fetch('/api/admin/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            tourDate: formData.tourDate,
            totalPrice,
          }),
        });
        data = await res.json();
        if (data.success) {
          const newBooking = {
            ...data.data,
            tourTitle: selectedTour?.title || 'Unknown',
            userEmail: 'N/A',
          };
          setBookings(prev => [newBooking, ...prev]);
          showNotification('Booking created successfully');
        }
      }
      setShowModal(false);
      setFormData(initialFormData);
      setEditingBooking(null);
    } catch (error) {
      console.error('Failed to save booking:', error);
      showNotification('Failed to save booking', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500/20 text-green-500';
      case 'CANCELLED': return 'bg-red-500/20 text-red-500';
      default: return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter !== 'all' && booking.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        booking.contactName.toLowerCase().includes(searchLower) ||
        booking.contactEmail.toLowerCase().includes(searchLower) ||
        booking.tourTitle?.toLowerCase().includes(searchLower) ||
        booking.contactPhone.includes(search)
      );
    }
    return true;
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
          <h1 className="text-3xl font-bold text-[var(--theme-text)]">Bookings</h1>
          <p className="text-[var(--theme-text-secondary)] mt-1">Manage customer bookings</p>
        </div>
        
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          + Add New Booking
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, tour..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:border-amber-500"
        />
<Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Bookings' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
      </div>

      <div className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--theme-bg-tertiary)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Tour</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Guests</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--theme-text)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[var(--theme-text-muted)]">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[var(--theme-bg-secondary)] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[var(--theme-text)]">{booking.contactName}</p>
                        <p className="text-sm text-[var(--theme-text-muted)]">{booking.contactEmail}</p>
                        <p className="text-sm text-[var(--theme-text-muted)]">{booking.contactPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--theme-text-secondary)]">
                      {booking.tourTitle || 'Unknown Tour'}
                    </td>
                    <td className="px-6 py-4 text-[var(--theme-text-secondary)]">
                      {booking.tourDate ? formatDate(booking.tourDate) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-sm font-medium">
                        {booking.people}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--theme-text-muted)] text-sm">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleEdit(booking)}
                        className="text-blue-500 hover:text-blue-600 text-sm mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        disabled={deletingId === booking.id}
                        className="text-red-500 hover:text-red-600 text-sm disabled:opacity-50"
                      >
                        {deletingId === booking.id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--theme-card)] rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">
              {editingBooking ? 'Edit Booking' : 'Create New Booking'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Tour</label>
                <Select
                  value={formData.tourId}
                  onChange={(e) => setFormData({ ...formData, tourId: e.target.value })}
                  options={[{ value: '', label: 'Select a tour' }, ...tours.map(tour => ({ value: tour.id, label: `${tour.title} ($${tour.price})` }))]}
                  className="py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Tour Date</label>
                  <input
                    type="date"
                    value={formData.tourDate}
                    onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.people}
                    onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[var(--theme-bg-tertiary)] text-[var(--theme-text)] rounded-lg hover:bg-[var(--theme-border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return <AdminBookingsContent />;
}