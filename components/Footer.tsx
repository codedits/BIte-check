'use client';

import Link from 'next/link';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] text-white/50">BiteCheck</span>
            <p className="max-w-sm text-sm text-white/60">
              A minimal dining companion powered by the community. Discover spots that deserve your time, not just your clicks.
            </p>
            <div className="flex gap-3 text-white/50">
              {[{ icon: FaInstagram, label: 'Instagram' }, { icon: FaTwitter, label: 'Twitter' }, { icon: FaYoutube, label: 'YouTube' }].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition hover:border-white/30 hover:text-white"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm text-white/60 md:col-span-2 md:grid-cols-3">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">Navigate</span>
              <ul className="space-y-2">
                {[{ href: '/', label: 'Home' }, { href: '/explore', label: 'Explore' }, { href: '/profile', label: 'Profile' }].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">Join</span>
              <ul className="space-y-2">
                {[{ href: '/auth/signin', label: 'Sign in' }, { href: '/auth/signup', label: 'Create account' }, { href: '/profile', label: 'Your reviews' }].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">Support</span>
              <ul className="space-y-2">
                {[{ href: '#', label: 'Contact' }, { href: '#', label: 'Privacy' }, { href: '#', label: 'Terms' }].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="transition hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} BiteCheck. Built for thoughtful diners.</span>
          <span className="text-white/40">Minimal UI • Poppins type • No distractions</span>
        </div>
      </div>
    </footer>
  );
}
