"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaMapMarkerAlt, FaUtensils, FaStar, FaPlus } from "react-icons/fa";
import Image from "next/image";
import AddReviewModal from "@/components/AddReviewModal";
import ReviewList from "@/components/ReviewList";
import { eventBus, EVENTS } from "@/lib/eventBus";
import { useAuth } from "@/contexts/AuthContext";
import { Restaurant, Review } from '@/types';

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { isAuthenticated } = useAuth();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch restaurant
        const resR = await fetch(`/api/restaurants?id=${id}`);
        if (!resR.ok) throw new Error("Failed to load restaurant");
        const rData = await resR.json();
        setRestaurant(rData as Restaurant);

        // Fetch reviews for this restaurant (by name)
        const resRev = await fetch(`/api/reviews?restaurant=${encodeURIComponent((rData as Restaurant).name)}`);
        if (!resRev.ok) throw new Error("Failed to load reviews");
        const revData = await resRev.json();
        setReviews(revData as Review[] || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const handleReviewAdded = () => {
      // Refresh reviews when a new review is added elsewhere
      if (!restaurant) return;
      fetch(`/api/reviews?restaurant=${encodeURIComponent(restaurant.name)}`)
        .then((r) => r.json())
        .then((data) => setReviews(data || []))
        .catch((e) => console.error(e));
    };

    eventBus.on(EVENTS.REVIEW_ADDED, handleReviewAdded);
    return () => {
      eventBus.off(EVENTS.REVIEW_ADDED, handleReviewAdded);
    };
  }, [restaurant]);

  const handleOpenReview = () => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async (formData: { username?: string; rating: number; comment: string; imageUrl?: string; images?: string[] }) => {
    if (!restaurant) return;
    try {
      // Modal already posts review; just refresh and emit
      const updated = await fetch(`/api/reviews?restaurant=${encodeURIComponent(restaurant.name)}`);
      const updatedData = await updated.json();
      setReviews((updatedData as Review[]) || []);
      eventBus.emit(EVENTS.REVIEW_ADDED, { restaurant: restaurant.name });
    } catch (err) {
      console.error('Submit review refresh error:', err);
      alert((err as Error).message || 'Failed to refresh reviews');
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

  return (
    <div className="min-h-screen bg-black">
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
            <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
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
            <ReviewList reviews={reviews} />
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
