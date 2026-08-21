import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { updateCoachAction } from '@/lib/actions/coaches';
import { topics } from '@/data/topics';

export default async function EditCoachPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = await db.user.findUnique({
    where: { id },
  });

  if (!coach) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Edit Coach: ${coach.name}`}
        description="Update profile, specialties, title, or reset password."
        badge={coach.role}
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
            const res = await updateCoachAction(coach.id, formData);
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
              defaultValue={coach.name}
              className="bg-cream"
            />
          </Field>

          <Field label="Email Address" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={coach.email}
              className="bg-cream"
            />
          </Field>

          <Field label="Reset Password (Leave blank to keep current)" htmlFor="newPassword">
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              className="bg-cream"
            />
          </Field>

          <Field label="Professional Title" htmlFor="title">
            <Input
              id="title"
              name="title"
              defaultValue={coach.title || ''}
              className="bg-cream"
            />
          </Field>

          <Field label="Avatar URL" htmlFor="avatar">
            <Input
              id="avatar"
              name="avatar"
              defaultValue={coach.avatar || ''}
              className="bg-cream"
            />
          </Field>

          <Field label="Biography & Credentials" htmlFor="bio">
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={coach.bio || ''}
              className="bg-cream"
            />
          </Field>

          <Field label="Specialties / Topic Slugs" htmlFor="specialties">
            <Input
              id="specialties"
              name="specialties"
              defaultValue={coach.specialties || ''}
              className="bg-cream"
            />
            <p className="mt-2 text-small text-ink-60">
              Available: {topics.map((t) => t.slug).join(', ')}
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
