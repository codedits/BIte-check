'use client';

import Link from 'next/link';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-black">
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="text-lg font-bold text-white">
                BiteCheck
              </span>
            </div>
            <p className="max-w-sm text-sm text-white/60 leading-relaxed">
              Discover exceptional dining experiences through authentic reviews from passionate food lovers.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: FaInstagram, label: 'Instagram', href: '#' },
                { icon: FaTwitter, label: 'Twitter', href: '#' },
                { icon: FaYoutube, label: 'YouTube', href: '#' }
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 text-sm md:col-span-2 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-500">Navigate</h3>
              <ul className="space-y-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/explore', label: 'Explore' },
                  { href: '/profile', label: 'Profile' }
                ].map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className="text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-500">Account</h3>
              <ul className="space-y-2">
                {[
                  { href: '/auth/signin', label: 'Sign in' },
                  { href: '/auth/signup', label: 'Get Started' },
                  { href: '/profile', label: 'My Reviews' }
                ].map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className="text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-500">Support</h3>
              <ul className="space-y-2">
                {[
                  { href: '#', label: 'Contact' },
                  { href: '#', label: 'Privacy' },
                  { href: '#', label: 'Terms' }
                ].map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href} 
                      className="text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} BiteCheck. All rights reserved.</p>
          <p>Made for food lovers</p>
        </div>
      </div>
    </footer>
  );
}
