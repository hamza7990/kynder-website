import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { createCoachAction } from '@/lib/actions/coaches';
import { topics } from '@/data/topics';

export default function NewCoachPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add New Coach"
        description="Register a new leadership coach into the KYNDER system."
        badge="Onboarding"
      >
        <Link
          href="/admin/coaches"
          className="rounded-lg border border-ink-20 bg-cream px-4 py-2 text-small font-semibold text-navy-deep hover:bg-cream-card"
        >
          ← Back to Roster
        </Link>
      </PageHeader>

      <div className="max-w-2xl rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1">
        <form
          action={async (formData: FormData) => {
            'use server';
            const res = await createCoachAction(formData);
            if (res.success) {
              const { redirect } = await import('next/navigation');
              redirect('/admin/coaches');
            }
          }}
          className="space-y-6"
        >
          <Field label="Full Name" htmlFor="name">
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g. Layla Al-Mansoor"
              className="bg-cream"
            />
          </Field>

          <Field label="Email Address" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="coach.name@kynder.com"
              className="bg-cream"
            />
          </Field>

          <Field label="Temporary Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Min 6 characters"
              className="bg-cream"
            />
          </Field>

          <Field label="Professional Title" htmlFor="title">
            <Input
              id="title"
              name="title"
              placeholder="e.g. Senior Executive & Transformation Coach"
              className="bg-cream"
            />
          </Field>

          <Field label="Avatar URL (Optional)" htmlFor="avatar">
            <Input
              id="avatar"
              name="avatar"
              placeholder="/images/coach.jpg or https://..."
              className="bg-cream"
            />
          </Field>

          <Field label="Biography & Credentials" htmlFor="bio">
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="Coach background, experience across regions, ICF accreditations..."
              className="bg-cream"
            />
          </Field>

          <Field label="Specialties / Topic Slugs (Comma-separated)" htmlFor="specialties">
            <Input
              id="specialties"
              name="specialties"
              placeholder="e.g. having-hard-conversations, building-trust-as-a-new-manager"
              className="bg-cream"
            />
            <p className="mt-2 text-small text-ink-60">
              Available topics: {topics.map((t) => t.slug).join(', ')}
            </p>
          </Field>

          <div className="flex justify-end gap-4 border-t border-ink-10 pt-6">
            <Link
              href="/admin/coaches"
              className="rounded-lg border border-ink-20 px-6 py-2.5 text-body font-semibold text-ink-70 hover:bg-cream"
            >
              Cancel
            </Link>
            <Button type="submit" variant="primary" size="md">
              Create Coach Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
