"use client";

import React from 'react';

interface PageSkeletonProps {
  variant?: 'home' | 'explore' | 'restaurant' | 'profile' | 'grid';
}

export default function PageSkeleton({ variant = 'grid' }: PageSkeletonProps) {
  if (variant === 'home') {
    return (
      <div className="min-h-screen bg-black text-white animate-pulse">
        <main className="relative z-10 pb-24 space-y-10">
          <section className="w-full mt-12 px-6">
            <div className="mx-auto max-w-6xl rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 h-56 sm:h-72 md:h-96" />
          </section>

          <section className="px-6 md:px-10 max-w-5xl mx-auto">
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-700 rounded" />
              <div className="h-4 w-5/6 bg-gray-700 rounded" />
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="h-6 w-24 bg-gray-700 rounded" />
                <div className="h-6 w-28 bg-gray-700 rounded" />
                <div className="h-6 w-32 bg-gray-700 rounded" />
              </div>
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="rounded-3xl overflow-hidden p-6 bg-[#171717] border border-white/10">
              <div className="h-8 w-1/3 bg-gray-700 rounded mb-3" />
              <div className="h-4 w-2/3 bg-gray-700 rounded mb-4" />
              <div className="flex gap-3">
                <div className="h-10 w-28 bg-gray-700 rounded" />
                <div className="h-10 w-20 bg-gray-700 rounded" />
              </div>
            </div>
          </section>
        </main>

        <section className="px-6 md:px-10 mt-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-4">
              <div className="h-6 w-40 bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-700 rounded" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="min-w-[260px] snap-start">
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900" />
                    <div className="p-4">
                      <div className="h-4 w-2/3 bg-gray-700 rounded mb-2" />
                      <div className="h-3 w-1/3 bg-gray-700 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg elegant-card p-4">
                <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md mb-4" />
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-full mb-1" />
                <div className="h-4 bg-gray-700 rounded w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'explore') {
    return (
      <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl shadow-lg elegant-card p-4">
            <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md mb-4" />
            <div className="space-y-3">
              <div className="h-6 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-5/6" />
              <div className="flex items-center gap-2 pt-3 border-t border-gray-700/50">
                <div className="w-6 h-6 bg-gray-700 rounded-full" />
                <div className="h-4 bg-gray-700 rounded w-1/3" />
              </div>
              <div className="pt-4">
                <div className="h-10 bg-gray-700 rounded-xl w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'restaurant') {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="relative h-80 md:h-96 lg:h-[420px] bg-gradient-to-br from-gray-800 to-gray-900" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="h-8 w-3/4 bg-gray-700 rounded mb-3" />
            <div className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-full bg-gray-700 rounded" />
          </div>
          <div className="space-y-6">
            <div className="rounded-xl p-4 bg-white/5 border border-white/10">
              <div className="h-4 w-1/3 bg-gray-700 rounded mb-3" />
              <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md" />
            </div>
            <div className="rounded-xl p-4 bg-white/5 border border-white/10">
              <div className="h-6 w-40 bg-gray-700 rounded mb-2" />
              <div className="h-4 w-full bg-gray-700 rounded mb-1" />
              <div className="h-4 w-5/6 bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className="min-h-screen bg-black animate-pulse flex items-center justify-center">
        <div className="max-w-4xl w-full px-4">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-1/3 bg-gray-700 rounded" />
              <div className="h-4 w-1/4 bg-gray-700 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-white/5 rounded-lg" />
            <div className="h-20 bg-white/5 rounded-lg" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden shadow-lg elegant-card p-4">
          <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md mb-4" />
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-700 rounded w-full mb-1" />
          <div className="h-4 bg-gray-700 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}
