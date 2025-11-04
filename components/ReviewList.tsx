"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Use CloudImage for Cloudinary optimization
import CloudImage from '@/components/CloudImage';
import { FaUser, FaCalendar } from 'react-icons/fa';
import StarRating from './StarRating';
import { Review } from '@/types';
import ImageLightbox from '@/components/ImageLightbox';
import ReviewDetailModal from '@/components/ReviewDetailModal';
import { normalizeImageSrc } from '@/lib/normalizeImageSrc';

interface ReviewListProps {
  reviews: Review[];
  onDelete?: (id: string) => Promise<void> | void;
}

export default function ReviewList({ reviews, onDelete }: ReviewListProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const openDetail = (r: Review) => setSelectedReview(r);
  const closeDetail = () => setSelectedReview(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };
  const closeLightbox = () => {
    setLightboxImages([]);
    setLightboxIndex(0);
  };
  if (reviews.length === 0) {
    return (
      <div className="glass-card text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No reviews yet</div>
        <div className="text-gray-500">Be the first to share your experience!</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => {
        // Normalize image list
        const rawImages: string[] = [];
        if (review.imageUrl) rawImages.push(review.imageUrl);
        if (Array.isArray(review.images)) rawImages.push(...review.images);
        const images = rawImages
          .map((img) => normalizeImageSrc(img))
          .filter((img): img is string => Boolean(img));
        const showImages = images.slice(0, 4); // show up to 4 in grid
        const remaining = images.length - showImages.length;

        const renderImage = (url: string, i: number, overlayCount?: number) => {
          if (!url) return null;
          const src = normalizeImageSrc(url);
          if (!src) return null;
          return (
            <button
              type="button"
              key={url + i}
              onClick={() => openLightbox(images, i)}
              className="relative group overflow-hidden rounded-lg aspect-[16/9] bg-black/30 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <CloudImage
                src={src}
                alt={`Photo ${i + 1} by ${review.username}`}
                width={800}
                height={450}
                fillCrop
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {overlayCount && overlayCount > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">+{overlayCount}</span>
                </div>
              )}
            </button>
          );
        };

        // Layout variants
  let gridContent: React.ReactElement | null = null;
        if (showImages.length === 1) {
          gridContent = (
            <div className="mb-4">
              {renderImage(showImages[0], 0)}
            </div>
          );
        } else if (showImages.length === 2) {
          gridContent = (
            <div className="mb-4 grid grid-cols-2 gap-3">
              {showImages.map((u, i) => renderImage(u, i))}
            </div>
          );
        } else if (showImages.length === 3) {
          gridContent = (
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="col-span-2">{renderImage(showImages[0], 0)}</div>
              <div className="flex flex-col gap-3">
                {renderImage(showImages[1], 1)}
                {renderImage(showImages[2], 2)}
              </div>
            </div>
          );
        } else if (showImages.length === 4) {
          gridContent = (
            <div className="mb-4 grid grid-cols-2 gap-3">
              {showImages.map((u, i) => renderImage(u, i, i === 3 ? remaining : 0))}
            </div>
          );
        }

        return (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className="glass-card"
          >
            <button type="button" onClick={() => openDetail(review)} className="text-left w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="glass w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-white text-sm sm:text-base" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm sm:text-base">{review.username}</div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <FaCalendar className="text-xs" />
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-xs sm:text-sm text-gray-300 font-medium">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {review.comment}
              </p>
            </button>
          </motion.div>
        );
      })}
      {selectedReview && (
        <ReviewDetailModal
          isOpen={!!selectedReview}
          review={selectedReview}
          onClose={closeDetail}
          onOpenLightbox={(imgs, i) => { openLightbox(imgs, i); closeDetail(); }}
          onDelete={async (id: string) => {
            if (!onDelete) return;
            await onDelete(id);
            closeDetail();
          }}
        />
      )}
      {lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          index={lightboxIndex}
            onClose={closeLightbox}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  );
}
