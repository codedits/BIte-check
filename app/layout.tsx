import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Providers from '@/components/Providers';
import QueryProvider from '@/components/QueryProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import AdaptiveFooter from '@/components/AdaptiveFooter';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitecheck.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BiteCheck – Discover & Review Restaurants',
    template: '%s | BiteCheck'
  },
  description: 'Find, review and compare the best restaurants near you. Real photo‑backed reviews, weighted ratings and fast discovery.',
  keywords: [
    'restaurants', 'restaurant reviews', 'food reviews', 'dining guide', 'best restaurants', 'places to eat', 'food photos'
  ],
  authors: [{ name: 'BiteCheck' }],
  creator: 'BiteCheck',
  openGraph: {
    title: 'BiteCheck – Crowd‑Powered Restaurant Discovery',
    description: 'Authentic, signal‑rich restaurant reviews with weighted category ratings.',
    url: siteUrl,
    siteName: 'BiteCheck',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BiteCheck – Discover Restaurants',
    description: 'Crowd‑powered restaurant discovery & weighted ratings.',
    creator: '@bitecheck'
  },
  alternates: {
    canonical: '/',
  },
  category: 'Food & Dining',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  themeColor: '#000000'
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
        <meta name="application-name" content="BiteCheck" />
        <meta name="apple-mobile-web-app-title" content="BiteCheck" />
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className={`${inter.className} antialiased bg-black text-white`}>
        <QueryProvider>
          <Providers>
            <div className="min-h-screen flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
              <Navbar />
              <main className="flex-1 focus:outline-none">
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
