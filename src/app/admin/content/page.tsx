import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { updateSiteSettingsAction } from '@/lib/actions/content';

export default async function AdminContentPage() {
  const settings = await db.siteSetting.findMany();
  const getSetting = (key: string, fallback: string = '') => {
    return settings.find((s) => s.key === key)?.value ?? fallback;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Content & Settings"
        description="Modify website copy, hero headlines, proof points, and contact settings."
        badge="CMS Control"
      />

      <form
        action={async (formData: FormData) => {
          'use server';
          await updateSiteSettingsAction(formData);
        }}
        className="space-y-8"
      >
        {/* Section 1: Hero & Positioning */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            1. Hero & Positioning
          </h2>

          <Field label="Hero Eyebrow (Small text above headline)" htmlFor="hero_eyebrow">
            <Input
              id="hero_eyebrow"
              name="hero_eyebrow"
              defaultValue={getSetting('hero_eyebrow', 'Human-led leadership coaching')}
              className="bg-cream"
            />
          </Field>

          <Field label="Hero Headline" htmlFor="hero_headline">
            <Input
              id="hero_headline"
              name="hero_headline"
              defaultValue={getSetting('hero_headline', 'Leadership starts with self-awareness.')}
              className="bg-cream"
            />
          </Field>

          <Field label="Hero Lead Paragraph" htmlFor="hero_lead">
            <Textarea
              id="hero_lead"
              name="hero_lead"
              rows={3}
              defaultValue={getSetting(
                'hero_lead',
                'Kynder is a leadership development brand built around a simple idea: kind leadership is strong leadership. It offers real, human-led coaching with Dr. Shereen Williams, grounded in original doctoral research into what makes leaders effective across cultures.'
              )}
              className="bg-cream"
            />
          </Field>

          <Field label="Positioning Statement (Between Hero and Previews)" htmlFor="positioning_statement">
            <Input
              id="positioning_statement"
              name="positioning_statement"
              defaultValue={getSetting(
                'positioning_statement',
                "Sometimes people don't need more information — they need a safe space to think."
              )}
              className="bg-cream"
            />
          </Field>
        </div>

        {/* Section 2: Brand & Contact Info */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            2. Brand Identity & Contact
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Site Name" htmlFor="site_name">
              <Input
                id="site_name"
                name="site_name"
                defaultValue={getSetting('site_name', 'KYNDER')}
                className="bg-cream"
              />
            </Field>

            <Field label="Site Tagline" htmlFor="site_tagline">
              <Input
                id="site_tagline"
                name="site_tagline"
                defaultValue={getSetting('site_tagline', 'Kind leadership is strong leadership.')}
                className="bg-cream"
              />
            </Field>
          </div>

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

            <Field label="Copyright Line" htmlFor="site_copyright">
              <Input
                id="site_copyright"
                name="site_copyright"
                defaultValue={getSetting('site_copyright', '© 2025 KYNDER. All rights reserved.')}
                className="bg-cream"
              />
            </Field>
          </div>
        </div>

        {/* Section 3: Social Media Links */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            3. Social Media Links
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="LinkedIn Profile URL" htmlFor="social_linkedin">
              <Input
                id="social_linkedin"
                name="social_linkedin"
                placeholder="https://linkedin.com/in/..."
                defaultValue={getSetting('social_linkedin', '')}
                className="bg-cream"
              />
            </Field>

            <Field label="Instagram Profile URL" htmlFor="social_instagram">
              <Input
                id="social_instagram"
                name="social_instagram"
                placeholder="https://instagram.com/..."
                defaultValue={getSetting('social_instagram', '')}
                className="bg-cream"
              />
            </Field>

            <Field label="YouTube Channel URL" htmlFor="social_youtube">
              <Input
                id="social_youtube"
                name="social_youtube"
                placeholder="https://youtube.com/@..."
                defaultValue={getSetting('social_youtube', '')}
                className="bg-cream"
              />
            </Field>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="submit" variant="primary" size="md">
            Save All Content Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
