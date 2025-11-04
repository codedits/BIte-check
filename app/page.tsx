"use client";
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useAuth } from '@/contexts/AuthContext';
import HomeSkeleton from '@/components/HomeSkeleton';
import CloudImage from '@/components/CloudImage';
import { normalizeImageSrc } from '@/lib/normalizeImageSrc';

export default function HomePage() {
  const router = useRouter();
  const { restaurants, loading } = useRestaurants();
  const { isAuthenticated } = useAuth();

  const highlight = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return null;
    return [...restaurants]
      .sort((a, b) => (b.featured === a.featured ? b.rating - a.rating || b.totalReviews - a.totalReviews : b.featured ? 1 : -1))
      .at(0) ?? null;
  }, [restaurants]);

  const featured = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];
    return [...restaurants]
      .sort((a, b) => (b.rating - a.rating) || (b.totalReviews - a.totalReviews))
      .slice(0, 6);
  }, [restaurants]);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <section className="grid gap-10 md:grid-cols-5 md:items-center">
          <div className="md:col-span-3">
            <span className="text-xs uppercase tracking-[0.45em] text-white/50">Curated dining guide</span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-[3.5rem] md:leading-[1.05]">
              Eat with intention, guided by people who care about great food.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">
              BiteCheck keeps things simple: honest reviews, real photos, and a clean interface so you can find your next favourite table without the noise.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => router.push('/explore')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                Explore spots
                <FaArrowRight className="text-xs" />
              </button>
              <button
                onClick={() => router.push(isAuthenticated ? '/profile' : '/auth/signup')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
              >
                <FaPlus className="text-xs" />
                {isAuthenticated ? 'Share a review' : 'Join the critics'}
              </button>
            </div>
            <ul className="mt-10 flex flex-wrap items-center gap-2 text-xs text-white/50">
              {['Independent voices', 'Photo-first listings', 'Minimal UI', 'Fast updates'].map((tag) => (
                <li key={tag} className="rounded-full border border-white/10 px-4 py-2">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <span className="text-xs uppercase tracking-[0.4em] text-white/50">Spotlight</span>
              {highlight ? (
                <div>
                  <div className="relative overflow-hidden rounded-2xl border border-white/10">
                    {(() => {
                      const src = normalizeImageSrc(highlight.image);
                      if (!src) {
                        return (
                          <div className="flex h-48 items-center justify-center bg-white/10 text-xs uppercase tracking-[0.3em] text-white/40">
                            No Image
                          </div>
                        );
                      }
                      return (
                        <CloudImage
                          src={src}
                          alt={highlight.name}
                          width={640}
                          height={480}
                          fillCrop
                          className="h-56 w-full object-cover sm:h-64"
                          loading="eager"
                        />
                      );
                    })()}
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{highlight.name}</h2>
                      <p className="text-sm text-white/60">{highlight.cuisine} • {highlight.location}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white">{Number(highlight.rating ?? 0).toFixed(1)} ★</span>
                      <span>{highlight.totalReviews ?? 0} reviews</span>
                    </div>
                    <button
                      onClick={() => router.push(`/restaurant/${highlight._id}`)}
                      className="text-sm text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-white"
                    >
                      View details
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-56 flex-col items-start justify-between">
                  <p className="text-sm text-white/60">
                    Add your first restaurant review to unlock personalised spotlights.
                  </p>
                  <button
                    onClick={() => router.push('/auth/signup')}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                  >
                    Get started
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm uppercase tracking-[0.4em] text-white/50">Featured spots</h2>
              <p className="mt-3 text-2xl font-semibold text-white">A shortlist from the community</p>
            </div>
            <button
              onClick={() => router.push('/explore')}
              className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              See all
              <FaArrowRight className="text-xs" />
            </button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((restaurant) => {
              const src = normalizeImageSrc(restaurant.image);
              return (
                <button
                  key={restaurant._id}
                  onClick={() => router.push(`/restaurant/${restaurant._id}`)}
                  className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 hover:bg-white/10"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/5">
                    {src ? (
                      <CloudImage
                        src={src}
                        alt={restaurant.name}
                        width={560}
                        height={420}
                        fillCrop
                        className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-white/10 text-xs uppercase tracking-[0.3em] text-white/40">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{restaurant.name}</h3>
                      <p className="text-sm text-white/60">{restaurant.cuisine} • {restaurant.location}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{Number(restaurant.rating ?? 0).toFixed(1)}</span>
                  </div>
                </button>
              );
            })}
            {featured.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                No restaurants yet. Be the first to share a recommendation.
              </div>
            )}
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-sm uppercase tracking-[0.4em] text-white/50">Why BiteCheck works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[{
              title: 'Signal over noise',
              description: 'Ratings surface the spots locals actually return to, so you skip the endless scrolling.',
            }, {
              title: 'Photos you can trust',
              description: 'Every review highlights real dishes so you know exactly what will show up at the table.',
            }, {
              title: 'Thoughtful minimalism',
              description: 'A calm interface keeps attention on the restaurants—not on ads, popups, or clutter.',
            }].map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold text-white">Join the critics</h3>
            <p className="mt-3 text-sm text-white/70">Share the places you love and build a trusted list friends can follow.</p>
            <button
              onClick={() => router.push(isAuthenticated ? '/profile' : '/auth/signup')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Start contributing
              <FaPlus className="text-xs" />
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold text-white">Explore without friction</h3>
            <p className="mt-3 text-sm text-white/70">Use filters sparingly, swipe through photos, and decide where to eat in minutes.</p>
            <button
              onClick={() => router.push('/explore')}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-white/80 transition hover:text-white"
            >
              Browse the map
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
