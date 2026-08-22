import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { createManualBookingAction } from '@/lib/actions/cms';
import { LiveBookingsList } from '@/components/dashboard/live-bookings-list';
import { topics } from '@/data/topics';
import { getI18n } from '@/i18n/server';

export default async function AdminBookingsPage() {
  const { t } = await getI18n();
  const [bookings, coaches] = await Promise.all([
    db.booking.findMany({
      orderBy: { date: 'asc' },
      include: { coach: true },
    }),
    db.user.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('bookings.title')}
        description={t('bookings.description')}
        badge={t('bookings.badge')}
      />

      {/* Manual Booking Drawer / Card */}
      <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 hover-lift transition-colors">
        <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
          + {t('bookings.manualHeading')}
        </h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createManualBookingAction(formData);
          }}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label={t('bookings.clientName')} htmlFor="clientName">
              <Input
                id="clientName"
                name="clientName"
                placeholder={t('bookings.clientNamePlaceholder')}
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('bookings.clientEmail')} htmlFor="clientEmail">
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                placeholder={t('bookings.clientEmailPlaceholder')}
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('bookings.clientPhone')} htmlFor="clientPhone">
              <Input
                id="clientPhone"
                name="clientPhone"
                placeholder={t('bookings.clientPhonePlaceholder')}
                className="bg-cream"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label={t('bookings.topic')} htmlFor="topicSlug">
              <select
                id="topicSlug"
                name="topicSlug"
                required
                className="w-full rounded-lg border border-ink-20 bg-cream p-3 text-body text-navy-deep focus:outline-none"
              >
                {topics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.title}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('bookings.assignCoach')} htmlFor="coachId">
              <select
                id="coachId"
                name="coachId"
                className="w-full rounded-lg border border-ink-20 bg-cream p-3 text-body text-navy-deep focus:outline-none"
              >
                <option value="">{t('bookings.autoMatch')}</option>
                {coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({t(`roles.${c.role}`)})
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('bookings.dateTime')} htmlFor="date">
              <Input
                id="date"
                name="date"
                type="datetime-local"
                min={minDate}
                required
                className="bg-cream"
              />
            </Field>
          </div>

          <Field label={t('bookings.notes')} htmlFor="notes">
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder={t('bookings.notesPlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Button type="submit" variant="primary" size="md">
            {t('bookings.scheduleSession')}
          </Button>
        </form>
      </div>

      {/* Live Interactive List with Instant Search and Status Triggers */}
      <LiveBookingsList
        initialBookings={bookings}
        coaches={coaches.map((c) => ({ id: c.id, name: c.name, role: c.role }))}
        userRole="ADMIN"
      />
    </div>
  );
}
