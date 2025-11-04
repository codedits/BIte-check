"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import ImageCarousel from '@/components/ImageCarousel';
import StarRating from './StarRating';
import { Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeImageSrc } from '@/lib/normalizeImageSrc';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onDelete?: (id: string) => Promise<void> | void;
}

export default function ReviewDetailModal({ isOpen, onClose, review, onDelete }: ReviewDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const { user } = useAuth();

  if (!review) return null;

  const rawImages: string[] = [];
  if (review.imageUrl) rawImages.push(review.imageUrl);
  if (Array.isArray(review.images)) rawImages.push(...review.images);
  const images = rawImages
    .map((img) => normalizeImageSrc(img))
    .filter((img): img is string => Boolean(img));

  const canDelete = !!user && (review?.userId === user.id || review?.username === user.username);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="glass-modal w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white truncate">{review.restaurant || 'Review'}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-300" />
                    <span>{(review as any).location || 'Unknown location'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} readonly size="sm" />
                    <span className="text-white font-medium">{review.rating}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">By {review.username} • {new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {onDelete && review?._id && canDelete && (
                  <button
                    onClick={async () => {
                      if (!review._id) return;
                      if (!confirm('Delete this review? This cannot be undone.')) return;
                      try {
                        await onDelete(review._id as string);
                        onClose();
                      } catch (err) {
                        console.error('Delete failed', err);
                        alert((err as Error).message || 'Failed to delete review');
                      }
                    }}
                    className="glass-button p-2 hover:bg-red-500/20 hover:text-red-400"
                    aria-label="Delete review"
                  >
                    🗑
                  </button>
                )}
                <button onClick={onClose} className="glass-button p-2 hover:bg-red-500/20 hover:text-red-400" aria-label="Close review detail">
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Images Gallery with Carousel */}
            {images.length > 0 && (
              <div className="px-4 pb-4">
                <ImageCarousel images={images} />
              </div>
            )}

            <div className="p-4 pt-0">
              <div className="mb-3">
                <h3 className="text-sm text-gray-300 mb-2">Rating breakdown</h3>
                <div className="grid grid-cols-1 gap-2">
                  {review.rating_breakdown ? (
                    (['taste','presentation','service','ambiance','value'] as const).map((k) => (
                      <div key={k} className="flex items-center justify-between text-sm text-gray-300">
                        <span className="capitalize">{k}</span>
                        <div className="flex items-center gap-3">
                          <StarRating rating={(review.rating_breakdown as any)[k] || 0} readonly size="sm" />
                          <span className="text-white font-medium">{(review.rating_breakdown as any)[k] ?? '-'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400">No category breakdown available.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-300 mb-2">Comment</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{review.comment}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
