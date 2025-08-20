"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaMapMarkerAlt, FaUtensils, FaStar, FaPlus, FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import AddReviewModal from "@/components/AddReviewModal";
import ReviewList from "@/components/ReviewList";
import { useAuth } from "@/contexts/AuthContext";
import { Restaurant, Review } from '@/types';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useRestaurantReviews } from '@/hooks/useRestaurantReviews';

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { isAuthenticated } = useAuth();

  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(id);
  const { reviews, loading: reviewsLoading, error: reviewsError, addReview } = useRestaurantReviews(restaurant?.name);
  const loading = restaurantLoading || reviewsLoading;
  const error = restaurantError || reviewsError;
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const ratingBreakdown = useMemo(() => {
    if (!reviews.length) return null;
    const cats = ['taste','presentation','service','ambiance','value'] as const;
    const sums: Record<string, number> = {}; const counts: Record<string, number> = {};
    for (const c of cats) { sums[c] = 0; counts[c] = 0; }
    let have = false;
    for (const rev of reviews) {
      if (rev.rating_breakdown) {
        have = true;
        for (const c of cats) {
          const v = (rev.rating_breakdown as any)[c];
            if (typeof v === 'number') { sums[c] += v; counts[c]++; }
        }
      }
    }
    if (!have) return null;
    const avg: Record<string, number> = {};
    for (const c of cats) avg[c] = counts[c] ? parseFloat((sums[c]/counts[c]).toFixed(2)) : 0;
    return avg;
  }, [reviews]);

  // Legacy fetch & event bus removed; React Query handles cache & updates.

  const handleOpenReview = () => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async (formData: { username?: string; rating: number; comment: string; images?: string[]; rating_breakdown?: any }) => {
    if (!restaurant) return;
    try {
      await addReview({
        restaurant: restaurant.name,
        rating: formData.rating,
        comment: formData.comment,
        images: formData.images || [],
        rating_breakdown: formData.rating_breakdown,
        username: formData.username
      });
    } catch (err) {
      console.error('Submit review error:', err);
      alert((err as Error).message || 'Failed to add review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Restaurant not found</div>
      </div>
    );
  }

  const structuredData = restaurant ? {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    image: restaurant.image || undefined,
    servesCuisine: restaurant.cuisine,
    address: restaurant.location,
    aggregateRating: restaurant.totalReviews ? {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating || 0,
      reviewCount: restaurant.totalReviews
    } : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    description: restaurant.description || undefined
  } : null;

  return (
    <div className="min-h-screen bg-black">
      {structuredData && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {/* Header */}
      <div className="relative h-64 md:h-80 overflow-hidden mt-16">
        {restaurant.image ? (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-10 p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
        >
          <FaArrowLeft />
        </motion.button>
      </div>

  {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Restaurant Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {restaurant.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" />
              <span>{restaurant.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUtensils className="text-gray-400" />
              <span>{restaurant.cuisine}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{restaurant.rating || 0}/5</span>
              <span className="text-gray-400">({restaurant.totalReviews || 0} reviews)</span>
            </div>
          </div>

          {restaurant.description && (
            <p className="text-gray-300 leading-relaxed text-lg max-w-3xl mb-6">
              {restaurant.description}
            </p>
          )}

        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Reviews ({reviews.length})
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenReview}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <FaPlus />
              Add Review
            </motion.button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
              <p className="text-gray-400 mb-6">Be the first to share your experience!</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenReview}
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Write First Review
              </motion.button>
            </div>
          ) : (
            <>
              <ReviewList reviews={reviews} />
              {ratingBreakdown && (
                <div className="pt-8">
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setShowBreakdown(v => !v)}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-colors text-left"
                      aria-expanded={showBreakdown}
                      aria-controls="rating-breakdown-panel"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white tracking-wide">Rating Breakdown</div>
                        <div className="text-xs text-gray-400 mt-1">Average category scores (click to {showBreakdown ? 'hide' : 'view'})</div>
                      </div>
                      <FaChevronDown className={`text-gray-300 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {showBreakdown && (
                    <div id="rating-breakdown-panel" className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(ratingBreakdown).map(([k,v]) => (
                        <div key={k} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-sm text-gray-300">
                            <span className="capitalize font-medium">{k}</span>
                            <span className="text-white font-semibold">{v}</span>
                          </div>
                          <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${(v/5)*100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <AddReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleSubmitReview}
        restaurantName={restaurant.name}
      />
    </div>
  );
}
