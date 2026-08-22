'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { logoutAction } from '@/lib/actions/auth';
import { useT } from '@/i18n/client';
import type { SessionUser } from '@/lib/auth';

interface SidebarProps {
  user: SessionUser;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname() ?? '';
  const t = useT();
  const isAdmin = user.role === 'ADMIN';

  const adminNav = [
    { label: t('sidebar.nav.overview'), href: '/admin', icon: '📊' },
    { label: t('sidebar.nav.coaches'), href: '/admin/coaches', icon: '👥' },
    { label: t('sidebar.nav.bookings'), href: '/admin/bookings', icon: '📅' },
    { label: t('sidebar.nav.messages'), href: '/admin/messages', icon: '✉️' },
    { label: t('sidebar.nav.content'), href: '/admin/content', icon: '🏠' },
    { label: t('sidebar.nav.questions'), href: '/admin/questions', icon: '❓' },
    { label: t('sidebar.nav.topics'), href: '/admin/topics', icon: '🏷️' },
    { label: t('sidebar.nav.about'), href: '/admin/about', icon: '👩‍💼' },
    { label: t('sidebar.nav.settings'), href: '/admin/settings', icon: '⚙️' },
  ];

  const coachNav = [
    { label: t('sidebar.nav.myBookings'), href: '/coach', icon: '📅' },
    { label: t('sidebar.nav.myProfile'), href: '/coach/profile', icon: '👤' },
  ];

  const links = isAdmin ? adminNav : coachNav;

  return (
    <aside className="flex h-screen w-72 flex-col border-e border-ink-10 bg-cream p-5">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-ink-10 pb-5">
        <Link href="/" className="font-display text-h3 font-bold tracking-wider text-navy-deep hover:opacity-90">
          KYNDER
        </Link>
        <span className="rounded-full bg-navy-deep px-2.5 py-0.5 text-small font-semibold text-cream uppercase tracking-wider">
          {isAdmin ? `👑 ${t('sidebar.adminBadge')}` : `🧑‍💼 ${t('sidebar.coachBadge')}`}
        </span>
      </div>

      {/* User Info Pill */}
      <div className="my-4 rounded-xl border border-ink-10 bg-cream-card p-3.5">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover shadow-1"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-cream font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-body font-semibold text-navy-deep">{user.name}</p>
            <p className="truncate text-small text-ink-60">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pe-1">
        {links.map((item) => {
          const isActive =
            item.href === '/admin' || item.href === '/coach'
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-small font-medium transition-colors duration-fast',
                isActive
                  ? 'bg-navy-deep text-cream shadow-1'
                  : 'text-ink-80 hover:bg-cream-card hover:text-navy-deep'
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Exit Links */}
      <div className="border-t border-ink-10 pt-4 space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-small text-ink-70 hover:bg-cream-card hover:text-navy-deep transition-colors"
        >
          <span>🌐</span>
          <span>{t('sidebar.openWebsite')}</span>
        </Link>

        <form
          action={async () => {
            await logoutAction();
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-small font-semibold text-terracotta-text hover:bg-cream-card transition-colors"
          >
            <span>🚪</span>
            <span>{t('sidebar.signOut')}</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
