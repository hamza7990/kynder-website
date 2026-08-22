import Link from 'next/link';
import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { buttonVariants } from '@/components/ui';
import { LiveCoachesList } from '@/components/dashboard/live-coaches-list';
import { getI18n } from '@/i18n/server';

export default async function AdminCoachesPage() {
  const { t } = await getI18n();
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
        title={t('coaches.title')}
        description={t('coaches.description')}
        badge={t('coaches.badge')}
      >
        <Link
          href="/admin/coaches/new"
          className={buttonVariants({ variant: 'primary', size: 'md' })}
        >
          + {t('coaches.addNew')}
        </Link>
      </PageHeader>

      <LiveCoachesList initialCoaches={coaches} />
    </div>
  );
}
