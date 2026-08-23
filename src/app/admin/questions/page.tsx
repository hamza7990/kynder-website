import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input } from '@/components/ui';
import {
  updateQuestionAction,
  createQuestionAction,
  deleteQuestionAction,
} from '@/lib/actions/cms';
import { pillars } from '@/data/questions';
import { getI18n } from '@/i18n/server';

export default async function AdminQuestionsPage() {
  const { t } = await getI18n();
  const questionsList = await db.question.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('questions.title')}
        description={t('questions.description')}
        badge={t('questions.badge')}
      />

      {/* Add New Question Section */}
      <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1">
        <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
          + {t('questions.addHeading')}
        </h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createQuestionAction(formData);
          }}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label={t('questions.number')} htmlFor="new_no">
              <Input
                id="new_no"
                name="no"
                placeholder={t('questions.numberPlaceholder')}
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('questions.pillar')} htmlFor="new_pillar">
              <select
                id="new_pillar"
                name="pillar"
                required
                className="w-full rounded-lg border border-ink-20 bg-cream p-3 text-body text-navy-deep focus:outline-none focus:ring-1 focus:ring-terracotta"
              >
                {pillars.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t('questions.questionText')} htmlFor="new_question">
            <Input
              id="new_question"
              name="question"
              required
              placeholder={t('questions.questionTextPlaceholder')}
              className="bg-cream"
            />
          </Field>

          <div className="space-y-3">
            <label className="block font-sans text-small font-semibold uppercase tracking-eyebrow text-ink-70">
              {t('questions.stepsLabel')}
            </label>
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <Input
                key={stepNum}
                name={`step${stepNum}`}
                placeholder={t('questions.stepPlaceholder', { n: stepNum })}
                className="bg-cream"
              />
            ))}
          </div>

          <Button type="submit" variant="primary" size="md">
            {t('questions.publish')}
          </Button>
        </form>
      </div>

      {/* Existing Questions List */}
      <div className="space-y-6">
        <h2 className="font-display text-h3 font-bold text-navy-deep">
          {t('questions.activeHeading', { count: questionsList.length })}
        </h2>

        <div className="space-y-6">
          {questionsList.map((q) => {
            let stepsArr: string[] = [];
            try {
              stepsArr = JSON.parse(q.steps);
            } catch {
              stepsArr = [];
            }
            let stepsArArr: string[] = [];
            try {
              stepsArArr = q.stepsAr ? JSON.parse(q.stepsAr) : [];
            } catch {
              stepsArArr = [];
            }
            // "Untranslated" = no Arabic authored yet for either field.
            const untranslated = !q.questionAr && stepsArArr.length === 0;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-ink-10 bg-cream-card p-6 shadow-1 transition-colors hover:border-ink-20"
              >
                <div className="flex items-center justify-between border-b border-ink-10 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-deep font-display font-bold text-cream text-sm">
                      {q.no}
                    </span>
                    <span className="rounded-full bg-terracotta-soft px-3 py-0.5 text-small font-semibold uppercase tracking-wider text-terracotta-text">
                      {q.pillar}
                    </span>
                    {untranslated ? (
                      <span className="rounded-full border border-ink-20 bg-cream px-3 py-0.5 text-small font-semibold text-ink-70">
                        {t('common.untranslated')}
                      </span>
                    ) : null}
                  </div>

                  <form
                    action={async () => {
                      'use server';
                      await deleteQuestionAction(q.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-danger-soft bg-danger-soft px-3 py-1 text-small font-semibold text-danger hover:border-danger transition-colors"
                    >
                      {t('common.delete')}
                    </button>
                  </form>
                </div>

                <form
                  action={async (formData: FormData) => {
                    'use server';
                    await updateQuestionAction(q.id, formData);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="md:col-span-3">
                      <Field label={t('questions.question')} htmlFor={`q_${q.id}`}>
                        <Input
                          id={`q_${q.id}`}
                          name="question"
                          defaultValue={q.question}
                          required
                          className="bg-cream font-medium"
                        />
                      </Field>
                    </div>

                    <div>
                      <Field label={t('questions.pillarShort')} htmlFor={`p_${q.id}`}>
                        <select
                          id={`p_${q.id}`}
                          name="pillar"
                          defaultValue={q.pillar}
                          className="w-full rounded-lg border border-ink-20 bg-cream p-3 text-small text-navy-deep focus:outline-none"
                        >
                          {pillars.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-small font-semibold uppercase tracking-eyebrow text-ink-70">
                      {t('questions.stepsShort')}
                    </label>
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Input
                        key={idx}
                        name={`step${idx + 1}`}
                        defaultValue={stepsArr[idx] || ''}
                        placeholder={t('questions.stepShortPlaceholder', { n: idx + 1 })}
                        className="bg-cream text-small"
                      />
                    ))}
                  </div>

                  {/* Arabic (A3) — optional. Blank stays NULL and the public site
                      falls back to English; the badge above flags it untranslated. */}
                  <div dir="rtl" className="space-y-2 rounded-lg border border-dashed border-ink-20 bg-cream/50 p-3">
                    <label className="block text-small font-semibold uppercase tracking-eyebrow text-ink-70">
                      {t('common.arabic')}
                    </label>
                    <Field label={t('questions.questionArField')} htmlFor={`qar_${q.id}`}>
                      <Input
                        id={`qar_${q.id}`}
                        name="questionAr"
                        lang="ar"
                        defaultValue={q.questionAr ?? ''}
                        placeholder={t('questions.questionArPlaceholder')}
                        className="bg-cream font-arabic-body text-small"
                      />
                    </Field>
                    <label className="block pt-1 text-small font-semibold uppercase tracking-eyebrow text-ink-70">
                      {t('questions.stepsArShort')}
                    </label>
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Input
                        key={idx}
                        name={`stepAr${idx + 1}`}
                        lang="ar"
                        defaultValue={stepsArArr[idx] || ''}
                        placeholder={t('questions.stepArPlaceholder', { n: idx + 1 })}
                        className="bg-cream font-arabic-body text-small"
                      />
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="ghost" size="sm">
                      💾 {t('questions.saveTo', { no: q.no })}
                    </Button>
                  </div>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
