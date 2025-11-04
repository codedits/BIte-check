'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Review } from '@/types';

async function fetchRestaurantReviews(name: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?restaurant=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Failed to fetch restaurant reviews');
  return res.json();
}

async function postRestaurantReview(payload: any) {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit review');
  return data;
}

export function useRestaurantReviews(name?: string) {
  const qc = useQueryClient();
  const queryKey = ['restaurantReviews', name];
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey,
    queryFn: () => fetchRestaurantReviews(name as string),
    enabled: !!name,
    staleTime: 30_000,
  });

  async function deleteRestaurantReviewRequest(id: string): Promise<void> {
    const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete review');
    }
  }

  const mutation = useMutation({
    mutationFn: (payload: any) => postRestaurantReview(payload),
    onMutate: async (payload: any) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<Review[]>(queryKey) || [];
      const optimistic: Review = {
        _id: `temp-${Date.now()}` as any,
        restaurant: payload.restaurant,
        rating: payload.rating,
        comment: payload.comment,
        images: payload.images || [],
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
        userId: (payload.userId || 'me') as any,
        username: payload.username,
        rating_breakdown: payload.rating_breakdown
      } as Review;
      qc.setQueryData<Review[]>(queryKey, [optimistic, ...prev]);
      return { prev };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
    },
    onSuccess: (data) => {
      qc.setQueryData<Review[]>(queryKey, (old = []) => {
        return [data as Review, ...old.filter(r => !(r._id as any)?.toString().startsWith('temp-'))];
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRestaurantReviewRequest(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<Review[]>(queryKey) || [];
      qc.setQueryData<Review[]>(queryKey, prev.filter(r => r._id !== id));
      return { prev };
    },
    onError: (_err, _id, ctx: { prev?: Review[] } | undefined) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    }
  });

  return {
    reviews: data || [],
    loading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    addReview: (payload: any) => mutation.mutateAsync(payload)
  , deleteReview: (id: string) => deleteMutation.mutateAsync(id)
  };
}
