'use client';

import { useState } from 'react';
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

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  const renderLink = (href: string, label: string, isMobile = false) => {
    const isActive = pathname === href;
    const baseClasses = isMobile
      ? 'block w-full text-left text-base'
      : 'text-sm font-medium';
    return (
      <Link
        key={href}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => setMobileOpen(false)}
        className={`${baseClasses} rounded-full px-3 py-2 transition-colors ${
          isActive ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl"
      role="navigation"
      aria-label="Primary"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-white">
          BiteCheck
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => renderLink(link.href, link.label))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-white/60">Hi, {user?.username || 'Critic'}</span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-white transition-colors hover:bg-white/20"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-full px-3 py-1 text-sm text-white/70 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                Join BiteCheck
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-black/90 md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-white">
              <div className="flex flex-col gap-2">
                {links.map((link) => renderLink(link.href, link.label, true))}
              </div>
              <div className="h-px bg-white/10" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-3 text-sm text-white/70">
                  <span>Signed in as {user?.username || 'Anonymous'}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-white/10 px-4 py-2 text-left text-white hover:bg-white/15"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-white/10 px-4 py-2 text-center text-sm text-white/80 hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-black"
                  >
                    Join BiteCheck
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
