import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input } from '@/components/ui';
import { updateSiteSettingsAction } from '@/lib/actions/content';
import { getI18n } from '@/i18n/server';
import { LanguageSwitcher } from '@/components/dashboard/language-switcher';

export default async function AdminSettingsPage() {
  const { t, locale } = await getI18n();
  const settings = await db.siteSetting.findMany();
  const getSetting = (key: string, fallback: string = '') => {
    return settings.find((s) => s.key === key)?.value ?? fallback;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('settings.title')}
        description={t('settings.description')}
        badge={t('settings.badge')}
      />

      {/* Per-admin interface language. Saved to the user record, so it follows
          the account across devices — not a browser setting. */}
      <LanguageSwitcher currentLocale={locale} />

      <form
        action={async (formData: FormData) => {
          'use server';
          await updateSiteSettingsAction(formData);
        }}
        className="space-y-8"
      >
        {/* Brand & Identity */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            1. {t('settings.section1')}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label={t('settings.brandName')} htmlFor="site_name">
              <Input
                id="site_name"
                name="site_name"
                defaultValue={getSetting('site_name', 'KYNDER')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('settings.tagline')} htmlFor="site_tagline">
              <Input
                id="site_tagline"
                name="site_tagline"
                defaultValue={getSetting('site_tagline', 'Kind leadership is strong leadership.')}
                className="bg-cream"
              />
            </Field>
          </div>

          <Field label={t('settings.copyright')} htmlFor="site_copyright">
            <Input
              id="site_copyright"
              name="site_copyright"
              defaultValue={getSetting('site_copyright', '© 2025 KYNDER. All rights reserved.')}
              className="bg-cream"
            />
          </Field>
        </div>

        {/* Contact Information */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            2. {t('settings.section2')}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label={t('settings.contactEmail')} htmlFor="contact_email">
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={getSetting('contact_email', '')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('settings.contactPhone')} htmlFor="contact_phone">
              <Input
                id="contact_phone"
                name="contact_phone"
                placeholder="+44 7700 900000"
                defaultValue={getSetting('contact_phone', '')}
                className="bg-cream"
              />
            </Field>
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            3. {t('settings.section3')}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label={t('settings.linkedin')} htmlFor="social_linkedin">
              <Input
                id="social_linkedin"
                name="social_linkedin"
                defaultValue={getSetting('social_linkedin', '')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('settings.instagram')} htmlFor="social_instagram">
              <Input
                id="social_instagram"
                name="social_instagram"
                defaultValue={getSetting('social_instagram', '')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('settings.youtube')} htmlFor="social_youtube">
              <Input
                id="social_youtube"
                name="social_youtube"
                defaultValue={getSetting('social_youtube', '')}
                className="bg-cream"
              />
            </Field>
          </div>
        </div>

        {/* Integrations */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            4. {t('settings.section4')}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label={t('settings.newsletter')} htmlFor="newsletter_endpoint">
              <Input
                id="newsletter_endpoint"
                name="newsletter_endpoint"
                placeholder="https://api.mailerlite.com/... or Netlify function"
                defaultValue={getSetting('newsletter_endpoint', '')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('settings.scheduler')} htmlFor="scheduler_url">
              <Input
                id="scheduler_url"
                name="scheduler_url"
                placeholder="https://calendly.com/... or SavvyCal"
                defaultValue={getSetting('scheduler_url', '')}
                className="bg-cream"
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            {t('settings.saveSystem')}
          </Button>
        </div>
      </form>
    </div>
  );
}
