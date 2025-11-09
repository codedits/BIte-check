import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

import Providers from '@/components/Providers';
import QueryProvider from '@/components/QueryProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import AdaptiveFooter from '@/components/AdaptiveFooter';
import WarmRestaurantsCache from '@/components/WarmRestaurantsCache';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400','500','600','700'], // Removed 300 to reduce font payload
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif']
});

export const metadata: Metadata = {
  title: 'BiteCheck - Discover Amazing Restaurants',
  description: 'Find and review the best restaurants in your area',
  keywords: ['restaurants', 'food reviews', 'dining', 'local restaurants'],
  authors: [{ name: 'BiteCheck' }],
  openGraph: {
    title: 'BiteCheck - Discover Amazing Restaurants',
    description: 'Find and review the best restaurants in your area',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BiteCheck - Discover Amazing Restaurants',
    description: 'Find and review the best restaurants in your area',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ff6b35',
};

// Suppress location error during SSR
if (typeof window === 'undefined') {
  // @ts-expect-error - Suppress global location for SSR
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
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
  <body className={`${poppins.className} antialiased bg-black text-white`}>
        <QueryProvider>
          <Providers>
            <div className="min-h-screen flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
              <Navbar />
              <main className="flex-1 focus:outline-none">
                <WarmRestaurantsCache />
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
              <AdaptiveFooter />
            </div>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
