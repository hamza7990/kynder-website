import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type * as AuthModule from '@/lib/auth';

// The public site MUST stay English + left-to-right no matter who is signed in.
// The per-admin Arabic/RTL interface is confined to the dashboard subtree.
//
// We simulate an Arabic-preferring admin being logged in (getSession → ar) and
// prove the public root layout is unaffected, while the admin layout mirrors.

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

    expect(markup).toContain('lang="en"');
    expect(markup).toContain('dir="ltr"');
    expect(markup).not.toContain('dir="rtl"');
    expect(markup).not.toContain('lang="ar"');
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
