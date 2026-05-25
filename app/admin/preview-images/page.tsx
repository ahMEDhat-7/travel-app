'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useNotification } from '@/components/Notification';

interface PreviewImage {
  name: string;
  path: string;
}

export default function AdminPreviewImagesPage() {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useNotification();

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/preview-images');
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch {
      showNotification('Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/preview-images', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!data.success) {
          showNotification(`Failed to upload ${file.name}`, 'error');
        }
      } catch {
        showNotification(`Failed to upload ${file.name}`, 'error');
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setUploading(false);
    await fetchImages();
    showNotification('Images uploaded successfully', 'success');
  };

  const handleDelete = async (fileName: string) => {
    try {
      const res = await fetch(`/api/admin/preview-images?fileName=${fileName}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.name !== fileName));
        showNotification('Image deleted', 'success');
      } else {
        showNotification(data.error || 'Failed to delete', 'error');
      }
    } catch {
      showNotification('Failed to delete image', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Preview Images</h1>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Upload Images</h2>
        <p className="text-sm text-gray-400 mb-4">
          These images appear in the hero slideshow on the homepage. Supported formats: JPG, PNG, WebP, GIF. Max size: 5MB each.
        </p>

        <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 cursor-pointer transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Current Images ({images.length})
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No preview images uploaded yet.</p>
            <p className="text-sm mt-1">The homepage is using default fallback images.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.name} className="group relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-700">
                <Image
                  src={img.path}
                  alt={img.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.name)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-all"
                    title="Delete image"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white truncate">{img.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
