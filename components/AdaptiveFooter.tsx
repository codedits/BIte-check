'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function AdaptiveFooter() {
  const pathname = usePathname() || '';
  const minimal = pathname.startsWith('/profile') || pathname.startsWith('/explore');

  if (minimal) {
    return (
      <footer className="mt-auto border-t border-white/10 bg-black/80">
        <div className="py-6 text-center text-[11px] tracking-wide text-white/50">
          BiteCheck
        </div>
      </footer>
    );
  }
  return <Footer />;
}
