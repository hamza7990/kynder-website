import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from './lib/jwt-secret';

const COOKIE_NAME = 'kynder_session';
const LOCALE_COOKIE = 'NEXT_LOCALE';
const LOCALES = ['en', 'ar'] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'en';

function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'ar';
}

/** Cookie preference → Accept-Language → default. Western-digit data is unaffected. */
function pickLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  const accept = request.headers.get('accept-language')?.toLowerCase() ?? '';
  // First language tag wins; only Arabic diverts from the English default.
  const first = accept.split(',')[0]?.trim() ?? '';
  if (first.startsWith('ar')) return 'ar';
  return DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ── Dashboard / auth routes: NOT localized. Keep the existing protection. ──
  if (path === '/login' || path.startsWith('/admin') || path.startsWith('/coach')) {
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

    if (path === '/login') {
      if (session) {
        return NextResponse.redirect(new URL(session.role === 'ADMIN' ? '/admin' : '/coach', request.url));
      }
      return NextResponse.next();
    }

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

    // /coach/*
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Public routes: guarantee a /en or /ar prefix. ──
  const segments = path.split('/');
  const maybeLocale = segments[1];
  const hasLocale = isLocale(maybeLocale);

  if (!hasLocale) {
    const locale = pickLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${path === '/' ? '' : path}`;
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return redirect;
  }

  // ── Has a valid locale prefix: pass it to the layout via x-locale, remember it. ──
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', maybeLocale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(LOCALE_COOKIE, maybeLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  // Run on everything except Next internals, the API, and files with an extension
  // (sitemap.xml, robots.txt, icon.svg, images) and the OG image route.
  matcher: ['/((?!api|_next|opengraph-image|.*\\..*).*)'],
};
