import { NextResponse } from 'next/server';

/**
 * Middleware for route protection
 * Note: This runs on the edge, so we can only do basic checks here.
 * Full membership validation happens in the API routes and page components.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/reset-password'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Define auth routes (login, register)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth routes with valid session, redirect to dashboard
  // (Let the dashboard handle membership checks)
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow membership-expired page even with session (it handles its own redirects)
  if (pathname.startsWith('/membership-expired') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/reset-password',
    '/membership-expired',
    '/login',
    '/register',
  ],
};
