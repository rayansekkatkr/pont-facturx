import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pages protégées qui ne doivent pas être indexées
  const protectedPages = [
    '/auth',
    '/billing',
    '/dashboard',
    '/profile',
    '/results',
    '/upload',
    '/verify',
    '/verify-code',
    '/verify-email',
    '/success',
  ];

  // Ajouter noindex pour les pages protégées
  if (protectedPages.some(page => pathname.startsWith(page))) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|sitemap.xml|robots.txt).*)',
  ],
};
