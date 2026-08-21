import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { updateCoachSelfProfileAction } from '@/lib/actions/coaches';
import { changePasswordAction } from '@/lib/actions/auth';
import { topics } from '@/data/topics';

export default async function CoachProfilePage() {
  const session = await getSession();
  if (!session) return null;

  const coach = await db.user.findUnique({
    where: { id: session.id },
  });

  if (!coach) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Coach Profile"
        description="Update your bio, leadership specialties, and account security."
        badge="Profile Settings"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Profile Information */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            Professional Information
          </h2>

          <form
            action={async (formData: FormData) => {
              'use server';
              await updateCoachSelfProfileAction(formData);
            }}
            className="mt-6 space-y-6"
          >
            <Field label="Full Name" htmlFor="name">
              <Input
                id="name"
                name="name"
                defaultValue={coach.name}
                required
                className="bg-cream"
              />
            </Field>

            <Field label="Email Address (Read-only)" htmlFor="email">
              <Input
                id="email"
                name="email"
                defaultValue={coach.email}
                disabled
                className="bg-cream opacity-70 cursor-not-allowed"
              />
            </Field>

            <Field label="Professional Title" htmlFor="title">
              <Input
                id="title"
                name="title"
                defaultValue={coach.title || ''}
                placeholder="e.g. Executive & Team Leadership Coach"
                className="bg-cream"
              />
            </Field>

            <Field label="Avatar URL" htmlFor="avatar">
              <Input
                id="avatar"
                name="avatar"
                defaultValue={coach.avatar || ''}
                placeholder="/images/profile.jpg or https://..."
                className="bg-cream"
              />
            </Field>

            <Field label="Bio & Credentials" htmlFor="bio">
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={coach.bio || ''}
                placeholder="Your coaching background, focus areas..."
                className="bg-cream"
              />
            </Field>

            <Field label="Coaching Specialties (Comma-separated topic slugs)" htmlFor="specialties">
              <Input
                id="specialties"
                name="specialties"
                defaultValue={coach.specialties || ''}
                placeholder="having-hard-conversations, imposter-syndrome"
                className="bg-cream"
              />
              <p className="mt-1 text-small text-ink-60">
                Available topics: {topics.map((t) => t.slug).join(', ')}
              </p>
            </Field>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 h-fit">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            Change Password
          </h2>

          <form
            action={async (formData: FormData) => {
              'use server';
              await changePasswordAction(formData);
            }}
            className="mt-6 space-y-6"
          >
            <Field label="Current Password" htmlFor="currentPassword">
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="bg-cream"
              />
            </Field>

            <Field label="New Password (Min 6 characters)" htmlFor="newPassword">
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="bg-cream"
              />
            </Field>

            <Field label="Confirm New Password" htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="bg-cream"
              />
            </Field>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
