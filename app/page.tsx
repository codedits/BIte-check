"use client";
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaStar, FaMapMarkerAlt, FaUtensils, FaQuoteLeft, FaUsers, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useAuth } from '@/contexts/AuthContext';
import HomeSkeleton from '@/components/HomeSkeleton';
import CloudImage from '@/components/CloudImage';
import { normalizeImageSrc } from '@/lib/normalizeImageSrc';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const { restaurants, loading } = useRestaurants();
  const { isAuthenticated } = useAuth();

  const navigateToExplore = useCallback(() => router.push('/explore'), [router]);
  const navigateToSignup = useCallback(() => router.push('/auth/signup'), [router]);

  const featured = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];
    return [...restaurants]
      .sort((a, b) => (b.rating - a.rating) || (b.totalReviews - a.totalReviews))
      .slice(0, 6);
  }, [restaurants]);

  const topPick = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return null;
    return [...restaurants]
      .sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews)
      .at(0) ?? null;
  }, [restaurants]);

  const stats = [
    { icon: FaUtensils, value: restaurants?.length || 0, label: 'Restaurants' },
    { icon: FaStar, value: '1000+', label: 'Reviews' },
    { icon: FaUsers, value: '500+', label: 'Food Lovers' },
    { icon: FaTrophy, value: '4.8', label: 'Avg Rating' },
  ];

  const features = [
    {
      icon: FaCheckCircle,
      title: 'Verified Reviews',
      description: 'Only authentic experiences from real diners, no fake reviews allowed.'
    },
    {
      icon: FaStar,
      title: 'Top Rated',
      description: 'Curated collection of the highest-rated restaurants in your area.'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Find Nearby',
      description: 'Discover amazing restaurants close to you with location-based search.'
    },
    {
      icon: FaUsers,
      title: 'Community Driven',
      description: 'Join a passionate community of food enthusiasts sharing experiences.'
    },
  ];

  if (loading) return <HomeSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section - Clean & Professional */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-orange-400">Trusted by food enthusiasts</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
              <span className="block text-white">
                Discover Your Next
              </span>
              <span className="block text-orange-500">
                Favorite Restaurant
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
              Authentic reviews from real diners. Find exceptional restaurants and share your experiences with a community that values quality.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={navigateToExplore}
                className="group inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-xl"
              >
                Explore Restaurants
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </button>
              
              {!isAuthenticated && (
                <button
                  onClick={navigateToSignup}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-transparent"
                >
                  Join Free
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-transparent p-6 text-center"
              >
                <stat.icon className="mx-auto text-orange-500 text-2xl mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Featured Top Pick */}
          {topPick && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20"
            >
              <button
                onClick={() => router.push(`/restaurant/${topPick._id}`)}
                className="group relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-transparent transition-all hover:border-orange-500/30 hover:shadow-xl"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-80 md:h-auto overflow-hidden">
                    {(() => {
                      const src = normalizeImageSrc(topPick.image);
                      if (!src) {
                        return (
                          <div className="h-full flex items-center justify-center bg-transparent">
                            <FaUtensils className="text-white/20 text-6xl" />
                          </div>
                        );
                      }
                      return (
                        <CloudImage
                          src={src}
                          alt={topPick.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          width={800}
                          height={600}
                          fillCrop
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/60" />
                    
                    {/* Top Pick Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 shadow-lg">
                      <FaTrophy className="text-white text-sm" />
                      <span className="text-sm font-semibold text-white">Top Rated</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-8 md:p-12 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2">
                        <FaStar className="text-orange-500 text-sm" />
                        <span className="text-white font-bold">{topPick.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-white/50">{topPick.totalReviews} reviews</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors">
                      {topPick.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-orange-500 font-medium">{topPick.cuisine}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/60 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-xs" />
                        {topPick.location}
                      </span>
                    </div>

                    {topPick.description && (
                      <p className="text-white/70 leading-relaxed mb-6 line-clamp-2">
                        {topPick.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-orange-500 font-medium">
                      <span>View Details</span>
                      <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-sm uppercase tracking-wider text-orange-500 font-semibold mb-3">Why Choose BiteCheck</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white">Everything You Need</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="rounded-xl border border-white/10 bg-transparent p-6 transition-all hover:border-orange-500/30">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500/10 mb-4">
                    <feature.icon className="text-orange-500 text-xl" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants Grid */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-sm uppercase tracking-wider text-orange-500 font-semibold mb-2">Featured</h2>
                <p className="text-3xl sm:text-4xl font-bold text-white">Top Restaurants</p>
              </div>
              <button
                onClick={() => navigateToExplore()}
                className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
              >
                <span>View All</span>
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((restaurant, idx) => {
              const src = normalizeImageSrc(restaurant.image);
              return (
                <motion.button
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onClick={() => router.push(`/restaurant/${restaurant._id}`)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-transparent text-left transition-all hover:border-orange-500/30 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {src ? (
                      <CloudImage
                        src={src}
                        alt={restaurant.name}
                        width={500}
                        height={350}
                        fillCrop
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-transparent">
                        <FaUtensils className="text-white/20 text-4xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1.5">
                      <FaStar className="text-orange-500 text-xs" />
                      <span className="text-white font-semibold text-sm">{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {restaurant.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <span className="text-orange-500 font-medium">{restaurant.cuisine}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-white/50 line-clamp-1">{restaurant.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/40">
                      <span>{restaurant.totalReviews || 0} reviews</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {featured.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-transparent border border-white/10 mb-6">
                <FaUtensils className="text-orange-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No restaurants yet</h3>
              <p className="text-white/60 mb-6">Be the first to share an amazing dining experience</p>
              <button
                onClick={() => router.push(isAuthenticated ? '/profile' : '/auth/signup')}
                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600"
              >
                {isAuthenticated ? 'Add Restaurant' : 'Get Started'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="rounded-2xl border border-white/10 bg-transparent p-10 md:p-12">
              <FaQuoteLeft className="mx-auto text-orange-500/30 text-4xl mb-6" />
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-8 leading-relaxed">
                "The most authentic restaurant reviews I've found. No fluff, just real experiences from real food lovers."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">SC</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Sarah Chen</p>
                  <p className="text-white/50 text-sm">Food Enthusiast</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/5 p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to discover your next favorite spot?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join our community of food lovers and start exploring exceptional dining experiences today.
            </p>
            <button
              onClick={() => router.push(isAuthenticated ? '/explore' : '/auth/signup')}
              className="rounded-lg bg-orange-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-xl"
            >
              {isAuthenticated ? 'Start Exploring' : 'Get Started Free'}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
