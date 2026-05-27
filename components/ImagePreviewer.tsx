'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImagePreviewerProps {
  livePreview: string;
}

export default function ImagePreviewer({ livePreview }: ImagePreviewerProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/preview-images')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.images?.length > 0) {
          setImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-amber-950/30 to-transparent image-preview-container" style={{ paddingBottom: '2rem' }}>
      <div className="py-8 px-4" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20 border border-amber-500/20 mx-4" style={{ marginLeft: '1rem', marginRight: '1rem' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none" />
          
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-amber-500/90 text-black text-xs font-bold rounded-full flex items-center gap-2" style={{ padding: '0.375rem 0.75rem' }}>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {livePreview}
            </span>
          </div>

          <div className="relative h-[60vh] md:h-[75vh] lg:h-[80vh] overflow-hidden">
            {images.map((img, idx) => (
              <div key={idx} className="absolute inset-0" style={{ opacity: idx === currentIndex ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                <Image
                  src={img}
                  alt={`Sharm El-Sheikh ${idx + 1}`}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  loading={idx === 0 ? undefined : 'lazy'}
                  className="object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20" style={{ bottom: '1rem', left: '1rem', right: '1rem' }}>
            <div className="flex items-center justify-center gap-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-amber-400 scale-125' : 'bg-white/40'}`}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: idx === currentIndex ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                    transform: idx === currentIndex ? 'scale(1.25)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
