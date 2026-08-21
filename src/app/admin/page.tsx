import Link from 'next/link';
import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { buttonVariants } from '@/components/ui';

export default async function AdminDashboardPage() {
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
      title: '10 Leadership Questions',
      count: `${questionsCount} questions`,
      href: '/admin/questions',
      icon: '❓',
      desc: 'Edit questions, pillars & 50 reflection steps',
    },
    {
      title: '15 Coaching Topics',
      count: `${topicsCount} topics`,
      href: '/admin/topics',
      icon: '🏷️',
      desc: 'Manage topic clusters & descriptions',
    },
    {
      title: 'Dr. Shereen Williams Bio',
      count: 'Founder Bio',
      href: '/admin/about',
      icon: '👩‍💼',
      desc: 'Edit background, story, credentials & photo',
    },
    {
      title: 'Hero & Home Page CMS',
      count: 'Live copy',
      href: '/admin/content',
      icon: '🏠',
      desc: 'Edit hero headline, eyebrow & positioning',
    },
    {
      title: 'Coach Roster',
      count: `${coachesCount} coaches`,
      href: '/admin/coaches',
      icon: '👥',
      desc: 'Onboard coaches & manage specialties',
    },
    {
      title: 'Site Settings & SEO',
      count: 'Global config',
      href: '/admin/settings',
      icon: '⚙️',
      desc: 'Email, phone, social links & endpoints',
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Admin Control Center"
        description="Comprehensive management of coaches, curriculum questions, topics, bookings, and live website copy."
        badge="Enterprise Hub"
      >
        <div className="flex gap-3">
          <Link
            href="/admin/coaches/new"
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            + Add Coach
          </Link>
          <Link
            href="/admin/bookings"
            className={buttonVariants({ variant: 'ghost', size: 'md' })}
          >
            + Schedule Booking
          </Link>
        </div>
      </PageHeader>

      {/* Primary Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Coaches"
          value={coachesCount}
          description="Accredited mentors on team"
          icon={<span className="text-2xl">👥</span>}
        />
        <StatCard
          title="Pending Requests"
          value={pendingBookings}
          trend={pendingBookings > 0 ? 'Requires action' : 'All clear'}
          icon={<span className="text-2xl">⏳</span>}
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          description="Client coaching sessions"
          icon={<span className="text-2xl">📅</span>}
        />
        <StatCard
          title="Completed Sessions"
          value={completedBookings}
          description="Delivered leadership hours"
          icon={<span className="text-2xl">✅</span>}
        />
      </div>

      {/* CMS & Content Management Hub Shortcuts */}
      <div className="space-y-4">
        <h2 className="font-display text-h3 font-bold text-navy-deep">
          Content & Curriculum Control (CMS)
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
                <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-small font-semibold text-navy-deep">
                  {c.count}
                </span>
              </div>
              <h3 className="mt-4 font-display text-h4 font-bold text-navy-deep group-hover:text-terracotta transition-colors">
                {c.title}
              </h3>
              <p className="mt-1 text-small text-ink-70">{c.desc}</p>
              <span className="mt-4 inline-block text-small font-semibold text-terracotta-text">
                Open CMS →
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
              Recent Session Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-small font-semibold text-terracotta-text hover:underline"
            >
              View all bookings →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-ink-10">
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-body text-ink-60">
                No bookings recorded yet.
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
                            ? 'bg-green-100 text-green-800'
                            : b.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="text-small text-ink-70">
                      Topic: <span className="font-medium text-navy-deep">{b.topicTitle || b.topicSlug}</span>
                    </p>
                    <p className="text-small text-ink-60">
                      Coach: {b.coach ? b.coach.name : 'Unassigned'} • Date: {new Date(b.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href="/admin/bookings"
                    className="self-start rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-small font-semibold text-navy-deep hover:bg-cream-card transition-colors"
                  >
                    Manage
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
              Coach Roster
            </h2>
            <Link
              href="/admin/coaches"
              className="text-small font-semibold text-terracotta-text hover:underline"
            >
              Manage all →
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
                    <p className="text-small text-ink-60">{c.title || 'Leadership Coach'}</p>
                  </div>
                </div>
                <span className="rounded-full bg-navy/10 px-2 py-0.5 text-small font-semibold text-navy-deep">
                  {c._count.bookings} sessions
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
              <span>Onboard New Coach</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
