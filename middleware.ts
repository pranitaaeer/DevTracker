import { NextRequest, NextResponse } from 'next/server';

// Middleware now only sets security headers. Authentication is disabled and
// the app uses a mock user for development — no redirects to login.

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/learning/:path*', '/interviews/:path*', '/achievements/:path*', '/api/:path*']
};
