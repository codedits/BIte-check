'use client';
import React from 'react';
import CloudImage from '@/components/CloudImage';
import { Restaurant } from '@/types';

interface SimpleRestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  className?: string; // optional wrapper width classes
}

export default function SimpleRestaurantCard({ restaurant, onClick, className = '' }: SimpleRestaurantCardProps) {
  const srcRaw = (restaurant.image || '').trim();
  const hasImage = srcRaw && srcRaw.length > 5;
  const abs = hasImage ? (srcRaw.startsWith('http') ? srcRaw : `https://${srcRaw}`) : '';

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-orange-500/30 transition flex flex-col h-full ${className}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
        {hasImage ? (
          <CloudImage
            src={abs}
            alt={restaurant.name}
            width={640}
            height={360}
            fillCrop
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white/30 text-xs tracking-wide">No Image</div>
        )}
      </div>
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white line-clamp-1 text-sm sm:text-base">{restaurant.name}</h3>
          <span className="text-xs sm:text-sm text-yellow-400 font-semibold">{restaurant.rating?.toFixed?.(1) ?? restaurant.rating}</span>
        </div>
        <p className="text-[11px] sm:text-xs text-white/60 mt-1 line-clamp-1">{restaurant.cuisine} • {restaurant.location}</p>
      </div>
    </div>
  );
}
