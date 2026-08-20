import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input } from '@/components/ui';
import { updateSiteSettingsAction } from '@/lib/actions/content';

export default async function AdminSettingsPage() {
  const settings = await db.siteSetting.findMany();
  const getSetting = (key: string, fallback: string = '') => {
    return settings.find((s) => s.key === key)?.value ?? fallback;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Site Settings & Global Config"
        description="Manage brand identity, contact information, social links, and integrations."
        badge="System Configuration"
      />

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
            1. Brand Identity
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Brand Name" htmlFor="site_name">
              <Input
                id="site_name"
                name="site_name"
                defaultValue={getSetting('site_name', 'KYNDER')}
                className="bg-cream"
              />
            </Field>

            <Field label="Tagline" htmlFor="site_tagline">
              <Input
                id="site_tagline"
                name="site_tagline"
                defaultValue={getSetting('site_tagline', 'Kind leadership is strong leadership.')}
                className="bg-cream"
              />
            </Field>
          </div>

          <Field label="Footer Copyright Line" htmlFor="site_copyright">
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
            2. Contact & Communications
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Primary Contact Email" htmlFor="contact_email">
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={getSetting('contact_email', '')}
                className="bg-cream"
              />
            </Field>

            <Field label="Contact Phone / WhatsApp" htmlFor="contact_phone">
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
            3. Social Channels
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="LinkedIn URL" htmlFor="social_linkedin">
              <Input
                id="social_linkedin"
                name="social_linkedin"
                defaultValue={getSetting('social_linkedin', '')}
                className="bg-cream"
              />
            </Field>

            <Field label="Instagram URL" htmlFor="social_instagram">
              <Input
                id="social_instagram"
                name="social_instagram"
                defaultValue={getSetting('social_instagram', '')}
                className="bg-cream"
              />
            </Field>

            <Field label="YouTube URL" htmlFor="social_youtube">
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
            4. Endpoints & Integrations
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Newsletter API Endpoint" htmlFor="newsletter_endpoint">
              <Input
                id="newsletter_endpoint"
                name="newsletter_endpoint"
                placeholder="https://api.mailerlite.com/... or Netlify function"
                defaultValue={getSetting('newsletter_endpoint', '')}
                className="bg-cream"
              />
            </Field>

            <Field label="External Scheduler URL (Optional embed)" htmlFor="scheduler_url">
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
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
