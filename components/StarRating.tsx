'use client';

import { useState, memo, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = memo(({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md' 
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = useCallback((selectedRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  }, [readonly, onRatingChange]);

  const handleMouseEnter = useCallback((selectedRating: number) => {
    if (!readonly) {
      setHoverRating(selectedRating);
    }
  }, [readonly]);

  const handleMouseLeave = useCallback(() => {
    if (!readonly) {
      setHoverRating(0);
    }
  }, [readonly]);

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
}, (prevProps, nextProps) => {
  return (
    prevProps.rating === nextProps.rating &&
    prevProps.readonly === nextProps.readonly &&
    prevProps.size === nextProps.size
  );
});

StarRating.displayName = 'StarRating';

export default StarRating;
