import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input } from '@/components/ui';
import {
  updateQuestionAction,
  createQuestionAction,
  deleteQuestionAction,
} from '@/lib/actions/cms';
import { pillars } from '@/data/questions';

export default async function AdminQuestionsPage() {
  const questionsList = await db.question.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-10">
      <PageHeader
        title="10 Leadership Questions CMS"
        description="Manage the core questions, leadership pillars, and the 5 actionable reflection steps for each question."
        badge="Curriculum & Content"
      />

      {/* Add New Question Section */}
      <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1">
        <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
          + Add New Question
        </h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createQuestionAction(formData);
          }}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Question Number" htmlFor="new_no">
              <Input
                id="new_no"
                name="no"
                placeholder="e.g. 11"
                required
                className="bg-cream"
              />
            </Field>

            <Field label="Leadership Pillar" htmlFor="new_pillar">
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

          <Field label="Question Text (Prompt for the leader)" htmlFor="new_question">
            <Input
              id="new_question"
              name="question"
              required
              placeholder="e.g. What conversation have I been avoiding?"
              className="bg-cream"
            />
          </Field>

          <div className="space-y-3">
            <label className="block font-sans text-small font-semibold uppercase tracking-eyebrow text-ink-70">
              5 Action Steps (Practical steps to work through)
            </label>
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <Input
                key={stepNum}
                name={`step${stepNum}`}
                placeholder={`Step ${stepNum}: Actionable step for the leader...`}
                className="bg-cream"
              />
            ))}
          </div>

          <Button type="submit" variant="primary" size="md">
            Publish Question
          </Button>
        </form>
      </div>

      {/* Existing Questions List */}
      <div className="space-y-6">
        <h2 className="font-display text-h3 font-bold text-navy-deep">
          Active Questions ({questionsList.length})
        </h2>

        <div className="space-y-6">
          {questionsList.map((q) => {
            let stepsArr: string[] = [];
            try {
              stepsArr = JSON.parse(q.steps);
            } catch {
              stepsArr = [];
            }

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
                    <span className="rounded-full bg-terracotta/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-terracotta-text">
                      {q.pillar}
                    </span>
                  </div>

                  <form
                    action={async () => {
                      'use server';
                      await deleteQuestionAction(q.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Delete
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
                      <Field label="Question" htmlFor={`q_${q.id}`}>
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
                      <Field label="Pillar" htmlFor={`p_${q.id}`}>
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
                    <label className="block text-xs font-semibold uppercase tracking-eyebrow text-ink-70">
                      5 Action Steps
                    </label>
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Input
                        key={idx}
                        name={`step${idx + 1}`}
                        defaultValue={stepsArr[idx] || ''}
                        placeholder={`Step ${idx + 1}...`}
                        className="bg-cream text-small"
                      />
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="ghost" size="sm">
                      💾 Save Changes to Q{q.no}
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
