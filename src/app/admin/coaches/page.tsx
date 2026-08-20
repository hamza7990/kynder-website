import Link from 'next/link';
import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { buttonVariants } from '@/components/ui';
import { LiveCoachesList } from '@/components/dashboard/live-coaches-list';

export default async function AdminCoachesPage() {
  const coaches = await db.user.findMany({
    orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Coach Management Roster"
        description="Add, edit, deactivate, or assign specialties to coaches with real-time feedback."
        badge="Team Operations"
      >
        <Link
          href="/admin/coaches/new"
          className={buttonVariants({ variant: 'primary', size: 'md' })}
        >
          + Add New Coach
        </Link>
      </PageHeader>

      <LiveCoachesList initialCoaches={coaches} />
    </div>
  );
}
