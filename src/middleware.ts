import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from './lib/jwt-secret';

const COOKIE_NAME = 'kynder_session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let session: { role?: string; id?: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as { role?: string; id?: string };
    } catch {
      session = null;
    }
  }

  // 1. If visiting /login while already logged in -> redirect to dashboard
  if (path === '/login') {
    if (session) {
      if (session.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/coach', request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect /admin/* routes
  if (path.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/coach', request.url));
    }
    return NextResponse.next();
  }

  // 3. Protect /coach/* routes
  if (path.startsWith('/coach')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/coach/:path*', '/login'],
};
