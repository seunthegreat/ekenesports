import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token');
  
  // Define protected routes for customers
  const protectedPaths = ['/orders', '/checkout'];
  const isProtectedRoute = protectedPaths.some(path => pathname.includes(path));

  // 1. If unauthenticated and trying to access protected customer routes, redirect to login
  if (!token && isProtectedRoute) {
    const locale = pathname.split('/')[1] || 'en';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    // Optionally preserve the intended destination
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Handle internationalization
  return intlMiddleware(request);
}

export const config = {
  // Catch all routes except api, static files, etc.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
