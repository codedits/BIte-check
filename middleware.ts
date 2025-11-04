import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Middleware to set performance & security headers
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  // Aggressive long-term caching for build assets
  if (path.startsWith('/_next/static/')) {
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Helpful defaults (small perf/security hardening)
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Permissions-Policy', 'geolocation=()');

  return res;
}

export const config = {
  matcher: ['/((?!api/auth|_next/image|_next/static|favicon.ico).*)'],
};
