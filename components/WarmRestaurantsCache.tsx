'use client';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function WarmRestaurantsCache() {
  const qc = useQueryClient();
  useEffect(() => {
    const idle = (cb: () => void) => (typeof window !== 'undefined' && 'requestIdleCallback' in window ? (window as any).requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 500));
    idle(() => {
      const existing = qc.getQueryData(['restaurants']);
      if (!existing) {
        qc.prefetchQuery({
          queryKey: ['restaurants'],
            queryFn: async () => {
              const res = await fetch('/api/restaurants');
              if (!res.ok) throw new Error('prefetch failed');
              return res.json();
            },
          staleTime: 60_000,
        });
      }
    });
  }, [qc]);
  return null;
}
