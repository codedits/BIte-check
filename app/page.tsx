"use client";
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useAuth } from '@/contexts/AuthContext';
import { FaArrowRight } from 'react-icons/fa';
import HeroSection from '@/components/HeroSection';
import HomeSkeleton from '@/components/HomeSkeleton';

export default function HomePage() {
  const router = useRouter();
  const { restaurants, loading } = useRestaurants();
  const { isAuthenticated } = useAuth();

  // Stats removed for minimalist homepage

  const featured = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return null;
    return [...restaurants].sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews)[0];
  }, [restaurants]);

  // Removed Top Rated and New Arrivals for a minimal homepage

  // Minimal design: no search bar, no cuisine cloud

  if (loading) return <HomeSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white">
  <main className="relative z-10 pb-8 pt-16">
        {/* Hero directly under nav */}
  <section className="w-full mt-0">
          <HeroSection
            restaurants={restaurants}
            loading={loading}
            onSelect={(id) => router.push(`/restaurant/${id}`)}
            variant="banner"
          />
        </section>

  {/* about section intentionally omitted here */}
      </main>
      {/* Top Restaurants - horizontal scroll */}
  <section className="px-4 sm:px-6 md:px-10 mt-0">
        <div className="max-w-6xl">
          <div className="flex items-end justify-between mb-4">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Top Restaurants</h2>
    <button onClick={() => router.push('/explore')} className="text-xs sm:text-sm text-white/70 hover:text-white">View all</button>
          </div>
  <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide sm:scrollbar-thin sm:scrollbar-thumb-gray-700 -mx-1 px-1" aria-label="Top restaurants horizontal list">
            {(restaurants ?? [])
              .slice()
              .sort((a, b) => (b.rating - a.rating) || (b.totalReviews - a.totalReviews))
              .slice(0, 10)
              .map((r) => (
        <div key={r._id} className="w-[240px] sm:w-[280px] md:w-[320px] h-[200px] sm:h-[210px] md:h-[220px] snap-start flex-shrink-0">
                    {/* Lightweight card: image + name + rating */}
                    <div onClick={() => router.push(`/restaurant/${r._id}`)} className="cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-orange-500/30 transition flex flex-col h-full">
                      <div className="h-[140px] relative overflow-hidden flex-shrink-0">
                      {(() => {
                        const src = (r.image || '').trim();
                        if (!src || src.length < 5) {
                          return <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white/30 text-xs tracking-wide">No Image</div>;
                        }
                        try {
                          const url = new URL(src);
                          const final = src;
                          return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={final} alt={r.name} className="w-full h-full object-cover" />
                          );
                        } catch {
                          return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src.startsWith('http') ? src : `https://${src}`} alt={r.name} className="w-full h-full object-cover" />
                          );
                        }
                      })()}
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white line-clamp-1 text-sm sm:text-base">{r.name}</h3>
                        <span className="text-xs sm:text-sm text-yellow-400 font-semibold">{r.rating?.toFixed?.(1) ?? r.rating}</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-white/60 mt-1 line-clamp-1">{r.cuisine} • {r.location}</p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

  {/* Left-aligned About / Intro placed below Top Restaurants */}
  <section aria-labelledby="about-bitecheck" className="px-4 sm:px-6 md:px-10 max-w-5xl mt-8 mb-12 md:mb-16">
        <div>
          <div className="max-w-3xl">
            <h2 id="about-bitecheck" className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight heading-glow mb-3">
              What is <span className="text-orange-400">BiteCheck</span>?
            </h2>
            <p className="text-white/80 leading-relaxed text-xs sm:text-sm md:text-base mb-4">
              BiteCheck is a community‑driven dining guide. Real, photo‑backed reviews surface stand‑out spots while a minimalist interface keeps the focus on food—not clutter. Discover where to eat next with signal over noise.
            </p>
            <ul className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] md:text-xs font-medium">
              <li className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Curated Ratings</li>
              <li className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Authentic Photos</li>
              <li className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Fast Discovery</li>
              <li className="px-3 py-1 rounded-full bg-white/10 border border-white/10 hidden sm:inline">Minimal UI</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

// SectionWithGrid removed
