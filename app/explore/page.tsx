'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import SimpleRestaurantCard from '@/components/SimpleRestaurantCard';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useRouter } from 'next/navigation';
import { Restaurant } from '@/types';

export default function ExplorePage() {
  const router = useRouter();
  const { restaurants, loading, error } = useRestaurants();
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants ?? []);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  let filtered = restaurants ?? [];

    // Apply search filter only
    if (searchQuery) {
      filtered = filtered.filter((restaurant: Restaurant) =>
        (restaurant.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

  setFilteredRestaurants(filtered);
  }, [restaurants, searchQuery]);

  // Trigger refresh when the page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // The useRestaurants hook will automatically refresh via event bus
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleRestaurantClick = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  // No additional filters; only search is available

  return (
  <div className="min-h-screen pt-16 pb-8 px-3 sm:px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Minimal Header */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 sm:mb-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-orange-400 mb-2 leading-tight">Explore Restaurants</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl md:max-w-3xl mx-auto px-1">Find places to eat using a simple search — minimal UI, fast results.</p>
        </motion.div>

        {/* Search */}
        {/* Compact Search */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-5 sm:mb-6">
          <div className="relative max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto">
            <input
              type="text"
              aria-label="Search restaurants"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-black/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              placeholder="Search restaurants"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm pointer-events-none" />
          </div>
        </motion.div>
      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`}>
              {/* lazy-load a simple skeleton component */}
              <div className="animate-pulse relative overflow-hidden rounded-xl shadow-lg elegant-card p-4">
                <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md mb-4" />
                <div className="space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-5/6" />
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-700/50">
                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                    <div className="h-4 bg-gray-700 rounded w-1/3" />
                  </div>
                  <div className="pt-4">
                    <div className="h-10 bg-gray-700 rounded-xl w-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-12 sm:py-16 lg:py-20"
        >
          <div className="text-red-400 text-xl sm:text-2xl mb-3 sm:mb-4">Error loading restaurants</div>
          <div className="text-gray-500 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">{error}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.refresh()}
            className="glass-button bg-white text-black hover:bg-gray-100 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      

      {/* Restaurant Grid */}
      {!loading && !error && filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {filteredRestaurants.map((restaurant: Restaurant, index) => (
            <motion.div
              key={restaurant._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="flex"
            >
              <SimpleRestaurantCard
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant._id)}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>
      ) : !loading && !error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-12 sm:py-16 lg:py-20"
        >
          <div className="text-gray-400 text-xl sm:text-2xl mb-3 sm:mb-4">No restaurants found</div>
          <div className="text-gray-500 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
            {(restaurants ?? []).length === 0 ? (
              "No restaurants have been added yet. Be the first to add a restaurant!"
            ) : (
              "Try adjusting your search terms or filters"
            )}
          </div>
            {(restaurants ?? []).length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/profile')}
              className="glass-button bg-white text-black hover:bg-gray-100 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg"
            >
              Add First Restaurant
            </motion.button>
          )}
        </motion.div>
      ) : null}

        
      </div>
    </div>
  );
}
