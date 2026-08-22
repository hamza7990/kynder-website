import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { updateCoachSelfProfileAction } from '@/lib/actions/coaches';
import { changePasswordAction } from '@/lib/actions/auth';
import { topics } from '@/data/topics';
import { getI18n } from '@/i18n/server';

export default async function CoachProfilePage() {
  const { t } = await getI18n();
  const session = await getSession();
  if (!session) return null;

  const coach = await db.user.findUnique({
    where: { id: session.id },
  });

  if (!coach) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('coachProfile.title')}
        description={t('coachProfile.description')}
        badge={t('coachProfile.badge')}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Profile Information */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            {t('coachProfile.professionalInfo')}
          </h2>

          <form
            action={async (formData: FormData) => {
              'use server';
              await updateCoachSelfProfileAction(formData);
            }}
            className="mt-6 space-y-6"
          >
            <Field label={t('coachProfile.fullName')} htmlFor="name">
              <Input
                id="name"
                name="name"
                defaultValue={coach.name}
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('coachProfile.emailReadonly')} htmlFor="email">
              <Input
                id="email"
                name="email"
                defaultValue={coach.email}
                disabled
                className="bg-cream opacity-70 cursor-not-allowed"
              />
            </Field>

            <Field label={t('coachProfile.title')} htmlFor="title">
              <Input
                id="title"
                name="title"
                defaultValue={coach.title || ''}
                placeholder={t('coachProfile.titlePlaceholder')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('coachProfile.avatarUrl')} htmlFor="avatar">
              <Input
                id="avatar"
                name="avatar"
                defaultValue={coach.avatar || ''}
                placeholder={t('coachProfile.avatarPlaceholder')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('coachProfile.bio')} htmlFor="bio">
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={coach.bio || ''}
                placeholder={t('coachProfile.bioPlaceholder')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('coachProfile.specialties')} htmlFor="specialties">
              <Input
                id="specialties"
                name="specialties"
                defaultValue={coach.specialties || ''}
                placeholder={t('coachProfile.specialtiesPlaceholder')}
                className="bg-cream"
              />
              <p className="mt-1 text-small text-ink-60">
                {t('coachProfile.availableTopics', { slugs: topics.map((tp) => tp.slug).join(', ') })}
              </p>
            </Field>

            <Button type="submit" variant="primary" size="md" className="w-full">
              {t('coachProfile.saveProfile')}
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 h-fit">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            {t('coachProfile.changePassword')}
          </h2>

          <form
            action={async (formData: FormData) => {
              'use server';
              await changePasswordAction(formData);
            }}
            className="mt-6 space-y-6"
          >
            <Field label={t('coachProfile.currentPassword')} htmlFor="currentPassword">
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('coachProfile.newPassword')} htmlFor="newPassword">
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('coachProfile.confirmPassword')} htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="bg-cream"
              />
            </Field>

            <Button type="submit" variant="primary" size="md" className="w-full">
              {t('coachProfile.updatePassword')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
