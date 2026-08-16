import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');
  const pathname = request.nextUrl.pathname;

  // If accessing the login page...
  if (pathname === '/login') {
    // ...and they have any valid session token, redirect them to dashboard
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise let them view the login page
    return NextResponse.next();
  }

  // If accessing any /admin route...
  if (pathname.startsWith('/admin')) {
    // ...and they have absolutely no session tokens, redirect to login
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply this middleware to /admin and /login routes
  matcher: ['/admin/:path*', '/login'],
};
