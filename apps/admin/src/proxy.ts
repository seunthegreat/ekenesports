import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract locale from pathname (default to 'en')
  const locale = pathname.split('/')[1] || 'en';
  
  // Check for the correct BetterAuth session cookie
  const token = request.cookies.get('better-auth.session_token') || 
                request.cookies.get('__Secure-better-auth.session_token');
  
  // Define auth-related paths
  const authPaths = ['/login', '/forgot-password', '/reset-password'];
  const isAuthPath = authPaths.some(path => pathname.includes(path));

  // 1. If unauthenticated and trying to access dashboard routes, redirect to login
  if (!token && !isAuthPath && (pathname.includes('/(de|en)') || pathname === '/')) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated and trying to access auth pages, redirect to dashboard
  if (token && isAuthPath) {
      const dashboardUrl = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(dashboardUrl);
  }

  // 3. Handle internationalization
  return intlMiddleware(request);
}

export const config = {
  // Match all internationalized pathnames
  matcher: ['/', '/(de|en)/:path*']
};
