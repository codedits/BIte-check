'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
                <div className="relative w-full h-60">
                  <Image
                    src={/^https?:/i.test(review.imageUrl) ? review.imageUrl : `https://${review.imageUrl}`}
                    alt={`Photo by ${review.username}`}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              {review.images && review.images.map((url, i) => (
                <div key={url + i} className="relative w-full h-60">
                  <Image
                    src={/^https?:/i.test(url) ? url : `https://${url}`}
                    alt={`Photo ${i + 1} by ${review.username}`}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover rounded-lg"
                  />
                </div>
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
          {/* Removed per-review category breakdown (aggregated shown above) */}
        </motion.div>
      ))}
    </div>
  );
}
