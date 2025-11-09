'use client';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function WarmRestaurantsCache() {
  const qc = useQueryClient();
  useEffect(() => {
    // Use requestIdleCallback for better performance
    const idle = (cb: () => void) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(cb, { timeout: 2000 });
      } else {
        setTimeout(cb, 100);
      }
    };
    
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
          staleTime: 5 * 60 * 1000,
        });
      }
    });
  }, [qc]);
  return null;
}
