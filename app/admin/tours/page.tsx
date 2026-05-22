'use client';

import { useEffect, useState, useRef } from 'react';
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

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface TourFormData {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  ruTitle: string;
  ruShortDesc: string;
  ruDescription: string;
  ruHighlights: string;
  ruIncluded: string;
  ruNotIncluded: string;
  ruItinerary: string;  // New field for Russian itinerary (JSON string)
  highlights: string;
  included: string;
  notIncluded: string;
  price: number;
  childPrice: number;
  discountPrice: number;
  duration: string;
  location: string;
  category: string;
  images: string[];
  maxCapacity: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  hasFreeCancellation: boolean;
  itinerary: ItineraryDay[];
}

const initialFormData: TourFormData = {
  slug: '',
  title: '',
  shortDesc: '',
  description: '',
  ruTitle: '',
  ruShortDesc: '',
  ruDescription: '',
  ruHighlights: '',
  ruIncluded: '',
  ruNotIncluded: '',
  ruItinerary: '',  // New field for Russian itinerary (JSON string)
  highlights: '',
  included: '',
  notIncluded: '',
  price: 0,
  childPrice: 0,
  discountPrice: 0,
  duration: '',
  location: '',
  category: '',
  images: [],
  maxCapacity: 20,
  isActive: true,
  isFeatured: false,
  isBestseller: false,
  hasFreeCancellation: false,
  itinerary: [],
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function AdminToursContent() {
  const { showNotification, showConfirm } = useNotification();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState<TourFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleGenerateSlug = () => {
    setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
  };

  const handleSlugChange = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedPaths: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          uploadedPaths.push(data.path);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedPaths]
    }));
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = formData.images[index];
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddItineraryDay = () => {
    const newDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: newDay, title: '', description: '' }]
    }));
  };

  const handleRemoveItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }))
    }));
  };

  const handleItineraryChange = (index: number, field: keyof ItineraryDay, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === index ? { ...day, [field]: field === 'day' ? Number(value) : value } : day
      )
    }));
  };

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
      ruTitle: '',
      ruShortDesc: '',
      ruDescription: '',
      ruHighlights: '',
      ruIncluded: '',
      ruNotIncluded: '',
      ruItinerary: '',  // Add the missing field
      highlights: '',
      included: '',
      notIncluded: '',
      price: tour.price,
      childPrice: 0,
      discountPrice: 0,
      duration: tour.duration,
      location: tour.location,
      category: tour.category,
      images: [],
      maxCapacity: 20,
      isActive: tour.isActive,
      isFeatured: tour.isFeatured,
      isBestseller: tour.isBestseller,
      hasFreeCancellation: false,
      itinerary: [],
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
        ru: { 
          title: formData.ruTitle || formData.title, 
          shortDesc: formData.ruShortDesc || formData.shortDesc, 
          description: formData.ruDescription || formData.description || formData.shortDesc,
          highlights: formData.ruHighlights ? formData.ruHighlights.split('\n').filter(h => h.trim()) : undefined,
          included: formData.ruIncluded ? formData.ruIncluded.split('\n').filter(i => i.trim()) : undefined,
          notIncluded: formData.ruNotIncluded ? formData.ruNotIncluded.split('\n').filter(n => n.trim()) : undefined,
          itinerary: formData.ruItinerary && formData.ruItinerary.trim() !== '' ? JSON.parse(formData.ruItinerary) : undefined,
        },
      },
      price: formData.price,
      childPrice: formData.childPrice > 0 ? formData.childPrice : undefined,
      discountPrice: formData.discountPrice > 0 ? formData.discountPrice : undefined,
      duration: formData.duration,
      location: formData.location,
      category: formData.category,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800'],
      maxCapacity: formData.maxCapacity,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      isBestseller: formData.isBestseller,
      hasFreeCancellation: formData.hasFreeCancellation,
      itinerary: formData.itinerary.length > 0 ? formData.itinerary : undefined,
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
                      <tr 
                        key={tour.id} 
                        className="hover:bg-[var(--theme-bg-secondary)] transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedTour(tour);
                          setShowDetailsModal(true);
                          setLoadingDetails(true);
                          // Fetch full tour details if needed
                          fetch(`/api/tours/${tour.id}`)
                            .then(res => res.json())
                            .then(data => {
                              if (data.data) {
                                setSelectedTour(data.data);
                              }
                              setLoadingDetails(false);
                            })
                            .catch(() => {
                              setLoadingDetails(false);
                            });
                        }}
                      >
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
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering row click
                              handleToggleActive(tour.id, !tour.isActive);
                            }}
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
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering row click
                                handleToggleFeatured(tour.id, !tour.isFeatured);
                              }}
                              className={`px-2 py-1 rounded text-xs ${
                                tour.isFeatured 
                                  ? 'bg-yellow-500 text-white' 
                                  : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)]'
                            }`}
                            >
                              Featured
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering row click
                                handleToggleBestseller(tour.id, !tour.isBestseller);
                              }}
                              className={`px-2 py-1 rounded text-xs ${
                                tour.isBestseller 
                                  ? 'bg-purple-500 text-white' 
                                  : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)]'
                            }`}
                            >
                              Bestseller
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering row click
                                handleEdit(tour);
                              }}
                              className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering row click
                                handleDelete(tour.id);
                              }}
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

      {showDetailsModal && selectedTour && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-[var(--theme-card)] rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--theme-text)]">
                Tour Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-[var(--theme-bg-tertiary)] text-[var(--theme-text)] rounded-lg hover:bg-[var(--theme-border)] transition-colors"
              >
                Close
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">Title</p>
                        <p className="font-medium text-[var(--theme-text)]">{selectedTour.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">Slug</p>
                        <p className="font-mono text-sm text-[var(--theme-text)]">{selectedTour.slug}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">Price</p>
                        <p className="font-semibold text-amber-500">${selectedTour.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">Category</p>
                        <p className="text-[var(--theme-text)]">{selectedTour.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">Duration</p>
                        <p className="text-[var(--theme-text)]">{selectedTour.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">Location</p>
                        <p className="text-[var(--theme-text)]">{selectedTour.location}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Status</h3>
                    <div className="space-y-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedTour.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {selectedTour.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {selectedTour.isFeatured && <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 ml-2">Featured</span>}
                      {selectedTour.isBestseller && <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500 ml-2">Bestseller</span>}
                    </div>
                  </div>
                </div>

                {(selectedTour as any).description && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Description</h3>
                    <p className="text-[var(--theme-text-secondary)] leading-relaxed">{(selectedTour as any).description}</p>
                  </div>
                )}

                {(selectedTour as any).shortDesc && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Short Description</h3>
                    <p className="text-[var(--theme-text-secondary)]">{(selectedTour as any).shortDesc}</p>
                  </div>
                )}

                {(selectedTour as any).highlights && (selectedTour as any).highlights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Highlights</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {(selectedTour as any).highlights.map((h: string, i: number) => (
                        <li key={i} className="text-[var(--theme-text-secondary)]">{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(selectedTour as any).included && (selectedTour as any).included.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-green-500 mb-2">Included</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {(selectedTour as any).included.map((item: string, i: number) => (
                          <li key={i} className="text-[var(--theme-text-secondary)]">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(selectedTour as any).notIncluded && (selectedTour as any).notIncluded.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-red-500 mb-2">Not Included</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {(selectedTour as any).notIncluded.map((item: string, i: number) => (
                          <li key={i} className="text-[var(--theme-text-secondary)]">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {(selectedTour as any).itinerary && (selectedTour as any).itinerary.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-3">Itinerary</h3>
                    <div className="space-y-3">
                      {(selectedTour as any).itinerary.map((day: any, i: number) => (
                        <div key={i} className="border-l-4 border-amber-500 pl-4 py-1">
                          <h4 className="font-medium text-[var(--theme-text)]">Day {day.day}: {day.title}</h4>
                          <p className="text-[var(--theme-text-secondary)] text-sm mt-1">{day.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedTour as any).images && (selectedTour as any).images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-3">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(selectedTour as any).images.map((img: string, i: number) => (
                        <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden bg-[var(--theme-bg-tertiary)]">
                          <img src={img} alt={`Tour image ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedTour as any).maxCapacity && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-2">Additional Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--theme-text-muted)]">Max Capacity</p>
                        <p className="text-[var(--theme-text)]">{(selectedTour as any).maxCapacity} persons</p>
                      </div>
                      {(selectedTour as any).childPrice > 0 && (
                        <div>
                          <p className="text-sm text-[var(--theme-text-muted)]">Child Price</p>
                          <p className="text-[var(--theme-text)]">${(selectedTour as any).childPrice}</p>
                        </div>
                      )}
                      {(selectedTour as any).discountPrice > 0 && (
                        <div>
                          <p className="text-sm text-[var(--theme-text-muted)]">Discount Price</p>
                          <p className="text-[var(--theme-text)]">${(selectedTour as any).discountPrice}</p>
                        </div>
                      )}
                      {(selectedTour as any).hasFreeCancellation && (
                        <div>
                          <p className="text-sm text-[var(--theme-text-muted)]">Free Cancellation</p>
                          <p className="text-green-500">Yes</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--theme-card)] rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-4">
              {editingTour ? 'Edit Tour' : 'Create New Tour'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Slug</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="px-3 py-2 bg-[var(--theme-bg-tertiary)] text-[var(--theme-text)] rounded-lg hover:bg-[var(--theme-border)] text-sm whitespace-nowrap"
                    >
                      Generate from Title
                    </button>
                  </div>
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
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Child Price ($)</label>
                  <input
                    type="number"
                    value={formData.childPrice || ''}
                    onChange={(e) => setFormData({ ...formData, childPrice: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    value={formData.discountPrice || ''}
                    onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    placeholder="Optional"
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
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Images</label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : '+ Add Images'}
                  </label>
                  <span className="text-sm text-[var(--theme-text-muted)]">JPG, PNG, WebP, GIF (max 5MB)</span>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Highlights (one per line)</label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  rows={3}
                  placeholder="Enter each highlight on a new line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Included (one per line)</label>
                <textarea
                  value={formData.included}
                  onChange={(e) => setFormData({ ...formData, included: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  rows={3}
                  placeholder="Enter each item on a new line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Not Included (one per line)</label>
                <textarea
                  value={formData.notIncluded}
                  onChange={(e) => setFormData({ ...formData, notIncluded: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                  rows={3}
                  placeholder="Enter each item on a new line"
                />
              </div>

              <div className="border-t border-[var(--theme-border)] pt-6 mt-6">
                <h3 className="text-lg font-semibold text-[var(--theme-text)] mb-4 flex items-center gap-2">
                  <span className="text-lg">🇷🇺</span> Russian Translation
                </h3>
                <p className="text-sm text-[var(--theme-text-muted)] mb-4">Optional - leave empty to use English fallback</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Title (RU)</label>
                    <input
                      type="text"
                      value={formData.ruTitle}
                      onChange={(e) => setFormData({ ...formData, ruTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                      placeholder="Russian title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Short Description (RU)</label>
                    <input
                      type="text"
                      value={formData.ruShortDesc}
                      onChange={(e) => setFormData({ ...formData, ruShortDesc: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                      placeholder="Russian short description"
                    />
                  </div>
                </div>

<div className="mt-4">
  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Description (RU)</label>
  <textarea
    value={formData.ruDescription}
    onChange={(e) => setFormData({ ...formData, ruDescription: e.target.value })}
    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
    rows={3}
    placeholder="Russian description"
  />
</div>

<div className="mt-4">
  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Itinerary (RU) - JSON array of objects</label>
  <textarea
    value={formData.ruItinerary}
    onChange={(e) => setFormData({ ...formData, ruItinerary: e.target.value })}
    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
    rows={3}
    placeholder='[{"day":1,"title":"Night Departure","description":"Depart from Sharm El-Sheikh around 10:00 PM. The journey takes approximately 3 hours through the desert to the foot of Mount Sinai."}]'
  />
</div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Highlights (RU) - one per line</label>
                  <textarea
                    value={formData.ruHighlights}
                    onChange={(e) => setFormData({ ...formData, ruHighlights: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    rows={3}
                    placeholder="Enter each highlight in Russian on a new line"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Included (RU) - one per line</label>
                    <textarea
                      value={formData.ruIncluded}
                      onChange={(e) => setFormData({ ...formData, ruIncluded: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                      rows={3}
                      placeholder="Enter each item in Russian on a new line"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Not Included (RU) - one per line</label>
                    <textarea
                      value={formData.ruNotIncluded}
                      onChange={(e) => setFormData({ ...formData, ruNotIncluded: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                      rows={3}
                      placeholder="Enter each item in Russian on a new line"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[var(--theme-text)]">Itinerary</label>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="text-sm text-amber-500 hover:text-amber-600"
                  >
                    + Add Day
                  </button>
                </div>
                {formData.itinerary.map((day, idx) => (
                  <div key={idx} className="mb-3 p-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--theme-text)]">Day {day.day}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryDay(idx)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                      placeholder="Day title"
                      className="w-full px-3 py-2 mb-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                    />
                    <textarea
                      value={day.description}
                      onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                      placeholder="Day description"
                      className="w-full px-3 py-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)]"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasFreeCancellation}
                    onChange={(e) => setFormData({ ...formData, hasFreeCancellation: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-[var(--theme-text)]">Free Cancellation</span>
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