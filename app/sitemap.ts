import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitecheck.example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [ '', 'explore', 'auth/signin', 'auth/signup' ];
  const now = new Date();
  return pages.map(p => ({
    url: `${siteUrl}/${p}`.replace(/\\+$|(?<!:)\/\//g, '/'),
    lastModified: now,
    changeFrequency: p === '' ? 'daily' : 'weekly',
    priority: p === '' ? 1 : 0.6
  }));
}
