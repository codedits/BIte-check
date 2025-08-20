'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review } from '@/types';

async function fetchReviews(userId?: string): Promise<Review[]> {
  const url = userId ? `/api/reviews?userId=${userId}` : '/api/reviews';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

async function deleteReviewRequest(id: string): Promise<void> {
  const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete review');
  }
}

async function editReviewRequest(payload: { id: string; rating?: number; comment?: string; images?: string[]; rating_breakdown?: any }): Promise<Review> {
  const res = await fetch('/api/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to edit review');
  }
  return data.review as Review;
}

export function useReviews(userId?: string) {
  const qc = useQueryClient();
  const queryKey = ['reviews', userId || 'all'];
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () => fetchReviews(userId),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReviewRequest(id),
  onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<Review[]>(queryKey) || [];
  qc.setQueryData<Review[]>(queryKey, prev.filter((r: Review) => r._id !== id));
      return { prev };
    },
  onError: (_err: unknown, _id: string, ctx: { prev?: Review[] } | undefined) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    }
  });

  const editMutation = useMutation({
    mutationFn: (payload: { id: string; rating?: number; comment?: string; images?: string[]; rating_breakdown?: any }) => editReviewRequest(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<Review[]>(queryKey) || [];
      qc.setQueryData<Review[]>(queryKey, prev.map(r => r._id === payload.id ? { ...r, ...payload, rating_breakdown: payload.rating_breakdown ? payload.rating_breakdown : r.rating_breakdown } as any : r));
      return { prev };
    },
    onError: (_err, _payload, ctx: { prev?: Review[] } | undefined) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    }
  });

  const addReview = (review: Review | any) => {
    qc.setQueryData<Review[]>(queryKey, (old = []) => [review as Review, ...old]);
  };

  return {
    reviews: data || [],
    loading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    refetch,
    addReview,
    deleteReview: (id: string) => deleteMutation.mutateAsync(id)
  , editReview: (payload: { id: string; rating?: number; comment?: string; images?: string[]; rating_breakdown?: any }) => editMutation.mutateAsync(payload)
  };
}
