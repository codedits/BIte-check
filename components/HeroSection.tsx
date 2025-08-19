"use client";
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { Restaurant } from '@/types';

interface HeroSectionProps {
  restaurants: Restaurant[] | null;
  loading: boolean;
  onSelect?: (id: string) => void;
  variant?: 'default' | 'banner'; // banner = flush, shorter height, no border/rounding
}

export default function HeroSection({ restaurants, loading, onSelect, variant = 'default' }: HeroSectionProps) {
  // Simplified image rendering: use plain <img> for external hosts to avoid Next.js optimizer errors in dev
  const SmartImage = ({ src, alt }: { src: string; alt: string }) => {
    if (!src) return <div className="w-full h-full bg-neutral-900" />;
    const normalized = src.trim().startsWith('http') ? src.trim() : `https://${src.trim()}`;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={normalized} alt={alt} className="w-full h-full object-cover" loading="eager" />
    );
  };
  const heroItems = useMemo(() => {
    if (!restaurants) return [] as Restaurant[];
    const featured = restaurants.filter(r => r.featured);
    const base = (featured.length > 0 ? featured : restaurants);
    return [...base]
      .sort((a, b) => (b.featured === a.featured ? (b.rating - a.rating || b.totalReviews - a.totalReviews) : (b.featured ? 1 : -1)))
      .slice(0, 5);
  }, [restaurants]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (!loading) setInternalLoading(false);
  }, [loading]);

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % heroItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const current = heroItems[currentIndex];

  if (internalLoading) {
    return (
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[66vh] lg:aspect-[16/9] lg:h-auto">
          <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">Loading featured...</div>
        </div>
      </motion.section>
    );
  }

  if (!current) {
    return (
      <section className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141414] to-[#1f1f1f] h-[400px] flex items-center">
        <div className="px-8 md:px-14 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-[linear-gradient(90deg,#fff,#ffcf8a)]">BiteCheck</h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
            Discover and track the most talked‑about dining spots. BiteCheck curates authentic community insights so you always know where to eat next.
          </p>
        </div>
      </section>
    );
  }

  const isBanner = variant === 'banner';
  const containerClasses = isBanner
    ? 'relative overflow-hidden group w-full mb-4'
    : 'relative mb-10 overflow-hidden rounded-2xl border border-white/10 group';
  const heightClasses = isBanner
    ? 'h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px]'
    : 'h-[50vh] sm:h-[60vh] md:h-[66vh] lg:aspect-[16/9] lg:h-auto';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={containerClasses}
    >
      <div className={`relative ${heightClasses} ${isBanner ? '' : 'px-4 sm:px-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id + currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {(() => {
              const raw = current.image?.trim();
              const valid = raw && raw.length > 5;
              if (!valid) {
                return <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-white/30 text-sm">No Image</div>;
              }
              return <SmartImage src={raw!} alt={current.name} />;
            })()}
          </motion.div>
        </AnimatePresence>
        <div className={isBanner ? 'absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent' : 'absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent'} />
      </div>
      <div className="absolute inset-0 flex items-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id + 'content' + currentIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`${isBanner ? 'p-4 sm:p-8 md:p-10 max-w-2xl' : 'p-4 sm:p-6 md:p-10 max-w-full sm:max-w-2xl lg:max-w-3xl px-4 sm:px-6 md:px-10'}`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`${isBanner ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'} font-extrabold tracking-tight leading-tight text-white heading-glow`}
            >
              {current.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              className="mt-4 inline-flex items-center gap-2 bg-white/6 rounded-full px-3 py-1 text-xs sm:text-sm font-medium border border-white/10"
            >
              <span className="text-yellow-400">★</span>
              <span className="text-white">{current.rating.toFixed(1)}</span>
              <span className="text-white/70">• {current.cuisine}</span>
              <span className="text-white/50">{current.priceRange}</span>
            </motion.div>
            {current.description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                className={`mt-5 text-white/90 leading-relaxed ${isBanner ? 'text-sm md:text-base line-clamp-2 md:line-clamp-3 max-w-xl' : 'line-clamp-3 sm:line-clamp-4 text-sm sm:text-base max-w-2xl'}`}
              >
                {current.description}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect?.(current._id)}
                className="inline-flex items-center gap-2 rounded-md bg-orange-600/90 text-white px-4 py-2 text-sm font-medium hover:bg-orange-500 transition-colors duration-150"
              >
                <FaPlay className="text-sm" />
                <span className="ml-1">View Details</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      {heroItems.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-2">
          {heroItems.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white' : 'bg-white/35'}`}
              initial={{ scale: 0.8 }}
              animate={{
                scale: i === currentIndex ? 1.2 : 0.8,
                opacity: i === currentIndex ? 1 : 0.55,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
