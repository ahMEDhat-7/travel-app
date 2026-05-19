'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNotification } from '@/components/Notification';
import Select from '@/components/ui/Select';

interface Tour {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  price: number;
  location: string;
  duration: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
}

interface TourFormData {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  highlights: string;
  included: string;
  notIncluded: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  images: string;
  maxCapacity: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
}

const initialFormData: TourFormData = {
  slug: '',
  title: '',
  shortDesc: '',
  description: '',
  highlights: '',
  included: '',
  notIncluded: '',
  price: 0,
  duration: '',
  location: '',
  category: '',
  images: '',
  maxCapacity: 20,
  isActive: true,
  isFeatured: false,
  isBestseller: false,
};

function AdminToursContent() {
  const { showNotification, showConfirm } = useNotification();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState<TourFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    try {
      const res = await fetch('/api/admin/tours');
      const data = await res.json();
      setTours(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (tourId: string, isActive: boolean) => {
    try {
      await fetch(`/api/tours`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tourId, isActive }),
      });
      setTours(prev => prev.map(t => t.id === tourId ? { ...t, isActive } : t));
      showNotification(isActive ? 'Tour activated' : 'Tour deactivated');
    } catch (error) {
      console.error('Failed to toggle active:', error);
      showNotification('Failed to update tour', 'error');
    }
  };

  const handleToggleFeatured = async (tourId: string, isFeatured: boolean) => {
    try {
      await fetch(`/api/admin/tours`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tourId, isFeatured }),
      });
      setTours(prev => prev.map(t => t.id === tourId ? { ...t, isFeatured } : t));
      showNotification(isFeatured ? 'Tour marked as featured' : 'Tour removed from featured');
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      showNotification('Failed to update tour', 'error');
    }
  };

  const handleToggleBestseller = async (tourId: string, isBestseller: boolean) => {
    try {
      await fetch(`/api/admin/tours`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tourId, isBestseller }),
      });
      setTours(prev => prev.map(t => t.id === tourId ? { ...t, isBestseller } : t));
      showNotification(isBestseller ? 'Tour marked as bestseller' : 'Tour removed from bestseller');
    } catch (error) {
      console.error('Failed to toggle bestseller:', error);
      showNotification('Failed to update tour', 'error');
    }
  };

  const handleDelete = async (tourId: string) => {
    showConfirm('Are you sure you want to delete this tour?', async () => {
      setDeletingId(tourId);
      try {
        await fetch(`/api/admin/tours?id=${tourId}`, { method: 'DELETE' });
        setTours(prev => prev.filter(t => t.id !== tourId));
        showNotification('Tour deleted successfully');
      } catch (error) {
        console.error('Failed to delete tour:', error);
        showNotification('Failed to delete tour', 'error');
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      slug: tour.slug,
      title: tour.title,
      shortDesc: tour.shortDesc,
      description: '',
      highlights: '',
      included: '',
      notIncluded: '',
      price: tour.price,
      duration: tour.duration,
      location: tour.location,
      category: tour.category,
      images: '',
      maxCapacity: 20,
      isActive: tour.isActive,
      isFeatured: tour.isFeatured,
      isBestseller: tour.isBestseller,
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingTour(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      slug: formData.slug,
      title: formData.title,
      shortDesc: formData.shortDesc,
      description: formData.description || formData.shortDesc,
      highlights: formData.highlights.split('\n').filter(h => h.trim()),
      included: formData.included.split('\n').filter(i => i.trim()),
      notIncluded: formData.notIncluded.split('\n').filter(n => n.trim()),
      translations: {
        en: { title: formData.title, shortDesc: formData.shortDesc, description: formData.description || formData.shortDesc },
        ru: { title: formData.title, shortDesc: formData.shortDesc, description: formData.description || formData.shortDesc },
      },
      price: formData.price,
      duration: formData.duration,
      location: formData.location,
      category: formData.category,
      images: formData.images ? formData.images.split('\n').filter(i => i.trim()) : ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800'],
      maxCapacity: formData.maxCapacity,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      isBestseller: formData.isBestseller,
    };

    try {
      if (editingTour) {
        const res = await fetch('/api/admin/tours', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingTour.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setTours(prev => prev.map(t => t.id === editingTour.id ? { ...t, ...payload, id: editingTour.id } : t));
          showNotification('Tour updated successfully');
        } else {
          showNotification(data.error || 'Failed to update tour', 'error');
        }
      } else {
        const res = await fetch('/api/admin/tours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setTours(prev => [...prev, data.data]);
          showNotification('Tour created successfully');
        } else {
          showNotification(data.error || 'Failed to create tour', 'error');
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save tour:', error);
      showNotification('Failed to save tour', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredTours = tours.filter(tour => {
    if (filter === 'active' && !tour.isActive) return false;
    if (filter === 'inactive' && tour.isActive) return false;
    if (filter === 'featured' && !tour.isFeatured) return false;
    if (filter === 'bestseller' && !tour.isBestseller) return false;
    if (search && !tour.title.toLowerCase().includes(search.toLowerCase())) return false;
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
          <h1 className="text-3xl font-bold text-[var(--theme-text)]">Tours</h1>
          <p className="text-[var(--theme-text-secondary)] mt-1">Manage your tour listings</p>
        </div>
        
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          + Add New Tour
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search tours..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:border-amber-500"
        />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Tours' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'featured', label: 'Featured' },
            { value: 'bestseller', label: 'Bestseller' },
          ]}
        />
      </div>

      <div className="bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--theme-bg-tertiary)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Tour</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--theme-text)]">Badges</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--theme-text)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {filteredTours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[var(--theme-text-muted)]">
                    No tours found.
                  </td>
                </tr>
              ) : (
                filteredTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-[var(--theme-bg-secondary)] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[var(--theme-text)]">{tour.title}</p>
                        <p className="text-sm text-[var(--theme-text-muted)]">{tour.duration} • {tour.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--theme-text-secondary)]">{tour.location}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-amber-500">${tour.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(tour.id, !tour.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tour.isActive 
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                            : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                        }`}
                      >
                        {tour.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {tour.isFeatured && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-xs">Featured</span>}
                        {tour.isBestseller && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-500 rounded text-xs">Bestseller</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleToggleFeatured(tour.id, !tour.isFeatured)}
                          className={`px-2 py-1 rounded text-xs ${
                            tour.isFeatured 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)]'
                          }`}
                        >
                          Featured
                        </button>
                        <button
                          onClick={() => handleToggleBestseller(tour.id, !tour.isBestseller)}
                          className={`px-2 py-1 rounded text-xs ${
                            tour.isBestseller 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)]'
                          }`}
                        >
                          Bestseller
                        </button>
                        <button
                          onClick={() => handleEdit(tour)}
                          className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          disabled={deletingId === tour.id}
                          className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-500 hover:bg-red-500/30 disabled:opacity-50"
                        >
                          {deletingId === tour.id ? '...' : 'Delete'}
                        </button>
                      </div>
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
          <div className="bg-[var(--theme-card)] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">
              {editingTour ? 'Edit Tour' : 'Create New Tour'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 3 days"
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Images (one per line)</label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  rows={2}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-[var(--theme-text)]">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-[var(--theme-text)]">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-[var(--theme-text)]">Bestseller</span>
                </label>
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
                  {saving ? 'Saving...' : (editingTour ? 'Update Tour' : 'Create Tour')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminToursPage() {
  return <AdminToursContent />;
}