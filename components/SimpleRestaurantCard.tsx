'use client';
import React, { memo } from 'react';
import CloudImage from '@/components/CloudImage';
import { Restaurant } from '@/types';
import { normalizeImageSrc } from '@/lib/normalizeImageSrc';

interface SimpleRestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  className?: string;
  priority?: boolean; // For above-the-fold images
}

const SimpleRestaurantCard = memo(({ restaurant, onClick, className = '', priority = false }: SimpleRestaurantCardProps) => {
  const normalized = normalizeImageSrc(restaurant.image);
  const hasImage = Boolean(normalized);

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasImage ? (
          <>
            <CloudImage
              src={normalized}
              alt={restaurant.name}
              width={640}
              height={480}
              fillCrop
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
            <span className="text-xs tracking-widest text-white/20">NO IMAGE</span>
          </div>
        )}
        {restaurant.rating && (
          <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 backdrop-blur-sm">
            <span className="text-sm font-semibold text-white">
              {restaurant.rating?.toFixed?.(1) ?? restaurant.rating}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-white">
          {restaurant.name}
        </h3>
        <p className="line-clamp-1 text-xs uppercase tracking-wider text-white/50">
          {restaurant.cuisine}
        </p>
        {restaurant.location && (
          <p className="mt-1 line-clamp-1 text-xs text-white/40">
            {restaurant.location}
          </p>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimize re-renders
  return (
    prevProps.restaurant._id === nextProps.restaurant._id &&
    prevProps.restaurant.image === nextProps.restaurant.image &&
    prevProps.restaurant.rating === nextProps.restaurant.rating &&
    prevProps.className === nextProps.className
  );
});

SimpleRestaurantCard.displayName = 'SimpleRestaurantCard';

export default SimpleRestaurantCard;
