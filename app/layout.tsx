import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import AdaptiveFooter from '@/components/AdaptiveFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BiteCheck - Discover Amazing Restaurants',
  description: 'Find and review the best restaurants in your area',
};

// Suppress location error during SSR
if (typeof window === 'undefined') {
  // @ts-ignore
  global.location = undefined;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.className} antialiased bg-black text-white`}>
        <Providers>
          <div className="min-h-screen flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            <Navbar />
            <main className="flex-1 focus:outline-none">
              {children}
            </main>
            <AdaptiveFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
