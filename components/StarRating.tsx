'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md' 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (selectedRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleMouseEnter = (selectedRating: number) => {
    if (!readonly) {
      setHoverRating(selectedRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = readonly 
          ? star <= rating 
          : star <= (hoverRating || rating);
        
        return (
          <button
            key={star}
            type="button"
            className={`transition-all duration-200 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <FaStar
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'text-yellow-400 drop-shadow-lg' 
                  : 'text-gray-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
