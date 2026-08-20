'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { logoutAction } from '@/lib/actions/auth';
import type { SessionUser } from '@/lib/auth';

interface SidebarProps {
  user: SessionUser;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname() ?? '';
  const isAdmin = user.role === 'ADMIN';

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: '📊' },
    { label: 'Coaches Roster', href: '/admin/coaches', icon: '👥' },
    { label: 'Session Bookings', href: '/admin/bookings', icon: '📅' },
    { label: 'Contact Messages', href: '/admin/messages', icon: '✉️' },
    { label: 'Hero & Home CMS', href: '/admin/content', icon: '🏠' },
    { label: '10 Leadership Questions', href: '/admin/questions', icon: '❓' },
    { label: '15 Coaching Topics', href: '/admin/topics', icon: '🏷️' },
    { label: 'About Dr. Shereen', href: '/admin/about', icon: '👩‍💼' },
    { label: 'Settings & Brand', href: '/admin/settings', icon: '⚙️' },
  ];

  const coachNav = [
    { label: 'My Bookings', href: '/coach', icon: '📅' },
    { label: 'My Profile & Bio', href: '/coach/profile', icon: '👤' },
  ];

  const links = isAdmin ? adminNav : coachNav;

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-ink-10 bg-cream p-5">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-ink-10 pb-5">
        <Link href="/" className="font-display text-h3 font-bold tracking-wider text-navy-deep hover:opacity-90">
          KYNDER
        </Link>
        <span className="rounded-full bg-navy-deep px-2.5 py-0.5 text-xs font-semibold text-cream uppercase tracking-wider">
          {isAdmin ? '👑 Admin' : '🧑‍💼 Coach'}
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
            <p className="truncate text-xs text-ink-60">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
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
          <span>Open Live Website</span>
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
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
