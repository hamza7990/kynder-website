import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { createManualBookingAction } from '@/lib/actions/cms';
import { LiveBookingsList } from '@/components/dashboard/live-bookings-list';
import { topics } from '@/data/topics';

export default async function AdminBookingsPage() {
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
        title="Session Bookings Desk"
        description="Review client requests, create VIP/Corporate bookings, update status, and assign coaches in real-time."
        badge="Live Operations"
      />

      {/* Manual Booking Drawer / Card */}
      <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 hover-lift transition-colors">
        <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
          + Schedule a New Client Session (Manual / VIP)
        </h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createManualBookingAction(formData);
          }}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Client Full Name" htmlFor="clientName">
              <Input
                id="clientName"
                name="clientName"
                placeholder="e.g. David Vance"
                required
                className="bg-cream"
              />
            </Field>

            <Field label="Client Email Address" htmlFor="clientEmail">
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                placeholder="david@company.com"
                required
                className="bg-cream"
              />
            </Field>

            <Field label="Phone / WhatsApp" htmlFor="clientPhone">
              <Input
                id="clientPhone"
                name="clientPhone"
                placeholder="+44 7700 900123"
                className="bg-cream"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Coaching Topic" htmlFor="topicSlug">
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

            <Field label="Assign Coach" htmlFor="coachId">
              <select
                id="coachId"
                name="coachId"
                className="w-full rounded-lg border border-ink-20 bg-cream p-3 text-body text-navy-deep focus:outline-none"
              >
                <option value="">Auto-match by Topic</option>
                {coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date & Time" htmlFor="date">
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

          <Field label="Session Objectives & Notes (Optional)" htmlFor="notes">
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Executive goals, focus areas, restructuring context..."
              className="bg-cream"
            />
          </Field>

          <Button type="submit" variant="primary" size="md">
            Schedule Session
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
