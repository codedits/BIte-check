 'use client';

import PageSkeleton from '@/components/PageSkeleton';

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
  const [mode, setMode] = useState<'all' | 'nearest'>('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    // Default: filter by search
    let base = restaurants ?? [];
    if (searchQuery) {
      base = base.filter((restaurant: Restaurant) =>
        (restaurant.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (mode === 'nearest' && userCoords && base.length) {
      const withCoords = base.filter(r => typeof r.latitude === 'number' && typeof r.longitude === 'number');
      if (withCoords.length) {
        // Sort by distance and show the nearest one only
        const sorted = withCoords
          .map(r => ({ r, d: haversineKm(userCoords.lat, userCoords.lng, r.latitude as number, r.longitude as number) }))
          .sort((a, b) => a.d - b.d)
          .map(x => x.r);
        setFilteredRestaurants([sorted[0]]);
      } else {
        // No coordinates available in data
        setFilteredRestaurants([]);
      }
    } else {
      setFilteredRestaurants(base);
    }
  }, [restaurants, searchQuery, mode, userCoords]);

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
  const handleFindNearby = () => {
    setGeoError(null);
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported in this browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setMode('nearest');
      },
      (err) => {
        setIsLocating(false);
        setGeoError(err?.message || 'Unable to fetch location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleResetView = () => {
    setMode('all');
    setGeoError(null);
  };

  return (
    <div className="relative min-h-screen bg-black pt-20 pb-16 px-4 sm:px-6">
      {/* Subtle Background - Same as Homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 text-center"
        >
          <h1 className="mb-3 text-4xl font-semibold text-white sm:text-5xl">
            Explore
          </h1>
          <p className="text-sm text-white/60">
            Discover exceptional dining experiences
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="mb-10"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                aria-label="Search restaurants"
                className="w-full rounded-full border border-white/10 bg-transparent py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/20"
                placeholder="Search by name or cuisine..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFindNearby}
                disabled={isLocating}
                className="rounded-full border border-white/20 bg-transparent px-5 py-2 text-sm font-medium text-white/90 transition hover:bg-transparent disabled:opacity-50"
              >
                {isLocating ? 'Locating…' : 'Near me'}
              </motion.button>
              {mode === 'nearest' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetView}
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Show all
                </motion.button>
              )}
            </div>
            {geoError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm text-red-400"
              >
                {geoError}
              </motion.div>
            )}
            {mode === 'nearest' && userCoords && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-center text-xs text-white/60"
              >
                Showing nearest restaurant
              </motion.div>
            )}
          </div>
        </motion.div>
      {/* Loading Skeletons */}
      {loading && (
        <div className="mt-4">
          <PageSkeleton variant="explore" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-transparent px-8 py-20 text-center backdrop-blur-xl"
        >
          <div className="mb-3 text-xl text-red-400">Error loading restaurants</div>
          <div className="mb-6 text-sm text-white/60">{error}</div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.refresh()}
            className="rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-white/90"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      

        {/* Restaurant Grid */}
        {!loading && !error && filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRestaurants.map((restaurant: Restaurant, index) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <SimpleRestaurantCard
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant._id)}
                  priority={index < 4}
                />
              </motion.div>
            ))}
          </div>
        ) : !loading && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-transparent px-8 py-20 text-center backdrop-blur-xl"
          >
            <div className="mb-3 text-xl text-white/80">No restaurants found</div>
            <div className="mb-6 text-sm text-white/60">
              {(restaurants ?? []).length === 0 ? (
                "No restaurants have been added yet. Be the first!"
              ) : (
                mode === 'nearest' 
                  ? "No restaurants with coordinates found. Try 'Show all'." 
                  : "Try adjusting your search"
              )}
            </div>
            {(restaurants ?? []).length === 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/profile')}
                className="rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-white/90"
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
