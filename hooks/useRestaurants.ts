'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Restaurant } from '@/types';

async function fetchRestaurantsRequest(): Promise<Restaurant[]> {
  const res = await fetch('/api/restaurants?populateImages=true');
  if (!res.ok) throw new Error('Failed to fetch restaurants');
  const data: Restaurant[] = await res.json();
  // Deduplicate by _id
  return Array.from(new Map(data.map(r => [r._id, r])).values());
}

export function useRestaurants() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurantsRequest,
    staleTime: 60_000,
  });

  return {
    restaurants: data || null,
    loading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    refetch: () => refetch(),
    invalidate: () => queryClient.invalidateQueries({ queryKey: ['restaurants'] })
  };
}
