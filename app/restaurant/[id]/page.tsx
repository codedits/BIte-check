"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaMapMarkerAlt, FaUtensils, FaStar, FaPlus, FaPhone, FaClock, FaDollarSign, FaHeart, FaShare } from "react-icons/fa";
import CloudImage from '@/components/CloudImage';
import AddReviewModal from "@/components/AddReviewModal";
import ReviewList from "@/components/ReviewList";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurant } from '@/hooks/useRestaurant';
import { useRestaurantReviews } from '@/hooks/useRestaurantReviews';

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { isAuthenticated } = useAuth();

  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(id);
  const { reviews, loading: reviewsLoading, error: reviewsError, addReview, deleteReview } = useRestaurantReviews(restaurant?.name);
  const loading = restaurantLoading || reviewsLoading;
  const error = restaurantError || reviewsError;
  const [isReviewOpen, setIsReviewOpen] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-black pt-20">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-orange-500 mx-auto"></div>
          <p className="text-sm text-white/60">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-white hover:bg-white/20 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Restaurant not found</h2>
          <p className="text-white/60 mb-6">The restaurant you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/explore')}
            className="rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 text-white font-semibold hover:shadow-lg transition-all"
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Image */}
      <div className="relative h-[60vh] overflow-hidden">
        {restaurant.image ? (
          <CloudImage
            src={restaurant.image}
            alt={restaurant.name}
            className="object-cover w-full h-full"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 via-black to-black flex items-center justify-center">
            <FaUtensils className="text-white/10 text-9xl" />
          </div>
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Top Bar - Back & Actions */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-black/60 transition-all"
            >
              <FaArrowLeft className="text-sm" />
              <span className="font-medium">Back</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <button className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-black/60 transition-all">
                <FaHeart className="text-sm" />
              </button>
              <button className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-black/60 transition-all">
                <FaShare className="text-sm" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Rating Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full px-4 py-2 mb-4 shadow-xl">
                <FaStar className="text-white text-sm" />
                <span className="text-white font-bold text-lg">{restaurant.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-white/80 text-sm">({restaurant.totalReviews || 0})</span>
              </div>

              {/* Restaurant Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                {restaurant.name}
              </h1>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <FaUtensils className="text-orange-400 text-xs" />
                  <span className="font-medium">{restaurant.cuisine}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <FaMapMarkerAlt className="text-orange-400 text-xs" />
                  <span className="font-medium">{restaurant.location}</span>
                </div>
                {restaurant.priceRange && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                    <FaDollarSign className="text-orange-400 text-xs" />
                    <span className="font-medium">{restaurant.priceRange}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {restaurant.description && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  {restaurant.description}
                </p>
              </motion.section>
            )}

            {/* Rating Breakdown */}
            {ratingBreakdown && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white">Rating Breakdown</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(ratingBreakdown).map(([category, score]) => (
                    <div key={category} className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="capitalize font-semibold text-white">{category}</span>
                        <span className="text-orange-500 font-bold text-lg">{score.toFixed(1)}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / 5) * 100}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Reviews Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Reviews ({reviews.length})
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <FaPlus className="text-sm" />
                  Add Review
                </motion.button>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                  <div className="text-7xl mb-4">✍️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">No reviews yet</h3>
                  <p className="text-white/60 mb-8 max-w-md mx-auto">
                    Be the first to share your dining experience at {restaurant.name}!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenReview}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 rounded-xl font-semibold text-white shadow-xl"
                  >
                    Write First Review
                  </motion.button>
                </div>
              ) : (
                <ReviewList
                  reviews={reviews}
                  onDelete={async (id: string) => {
                    if (!confirm('Delete this review? This cannot be undone.')) return;
                    try {
                      await deleteReview(id);
                    } catch (err) {
                      console.error('Delete review failed', err);
                      alert((err as Error).message || 'Failed to delete review');
                    }
                  }}
                />
              )}
            </motion.section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              {/* Quick Stats Card */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 space-y-4">
                <h3 className="font-bold text-white text-lg mb-4">Quick Info</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <FaStar className="text-orange-500 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/50 text-sm">Rating</p>
                      <p className="text-white font-semibold">{restaurant.rating?.toFixed(1) || 'N/A'} / 5.0</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <FaUtensils className="text-orange-500 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/50 text-sm">Cuisine</p>
                      <p className="text-white font-semibold">{restaurant.cuisine}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <FaMapMarkerAlt className="text-orange-500 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/50 text-sm">Location</p>
                      <p className="text-white font-semibold">{restaurant.location}</p>
                    </div>
                  </div>

                  {restaurant.priceRange && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <FaDollarSign className="text-orange-500 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/50 text-sm">Price Range</p>
                        <p className="text-white font-semibold">{restaurant.priceRange}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Card */}
              <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-6 text-center">
                <h3 className="font-bold text-white text-lg mb-2">Share Your Experience</h3>
                <p className="text-white/70 text-sm mb-6">
                  Have you dined here? Let others know what you think!
                </p>
                <button
                  onClick={handleOpenReview}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 rounded-xl font-semibold text-white hover:shadow-xl transition-all"
                >
                  Write a Review
                </button>
              </div>
            </motion.div>
          </div>
        </div>
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
