import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { updateSiteSettingsAction } from '@/lib/actions/content';
import { getI18n } from '@/i18n/server';

export default async function AdminAboutPage() {
  const { t } = await getI18n();
  const settings = await db.siteSetting.findMany();
  const getSetting = (key: string, fallback: string = '') => {
    return settings.find((s) => s.key === key)?.value ?? fallback;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('about.title')}
        description={t('about.description')}
        badge={t('about.badge')}
      />

      <form
        action={async (formData: FormData) => {
          'use server';
          await updateSiteSettingsAction(formData);
        }}
        className="space-y-8"
      >
        {/* Section 1: Headshot & Main Titles */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            1. {t('about.section1')}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label={t('about.heading')} htmlFor="about_heading">
              <Input
                id="about_heading"
                name="about_heading"
                defaultValue={getSetting('about_heading', 'Meet Dr Shereen Williams')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('about.portrait')} htmlFor="about_portrait">
              <Input
                id="about_portrait"
                name="about_portrait"
                defaultValue={getSetting('about_portrait', '/shereen-williams.jpg')}
                className="bg-cream"
              />
            </Field>
          </div>

          <Field label={t('about.intro')} htmlFor="about_intro">
            <Input
              id="about_intro"
              name="about_intro"
              defaultValue={getSetting(
                'about_intro',
                'Founder of KYNDER | ICF-Certified Coach | Human Leadership & Transformation Expert | Author | Speaker'
              )}
              className="bg-cream"
            />
          </Field>
        </div>

        {/* Section 2: Narrative Copy */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            2. {t('about.section2')}
          </h2>

          <Field label={t('about.bio')} htmlFor="about_bio">
            <Textarea
              id="about_bio"
              name="about_bio"
              rows={4}
              defaultValue={getSetting(
                'about_bio',
                "Dr Shereen Williams created KYNDER from a simple belief: sometimes people don't need more information — they need a safe space to think, talk things through and find their way forward. With more than 25 years of experience in leadership, organisational transformation, culture and change, Shereen has worked with people and organisations across Asia, Africa and the Middle East — from individuals taking their first steps into leadership to senior executives navigating complex transformation."
              )}
              className="bg-cream"
            />
          </Field>

          <Field label={t('about.story')} htmlFor="about_story">
            <Textarea
              id="about_story"
              name="about_story"
              rows={4}
              defaultValue={getSetting('about_story', '[PENDING: career story]')}
              className="bg-cream"
            />
          </Field>

          <Field label={t('about.credentials')} htmlFor="about_credentials">
            <Textarea
              id="about_credentials"
              name="about_credentials"
              rows={4}
              defaultValue={getSetting(
                'about_credentials',
                "As an ICF-certified coach, Shereen coaches people across all career stages — from students and emerging professionals to managers, senior leaders and C-suite executives. Her coaching provides a confidential space to think, reflect, challenge assumptions, build confidence, navigate difficult decisions and turn insight into action. Shereen holds a Professional Doctorate in Leadership & Cultural Transformation with Distinction and is the author of The Currency of Kindness. Her work explores the relationship between kindness, human behaviour, leadership and organisational performance. She is also Managing Director of the Global Kindness Institute across Asia, Africa and the Middle East and an international speaker."
              )}
              className="bg-cream"
            />
          </Field>
        </div>

        {/* Section 3: Proof Points */}
        <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
          <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
            3. {t('about.section3')}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label={t('about.stat1')} htmlFor="stat_1_val">
              <Input
                id="stat_1_val"
                name="stat_1_val"
                defaultValue={getSetting('stat_1_val', 'DProf')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('about.stat2')} htmlFor="stat_2_val">
              <Input
                id="stat_2_val"
                name="stat_2_val"
                defaultValue={getSetting('stat_2_val', '25+')}
                className="bg-cream"
              />
            </Field>

            <Field label={t('about.stat3')} htmlFor="stat_3_val">
              <Input
                id="stat_3_val"
                name="stat_3_val"
                defaultValue={getSetting('stat_3_val', '17+')}
                className="bg-cream"
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            {t('about.saveBio')}
          </Button>
        </div>
      </form>
    </div>
  );
}
