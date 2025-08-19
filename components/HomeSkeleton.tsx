"use client";

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white animate-pulse">
      <main className="relative z-10 pb-24 space-y-10">
        {/* Hero skeleton */}
        <section className="w-full mt-12 px-6">
          <div className="mx-auto max-w-6xl rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 h-56 sm:h-72 md:h-96" />
        </section>

        {/* About / intro skeleton */}
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

        {/* CTA skeleton for unauthenticated users */}
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

      {/* Top Restaurants horizontal skeleton */}
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

      {/* Grid skeleton */}
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
