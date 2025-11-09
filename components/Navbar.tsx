'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setMobileOpen(false);
  }, [logout]);

  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileOpen(open => !open), []);

  const renderLink = useCallback((href: string, label: string, isMobile = false) => {
    const isActive = pathname === href;
    const baseClasses = isMobile
      ? 'flex items-center w-full text-left text-base'
      : 'text-sm font-medium';
    return (
      <Link
        key={href}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        onClick={closeMobileMenu}
        className={`${baseClasses} rounded-lg px-4 py-2 transition-all ${
          isActive 
            ? 'bg-orange-500 text-white' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        {label}
      </Link>
    );
  }, [pathname, closeMobileMenu]);

  return (
    <motion.nav
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled 
          ? 'border-white/10 bg-black/90 backdrop-blur-xl shadow-lg' 
          : 'border-white/5 bg-black/70 backdrop-blur-lg'
      }`}
      role="navigation"
      aria-label="Primary"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-white">
            Bite<span className="text-orange-500">Check</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => renderLink(link.href, link.label))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt={user?.username || 'User'} 
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-orange-500/20"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm text-white/70">
                  {user?.username || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-600"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-black/95 md:hidden overflow-hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-white">
              <div className="flex flex-col gap-2">
                {links.map((link) => renderLink(link.href, link.label, true))}
              </div>
              <div className="h-px bg-white/10" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {user?.image ? (
                      <img 
                        src={user.image} 
                        alt={user?.username || 'User'} 
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-orange-500/20"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-white">{user?.username || 'Anonymous'}</p>
                      <p className="text-xs text-white/60">Signed in</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-left font-medium text-white hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/signin"
                    onClick={closeMobileMenu}
                    className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={closeMobileMenu}
                    className="rounded-lg bg-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
