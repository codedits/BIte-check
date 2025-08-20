'use client';

import { useQuery } from '@tanstack/react-query';
import { Restaurant } from '@/types';

async function fetchRestaurant(id: string): Promise<Restaurant | null> {
  const res = await fetch(`/api/restaurants?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch restaurant');
  return res.json();
}

export function useRestaurant(id?: string) {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => fetchRestaurant(id as string),
    enabled: !!id,
    staleTime: 60_000,
  });
  return {
    restaurant: data || null,
    loading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
