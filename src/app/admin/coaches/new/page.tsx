import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { createCoachAction } from '@/lib/actions/coaches';
import { topics } from '@/data/topics';
import { getI18n } from '@/i18n/server';

export default async function NewCoachPage() {
  const { t } = await getI18n();
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('coachForm.newTitle')}
        description={t('coachForm.newDescription')}
        badge={t('coachForm.newBadge')}
      >
        <Link
          href="/admin/coaches"
          className="rounded-lg border border-ink-20 bg-cream px-4 py-2 text-small font-semibold text-navy-deep hover:bg-cream-card"
        >
          <span className="dir-flip">←</span> {t('coachForm.backToRoster')}
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
          <Field label={t('coachForm.fullName')} htmlFor="name">
            <Input
              id="name"
              name="name"
              required
              placeholder={t('coachForm.fullNamePlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Field label={t('coachForm.email')} htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t('coachForm.emailPlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Field label={t('coachForm.tempPassword')} htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder={t('coachForm.tempPasswordPlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Field label={t('coachForm.title')} htmlFor="title">
            <Input
              id="title"
              name="title"
              placeholder={t('coachForm.titlePlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Field label={t('coachForm.avatarUrl')} htmlFor="avatar">
            <Input
              id="avatar"
              name="avatar"
              placeholder={t('coachForm.avatarUrlPlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Field label={t('coachForm.bio')} htmlFor="bio">
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder={t('coachForm.bioPlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Field label={t('coachForm.specialties')} htmlFor="specialties">
            <Input
              id="specialties"
              name="specialties"
              placeholder={t('coachForm.specialtiesPlaceholder')}
              className="bg-cream"
            />
            <p className="mt-2 text-small text-ink-60">
              {t('coachForm.availableTopics', { slugs: topics.map((tp) => tp.slug).join(', ') })}
            </p>
          </Field>

          <div className="flex justify-end gap-4 border-t border-ink-10 pt-6">
            <Link
              href="/admin/coaches"
              className="rounded-lg border border-ink-20 px-6 py-2.5 text-body font-semibold text-ink-70 hover:bg-cream"
            >
              {t('coachForm.cancel')}
            </Link>
            <Button type="submit" variant="primary" size="md">
              {t('coachForm.createAccount')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
