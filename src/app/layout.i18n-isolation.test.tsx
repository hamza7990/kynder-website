import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type * as AuthModule from '@/lib/auth';

// The public site MUST stay English + left-to-right no matter who is signed in.
// The per-admin Arabic/RTL interface is confined to the dashboard subtree.
//
// We simulate an Arabic-preferring admin being logged in (getSession → ar) and
// prove the public root layout is unaffected, while the admin layout mirrors.

// Public <html lang/dir> comes from the `x-locale` request header (middleware),
// NOT from the admin session. With no header the public root is English — which is
// exactly what must hold even when an Arabic admin is signed in.
vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('@/lib/auth', async () => {
  const actual: typeof AuthModule = await vi.importActual('@/lib/auth');
  return {
    ...actual,
    getSession: vi.fn(() =>
      Promise.resolve({
        id: 'u1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'ADMIN' as const,
        locale: 'ar' as const,
        title: null,
        avatar: null,
      }),
    ),
  };
});

describe('interface-language isolation', () => {
  it('public root layout stays lang="en" dir="ltr" even with an Arabic admin logged in', async () => {
    const RootLayout = (await import('./layout')).default;
    const markup = renderToStaticMarkup(await RootLayout({ children: <p>public content</p> }));

    // Assert on the <html> ELEMENT specifically — not the whole document. The
    // language switcher legitimately renders an <a lang="ar"> for the Arabic
    // option, which is correct a11y and must not fail this guard. What matters is
    // that the document root stays English/LTR regardless of the admin session.
    const htmlTag = markup.match(/<html[^>]*>/)?.[0] ?? '';
    expect(htmlTag).toContain('lang="en"');
    expect(htmlTag).toContain('dir="ltr"');
    expect(htmlTag).not.toContain('lang="ar"');
    expect(htmlTag).not.toContain('dir="rtl"');
  });

  it('admin layout mirrors to dir="rtl" lang="ar" for an Arabic admin — on its own subtree, not <html>', async () => {
    // Isolate the admin layout from server-only + prisma-backed action imports.
    vi.doMock('next/navigation', () => ({
      redirect: vi.fn(),
      usePathname: () => '/admin',
    }));
    vi.doMock('@/i18n/server', () => ({
      getI18n: vi.fn(() => Promise.resolve({ locale: 'ar', dir: 'rtl', t: (k: string) => k })),
    }));
    vi.doMock('@/lib/actions/auth', () => ({ logoutAction: vi.fn() }));

    const AdminLayout = (await import('./admin/layout')).default;
    const markup = renderToStaticMarkup(await AdminLayout({ children: <p>admin content</p> }));

    expect(markup).toContain('dir="rtl"');
    expect(markup).toContain('lang="ar"');
    expect(markup).toContain('font-arabic');
    // The dir/lang belong to a <div>, never to <html> — no document element here.
    expect(markup).not.toContain('<html');
  });
});
