'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import CloudImage from './CloudImage';

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

export default function ImageCarousel({ images, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      {/* Carousel */}
      <div className={`relative ${className}`}>
        {/* Main Image */}
        <div 
          className="relative aspect-video cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          onClick={openLightbox}
        >
          <CloudImage
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width={800}
            height={450}
            fillCrop
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation Arrows - only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  idx === currentIndex
                    ? 'border-white/60 ring-2 ring-white/20'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <CloudImage
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={96}
                  height={64}
                  fillCrop
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <CloudImage
                src={images[currentIndex]}
                alt={`Full size image ${currentIndex + 1}`}
                width={1920}
                height={1080}
                className="max-h-[90vh] w-auto rounded-2xl object-contain"
              />

              {/* Counter in lightbox */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </div>

              {/* Navigation in lightbox */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-4 text-white backdrop-blur-sm transition hover:bg-black/80"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-4 text-white backdrop-blur-sm transition hover:bg-black/80"
                    aria-label="Next image"
                  >
                    <FaChevronRight className="text-xl" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
