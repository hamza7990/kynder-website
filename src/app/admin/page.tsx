import Link from 'next/link';
import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { buttonVariants } from '@/components/ui';
import { getI18n } from '@/i18n/server';
import { formatDate } from '@/lib/format';

export default async function AdminDashboardPage() {
  const { t } = await getI18n();
  const [
    coachesCount,
    totalBookings,
    pendingBookings,
    completedBookings,
    questionsCount,
    topicsCount,
    recentBookings,
    coaches,
  ] = await Promise.all([
    db.user.count({ where: { role: 'COACH', isActive: true } }),
    db.booking.count(),
    db.booking.count({ where: { status: 'PENDING' } }),
    db.booking.count({ where: { status: 'COMPLETED' } }),
    db.question.count(),
    db.topic.count(),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { coach: true },
    }),
    db.user.findMany({
      where: { role: 'COACH' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { bookings: true } } },
    }),
  ]);

  const cmsShortcuts = [
    {
      title: t('dashboard.cms.questionsTitle'),
      count: t('dashboard.cms.questionsCount', { count: questionsCount }),
      href: '/admin/questions',
      icon: '❓',
      desc: t('dashboard.cms.questionsDesc'),
    },
    {
      title: t('dashboard.cms.topicsTitle'),
      count: t('dashboard.cms.topicsCount', { count: topicsCount }),
      href: '/admin/topics',
      icon: '🏷️',
      desc: t('dashboard.cms.topicsDesc'),
    },
    {
      title: t('dashboard.cms.bioTitle'),
      count: t('dashboard.cms.bioCount'),
      href: '/admin/about',
      icon: '👩‍💼',
      desc: t('dashboard.cms.bioDesc'),
    },
    {
      title: t('dashboard.cms.heroTitle'),
      count: t('dashboard.cms.heroCount'),
      href: '/admin/content',
      icon: '🏠',
      desc: t('dashboard.cms.heroDesc'),
    },
    {
      title: t('dashboard.cms.rosterTitle'),
      count: t('dashboard.cms.rosterCount', { count: coachesCount }),
      href: '/admin/coaches',
      icon: '👥',
      desc: t('dashboard.cms.rosterDesc'),
    },
    {
      title: t('dashboard.cms.settingsTitle'),
      count: t('dashboard.cms.settingsCount'),
      href: '/admin/settings',
      icon: '⚙️',
      desc: t('dashboard.cms.settingsDesc'),
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.description')}
        badge={t('dashboard.badge')}
      >
        <div className="flex gap-3">
          <Link
            href="/admin/coaches/new"
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            + {t('dashboard.addCoach')}
          </Link>
          <Link
            href="/admin/bookings"
            className={buttonVariants({ variant: 'ghost', size: 'md' })}
          >
            + {t('dashboard.scheduleBooking')}
          </Link>
        </div>
      </PageHeader>

      {/* Primary Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.stats.activeCoaches')}
          value={coachesCount}
          description={t('dashboard.stats.activeCoachesDesc')}
          icon={<span className="text-2xl">👥</span>}
        />
        <StatCard
          title={t('dashboard.stats.pendingRequests')}
          value={pendingBookings}
          trend={pendingBookings > 0 ? t('dashboard.stats.requiresAction') : t('dashboard.stats.allClear')}
          icon={<span className="text-2xl">⏳</span>}
        />
        <StatCard
          title={t('dashboard.stats.totalBookings')}
          value={totalBookings}
          description={t('dashboard.stats.totalBookingsDesc')}
          icon={<span className="text-2xl">📅</span>}
        />
        <StatCard
          title={t('dashboard.stats.completedSessions')}
          value={completedBookings}
          description={t('dashboard.stats.completedSessionsDesc')}
          icon={<span className="text-2xl">✅</span>}
        />
      </div>

      {/* CMS & Content Management Hub Shortcuts */}
      <div className="space-y-4">
        <h2 className="font-display text-h3 font-bold text-navy-deep">
          {t('dashboard.cmsHeading')}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cmsShortcuts.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl border border-ink-10 bg-cream-card p-6 shadow-1 transition-colors hover:border-navy hover:bg-cream"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{c.icon}</span>
                <span className="rounded-full bg-ink-10 px-2.5 py-0.5 text-small font-semibold text-navy-deep">
                  {c.count}
                </span>
              </div>
              <h3 className="mt-4 font-display text-h4 font-bold text-navy-deep group-hover:text-terracotta transition-colors">
                {c.title}
              </h3>
              <p className="mt-1 text-small text-ink-70">{c.desc}</p>
              <span className="mt-4 inline-block text-small font-semibold text-terracotta-text">
                {t('dashboard.openCms')} <span className="dir-flip">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings & Coaches Snapshot */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Bookings */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-6 shadow-1 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-10 pb-4">
            <h2 className="font-display text-h4 font-bold text-navy-deep">
              {t('dashboard.recentBookings')}
            </h2>
            <Link
              href="/admin/bookings"
              className="text-small font-semibold text-terracotta-text hover:underline"
            >
              {t('dashboard.viewAllBookings')} <span className="dir-flip">→</span>
            </Link>
          </div>

          <div className="mt-4 divide-y divide-ink-10">
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-body text-ink-60">
                {t('dashboard.noBookings')}
              </p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="flex flex-col justify-between py-4 sm:flex-row sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy-deep">{b.clientName}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-small font-semibold ${
                          b.status === 'CONFIRMED'
                            ? 'bg-success-soft text-success'
                            : b.status === 'COMPLETED'
                            ? 'bg-info-soft text-info'
                            : b.status === 'CANCELLED'
                            ? 'bg-danger-soft text-danger'
                            : 'bg-warning-soft text-warning'
                        }`}
                      >
                        {t(`statuses.${b.status}`)}
                      </span>
                    </div>
                    <p className="text-small text-ink-70">
                      {t('dashboard.topicLabel')}: <span className="font-medium text-navy-deep">{b.topicTitle || b.topicSlug}</span>
                    </p>
                    <p className="text-small text-ink-60">
                      {t('dashboard.coachLabel')}: {b.coach ? b.coach.name : t('dashboard.unassignedCoach')} • {t('dashboard.dateLabel')}: {formatDate(b.date)}
                    </p>
                  </div>
                  <Link
                    href="/admin/bookings"
                    className="self-start rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-small font-semibold text-navy-deep hover:bg-cream-card transition-colors"
                  >
                    {t('dashboard.manage')}
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coach Roster Snapshot */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-6 shadow-1">
          <div className="flex items-center justify-between border-b border-ink-10 pb-4">
            <h2 className="font-display text-h4 font-bold text-navy-deep">
              {t('dashboard.coachRoster')}
            </h2>
            <Link
              href="/admin/coaches"
              className="text-small font-semibold text-terracotta-text hover:underline"
            >
              {t('dashboard.manageAll')} <span className="dir-flip">→</span>
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {coaches.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-cream font-bold text-sm">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-small font-semibold text-navy-deep">{c.name}</p>
                    <p className="text-small text-ink-60">{c.title || t('dashboard.defaultCoachTitle')}</p>
                  </div>
                </div>
                <span className="rounded-full bg-ink-10 px-2 py-0.5 text-small font-semibold text-navy-deep">
                  {t('dashboard.sessionsCount', { count: c._count.bookings })}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-ink-10 pt-4">
            <Link
              href="/admin/coaches/new"
              className="flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-small font-semibold text-cream hover:bg-navy-hover transition-colors"
            >
              <span>+</span>
              <span>{t('dashboard.onboardNewCoach')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
