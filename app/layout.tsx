import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

import Providers from '@/components/Providers';
import QueryProvider from '@/components/QueryProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import AdaptiveFooter from '@/components/AdaptiveFooter';
import WarmRestaurantsCache from '@/components/WarmRestaurantsCache';

const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','500','600','700'], display: 'swap' });

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
