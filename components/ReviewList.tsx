'use client';

import { motion } from 'framer-motion';
import { FaUser, FaCalendar } from 'react-icons/fa';
import StarRating from './StarRating';
import { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
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
      {reviews.map((review, index) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="glass-card"
        >
          {(review.imageUrl || (review.images && review.images.length > 0)) && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {review.imageUrl && (
                <img src={review.imageUrl} alt={`Photo by ${review.username}`} className="w-full rounded-lg max-h-60 object-cover" />
              )}
              {review.images && review.images.map((url, i) => (
                <img key={url + i} src={url} alt={`Photo ${i + 1} by ${review.username}`} className="w-full rounded-lg max-h-60 object-cover" />
              ))}
            </div>
          )}
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
              <span className="text-xs sm:text-sm text-gray-300 font-medium">
                {review.rating}
              </span>
            </div>
          </div>
          
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {review.comment}
          </p>
          {/* Rating breakdown display */}
          {review.rating_breakdown && (
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="w-24">Taste</span>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating_breakdown.taste || 0} readonly size="sm" />
                  <span className="text-xs text-gray-200">{review.rating_breakdown.taste}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="w-24">Presentation</span>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating_breakdown.presentation || 0} readonly size="sm" />
                  <span className="text-xs text-gray-200">{review.rating_breakdown.presentation}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="w-24">Service</span>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating_breakdown.service || 0} readonly size="sm" />
                  <span className="text-xs text-gray-200">{review.rating_breakdown.service}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="w-24">Ambiance</span>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating_breakdown.ambiance || 0} readonly size="sm" />
                  <span className="text-xs text-gray-200">{review.rating_breakdown.ambiance}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="w-24">Value</span>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating_breakdown.value || 0} readonly size="sm" />
                  <span className="text-xs text-gray-200">{review.rating_breakdown.value}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
