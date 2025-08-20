'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { FaUser, FaCalendar, FaMapMarkerAlt, FaSignOutAlt, FaPlus, FaTrash, FaStar } from 'react-icons/fa';
import StarRating from '@/components/StarRating';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AddRestaurantModal from '@/components/AddRestaurantModal';

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);

  // Always call the hook (pass undefined safely); the hook should internally no-op if no userId
  const { reviews: userReviews, loading: reviewsLoading, deleteReview } = useReviews(user?.id);

  // Redirect in effect to avoid conditional hook call
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to sign in...</div>
      </div>
    );
  }
  
  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  // Calculate user stats from actual reviews
  const totalReviews = userReviews.length;
  const averageRating = userReviews.length > 0 
    ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
    : 0;

  // Show loading while fetching reviews
  if (reviewsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading reviews...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleAddRestaurant = () => {
    setIsAddRestaurantModalOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(reviewId);
      console.log('Review deleted');
    } catch {
      alert('Failed to delete review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center mb-12 sm:mb-16 py-12 sm:py-16 lg:py-20"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/50 to-black/80 rounded-3xl"></div>
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-6 mb-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                Profile
              </h1>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddRestaurant}
                className="premium-button p-4 rounded-full shadow-2xl"
                title="Add Restaurant & Review"
              >
                <FaPlus className="text-2xl" />
              </motion.button>
            </div>
            <p className="text-xl sm:text-2xl text-gray-200">
              Your culinary journey and restaurant reviews
            </p>
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="elegant-card p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {/* User Details */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-white mb-3">{user.name || user.email || 'Food Enthusiast'}</h2>
              <p className="text-gray-400 mb-6">{user.email}</p>
              
              {/* User Stats */}
              <div className="flex justify-center sm:justify-start gap-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-orange-400">{totalReviews}</div>
                  <div className="text-sm text-gray-400">Reviews</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-orange-400">{averageRating}</div>
                  <div className="text-sm text-gray-400">Avg Rating</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-orange-400">{new Date().getFullYear()}</div>
                  <div className="text-sm text-gray-400">Member Since</div>
                </motion.div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="secondary-button flex items-center gap-3"
              >
                <FaSignOutAlt />
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white">Your Reviews</h3>
            <span className="text-xl text-gray-400">{totalReviews} reviews</span>
          </div>

          {userReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="elegant-card p-12 text-center"
            >
              <div className="text-6xl text-gray-600 mb-6">🍽️</div>
              <h4 className="text-2xl font-bold text-white mb-4">No reviews yet</h4>
              <p className="text-gray-400 mb-8">Start your culinary journey by adding your first restaurant review!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddRestaurant}
                className="premium-button text-lg"
              >
                Add Your First Review
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {userReviews.map((review: any, index: number) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="elegant-card p-6 hover:border-orange-500/30"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{review.restaurantName}</h4>
                      <div className="flex items-center gap-3 mb-3">
                        <StarRating rating={review.rating} />
                        <span className="text-orange-400 font-semibold">{review.rating}/5</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10"
                      title="Delete Review"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add Restaurant Modal */}
        <AddRestaurantModal
          isOpen={isAddRestaurantModalOpen}
          onClose={() => setIsAddRestaurantModalOpen(false)}
        />
      </div>
    </div>
  );
}
