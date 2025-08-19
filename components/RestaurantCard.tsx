 'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaUtensils, FaStar, FaHeart } from 'react-icons/fa';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  featured?: boolean;
  compact?: boolean;
}

export default function RestaurantCard({ restaurant, onClick, featured = false, compact = false }: RestaurantCardProps) {
  const [imageSrc, setImageSrc] = useState<string>(restaurant.image || '');

  // If restaurant.image is missing, try to fetch recent reviews and use their images as a quick fallback
  useEffect(() => {
    let mounted = true;
    if (restaurant.image && restaurant.image.length > 3) {
      setImageSrc(restaurant.image);
      return;
    }

    const fetchFallback = async () => {
      try {
        const res = await fetch(`/api/reviews?restaurant=${encodeURIComponent(restaurant.name)}`);
        if (!res.ok) return;
        const reviews = await res.json();
        if (!mounted || !Array.isArray(reviews)) return;
        for (const rev of reviews) {
          if (rev.imageUrl) {
            setImageSrc(rev.imageUrl);
            return;
          }
          if (Array.isArray(rev.images) && rev.images.length) {
            setImageSrc(rev.images[0]);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
    };

    fetchFallback();

    return () => { mounted = false; };
  }, [restaurant.name, restaurant.image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={compact ? { y: -2 } : { y: -4, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative cursor-pointer group overflow-hidden transition-all duration-300 ${compact ? 'rounded-lg shadow-sm bg-white/3 border border-white/5' : (featured ? 'rounded-xl shadow-lg gradient-card border border-orange-500/30' : 'rounded-xl shadow-lg elegant-card hover:border-orange-500/20')}`}
      onClick={onClick}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg">
            ⭐ Featured
          </div>
        </div>
      )}

  {/* Image Section */}
  <div className={compact ? 'relative h-36 overflow-hidden' : 'relative h-56 overflow-hidden'}>
        {(() => {
          const raw = (imageSrc || '').trim();
          if (!raw || raw.length < 5) {
            return <div className="absolute inset-0 bg-gradient-to-br from-orange-800/40 via-black to-black flex items-center justify-center text-white/30 text-xs tracking-wide">No Image</div>;
          }
          let src = raw;
          if (!/^https?:\/\//i.test(src)) src = `https://${src}`;
          return (
            <Image
              src={src}
              alt={restaurant.name}
              fill
              priority={featured}
              sizes={compact ? '(max-width:640px) 50vw, 200px' : '(max-width:768px) 100vw, (max-width:1200px) 50vw, 400px'}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          );
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        {!compact && (
          <>
            {/* Price Range Badge */}
            <div className="absolute top-6 right-6">
              <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/20 shadow-lg">
                {restaurant.priceRange}
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-xl px-3 py-1 rounded-full border border-orange-500/30 shadow-md">
                <FaStar className="text-orange-400 text-xs" />
                <span className="text-white font-semibold text-xs">{restaurant.rating}</span>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30"
                >
                  <FaHeart className="text-white text-sm" />
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className={compact ? 'p-3 space-y-2' : 'p-4 space-y-3'}>
        <div>
          <h3 className={compact ? 'text-sm font-semibold text-white mb-1' : 'text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300'}>
            {restaurant.name}
          </h3>
          {!compact && (
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
              {restaurant.description}
            </p>
          )}
        </div>
        {compact ? (
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/40 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <div className="text-gray-400 truncate max-w-[120px] text-right">{restaurant.location}</div>
          </div>
        ) : (
          <>
            {/* Info Section */}
            <div className="space-y-2 pt-3 border-t border-gray-700/50">
              <div className="flex items-center gap-2 text-gray-300 text-xs">
                <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <FaUtensils className="text-orange-400 text-xs" />
                </div>
                <span className="font-medium">{restaurant.cuisine}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs">
                <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-orange-400 text-xs" />
                </div>
                <span className="font-medium">{restaurant.location}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="button"
                aria-label={`View details for ${restaurant.name}`}
                className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500 hover:to-red-500 border border-orange-500/30 hover:border-orange-500 rounded-xl py-3 px-6 text-center text-white font-semibold transition-all duration-300 group-hover:shadow-lg focus-visible:outline-none"
              >
                View Details
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
