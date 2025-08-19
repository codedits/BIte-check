'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { eventBus, EVENTS } from '@/lib/eventBus';

export function useReviews(userId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const url = userId ? `/api/reviews?userId=${userId}` : '/api/reviews';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const addReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews?id=${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }

      // Remove the review from the local state
      setReviews(prev => prev.filter(review => review._id !== reviewId));
      
      // Emit events to refresh other components
      eventBus.emit(EVENTS.REVIEW_DELETED);
      eventBus.emit(EVENTS.DATA_REFRESH);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting review:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    addReview,
    deleteReview
  };
}
