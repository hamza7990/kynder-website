import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { LiveBookingsList } from '@/components/dashboard/live-bookings-list';
import { getI18n } from '@/i18n/server';

export default async function CoachBookingsPage() {
  const { t } = await getI18n();
  const session = await getSession();
  if (!session) return null;

  const [bookings, completedCount, pendingCount] = await Promise.all([
    db.booking.findMany({
      where: { coachId: session.id },
      orderBy: { date: 'asc' },
    }),
    db.booking.count({
      where: { coachId: session.id, status: 'COMPLETED' },
    }),
    db.booking.count({
      where: { coachId: session.id, status: 'PENDING' },
    }),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('coachDashboard.welcome', { name: session.name })}
        description={t('coachDashboard.description')}
        badge={t('coachDashboard.badge')}
      />

      {/* Metrics Cards with Hover Lift */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title={t('coachDashboard.totalAssigned')}
          value={bookings.length}
          description={t('coachDashboard.totalAssignedDesc')}
          icon={<span className="text-2xl">📅</span>}
          className="hover-lift"
        />
        <StatCard
          title={t('coachDashboard.pendingScheduled')}
          value={pendingCount}
          description={t('coachDashboard.pendingScheduledDesc')}
          icon={<span className="text-2xl">⏳</span>}
          className="hover-lift"
        />
        <StatCard
          title={t('coachDashboard.completed')}
          value={completedCount}
          description={t('coachDashboard.completedDesc')}
          icon={<span className="text-2xl">✅</span>}
          className="hover-lift"
        />
      </div>

      {/* Interactive Sessions List */}
      <div className="space-y-4">
        <h2 className="font-display text-h3 font-bold text-navy-deep">
          {t('coachDashboard.scheduleHeading')}
        </h2>

        <LiveBookingsList
          initialBookings={bookings}
          coaches={[{ id: session.id, name: session.name, role: 'COACH' }]}
          userRole="COACH"
        />
      </div>
    </div>
  );
}
