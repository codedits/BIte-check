"use client";

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CloudImage from '@/components/CloudImage';
import { normalizeImageSrc } from '@/lib/normalizeImageSrc';

interface ImageLightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export default function ImageLightbox({ images, index, onClose, onNavigate }: ImageLightboxProps) {
  const total = images.length;
  const current = images[index];

  const nav = useCallback((dir: 1 | -1) => {
    if (total < 2) return;
    const next = (index + dir + total) % total;
    onNavigate(next);
  }, [index, total, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nav(1);
      if (e.key === 'ArrowLeft') nav(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nav, onClose]);

  if (!current) return null;

  const src = normalizeImageSrc(current);
  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col"
        aria-modal="true"
        role="dialog"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 text-white text-sm">
          <span className="font-medium">Image {index + 1} of {total}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
          >
            <FaTimes />
          </button>
        </div>
  <div className="flex-1 relative flex items-center justify-center px-4 pb-4 md:pb-6 select-none overflow-hidden">
          {total > 1 && (
            <button
              aria-label="Previous image"
              onClick={() => nav(-1)}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white"
            >
              <FaChevronLeft />
            </button>
          )}
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="relative"
          >
            <div className="relative max-w-[92vw] md:max-w-[86vw] max-h-[70vh] md:max-h-[72vh] flex items-center justify-center">
              <CloudImage
                src={src}
                alt={`Image ${index + 1}`}
                width={1600}
                height={900}
                fillCrop
                className="object-contain w-auto h-auto max-w-full max-h-[70vh] md:max-h-[72vh] rounded-lg shadow-lg"
                loading="eager"
              />
            </div>
          </motion.div>
          {total > 1 && (
            <button
              aria-label="Next image"
              onClick={() => nav(1)}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:pb-4" aria-label="Image thumbnails">
            {images.map((img, i) => {
              const tSrc = normalizeImageSrc(img);
              if (!tSrc) return null;
              return (
                <button
                  key={`${tSrc}-${i}`}
                  onClick={() => onNavigate(i)}
                  className={`relative h-14 md:h-16 aspect-video rounded-md overflow-hidden border ${i === index ? 'border-orange-500' : 'border-white/10 hover:border-white/30'} flex-shrink-0`}
                  aria-label={`View image ${i + 1}`}
                >
                  <CloudImage
                    src={tSrc}
                    alt={`Thumbnail ${i + 1}`}
                    width={320}
                    height={180}
                    fillCrop
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
