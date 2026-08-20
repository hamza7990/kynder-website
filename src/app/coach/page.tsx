import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { LiveBookingsList } from '@/components/dashboard/live-bookings-list';

export default async function CoachBookingsPage() {
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
        title={`Welcome back, ${session.name}`}
        description="View your upcoming coaching sessions, client notes, and update session progress in real-time."
        badge="Coach Command Hub"
      />

      {/* Metrics Cards with Hover Lift */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Total Assigned"
          value={bookings.length}
          description="Coaching sessions"
          icon={<span className="text-2xl">📅</span>}
          className="hover-lift"
        />
        <StatCard
          title="Pending / Scheduled"
          value={pendingCount}
          description="Upcoming sessions"
          icon={<span className="text-2xl">⏳</span>}
          className="hover-lift"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          description="Delivered sessions"
          icon={<span className="text-2xl">✅</span>}
          className="hover-lift"
        />
      </div>

      {/* Interactive Sessions List */}
      <div className="space-y-4">
        <h2 className="font-display text-h3 font-bold text-navy-deep">
          Your Interactive Coaching Schedule
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
