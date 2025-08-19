'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaCompass, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', icon: FaHome, label: 'Home' },
    { href: '/explore', icon: FaCompass, label: 'Explore' },
    { href: '/profile', icon: FaUser, label: 'Profile' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35 }}
    className="relative z-10 bg-black/70 backdrop-blur-md border-b border-white/5"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
                <FaHome className="text-white text-lg" />
              </div>
              <Link href="/" className="text-lg md:text-xl font-semibold text-orange-400">
                BiteCheck
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - auth actions / mobile toggles */}
          <div className="flex items-center gap-3">
            {/* Auth (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300 text-sm">Welcome, {user?.username}</span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-md bg-red-600 text-white text-sm"
                    title="Sign Out"
                  >
                    <FaSignOutAlt />
                  </motion.button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-sm">
                    <motion.button whileHover={{ scale: 1.03 }} className="px-3 py-1 rounded-md glass-button text-sm">
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/auth/signup" className="text-sm">
                    <motion.button whileHover={{ scale: 1.03 }} className="px-3 py-1 rounded-md bg-white text-black font-semibold text-sm">
                      Become a Critic
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile nav icons (quick access) */}
            <div className="md:hidden flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-2 rounded-lg transition-all duration-150 ${
                      isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    title={item.label}
                  >
                    <Icon className="text-lg" />
                  </Link>
                );
              })}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-black/80 border-t border-white/5" role="region" aria-label="Mobile menu">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md transition-colors ${pathname === item.href ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}

            <div className="pt-2 border-t border-white/5">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Signed in as {user?.username}</span>
                  <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-red-600 text-white text-sm">
                    <FaSignOutAlt />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/signin" className="w-1/2">
                    <button className="w-full px-3 py-2 rounded-md border border-white/10 text-white text-sm">Sign In</button>
                  </Link>
                  <Link href="/auth/signup" className="w-1/2">
                    <button className="w-full px-3 py-2 rounded-md bg-white text-black font-semibold text-sm">Become a Critic</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
