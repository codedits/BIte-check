'use client';

import { useState, useEffect } from 'react';
import { Restaurant } from '@/types';
import { eventBus, EVENTS } from '@/lib/eventBus';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
  const response = await fetch('/api/restaurants?populateImages=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      
      const data: Restaurant[] = await response.json();
      // Deduplicate by _id in case of multiple refresh emissions
      const unique = Array.from(new Map(data.map((r: Restaurant) => [r._id, r])).values());
      setRestaurants(unique);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchRestaurants();
    };

    eventBus.on(EVENTS.DATA_REFRESH, handleRefresh);
    eventBus.on(EVENTS.RESTAURANT_ADDED, handleRefresh);
    eventBus.on(EVENTS.REVIEW_DELETED, handleRefresh);

    return () => {
      eventBus.off(EVENTS.DATA_REFRESH, handleRefresh);
      eventBus.off(EVENTS.RESTAURANT_ADDED, handleRefresh);
      eventBus.off(EVENTS.REVIEW_DELETED, handleRefresh);
    };
  }, []);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants
  };
}
