"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCalendar } from 'react-icons/fa';
import StarRating from './StarRating';
import { Review } from '@/types';
import ImageCarousel from '@/components/ImageCarousel';
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
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-4">
                {review.comment}
              </p>
            </button>
            
            {/* Image Carousel */}
            {images.length > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <ImageCarousel images={images} />
              </div>
            )}
          </motion.div>
        );
      })}
      {selectedReview && (
        <ReviewDetailModal
          isOpen={!!selectedReview}
          review={selectedReview}
          onClose={closeDetail}
          onDelete={async (id: string) => {
            if (!onDelete) return;
            await onDelete(id);
            closeDetail();
          }}
        />
      )}
    </div>
  );
}
