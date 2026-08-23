import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input } from '@/components/ui';
import {
  updateTopicAction,
  createTopicAction,
  deleteTopicAction,
} from '@/lib/actions/cms';
import { clusters } from '@/data/topics';
import { getI18n } from '@/i18n/server';

export default async function AdminTopicsPage() {
  const { t } = await getI18n();
  const topicsList = await db.topic.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('topics.title')}
        description={t('topics.description')}
        badge={t('topics.badge')}
      />

      {/* Add New Topic */}
      <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1">
        <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
          + {t('topics.addHeading')}
        </h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createTopicAction(formData);
          }}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label={t('topics.topicTitle')} htmlFor="new_title">
              <Input
                id="new_title"
                name="title"
                placeholder={t('topics.topicTitlePlaceholder')}
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('topics.slug')} htmlFor="new_slug">
              <Input
                id="new_slug"
                name="slug"
                placeholder={t('topics.slugPlaceholder')}
                required
                className="bg-cream"
              />
            </Field>

            <Field label={t('topics.cluster')} htmlFor="new_cluster">
              <select
                id="new_cluster"
                name="cluster"
                required
                className="w-full rounded-lg border border-ink-20 bg-cream p-3 text-body text-navy-deep focus:outline-none"
              >
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.id})
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t('topics.blurb')} htmlFor="new_blurb">
            <Input
              id="new_blurb"
              name="blurb"
              required
              placeholder={t('topics.blurbPlaceholder')}
              className="bg-cream"
            />
          </Field>

          <Button type="submit" variant="primary" size="md">
            {t('topics.create')}
          </Button>
        </form>
      </div>

      {/* Topics by Cluster */}
      <div className="space-y-8">
        {clusters.map((cluster) => {
          const clusterTopics = topicsList.filter((t) => t.cluster === cluster.id);

          return (
            <div key={cluster.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-ink-10 pb-2">
                <h3 className="font-display text-h3 font-bold text-navy-deep">
                  {cluster.label}
                </h3>
                <span className="rounded-full bg-ink-10 px-2.5 py-0.5 text-small font-semibold text-navy-deep">
                  {t('topics.clusterCount', { count: clusterTopics.length })}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {clusterTopics.map((topic) => {
                  const untranslated = !topic.titleAr && !topic.blurbAr;
                  return (
                  <div
                    key={topic.id}
                    className="rounded-xl border border-ink-10 bg-cream-card p-6 shadow-1 transition-colors hover:border-ink-20"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-ink-10 pb-3 mb-4">
                      <div>
                        <span className="text-small font-semibold text-terracotta-text">
                          /{topic.slug}
                        </span>
                        <h4 className="font-display text-h4 font-bold text-navy-deep">
                          {topic.title}
                        </h4>
                        {untranslated ? (
                          <span className="mt-1 inline-block rounded-full border border-ink-20 bg-cream px-2.5 py-0.5 text-small font-semibold text-ink-70">
                            {t('common.untranslated')}
                          </span>
                        ) : null}
                      </div>

                      <form
                        action={async () => {
                          'use server';
                          await deleteTopicAction(topic.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-danger-soft bg-danger-soft px-2.5 py-1 text-small font-semibold text-danger hover:border-danger transition-colors"
                        >
                          {t('common.delete')}
                        </button>
                      </form>
                    </div>

                    <form
                      action={async (formData: FormData) => {
                        'use server';
                        await updateTopicAction(topic.id, formData);
                      }}
                      className="space-y-3"
                    >
                      <Field label={t('topics.titleField')} htmlFor={`t_title_${topic.id}`}>
                        <Input
                          id={`t_title_${topic.id}`}
                          name="title"
                          defaultValue={topic.title}
                          required
                          className="bg-cream"
                        />
                      </Field>

                      <Field label={t('topics.blurbField')} htmlFor={`t_blurb_${topic.id}`}>
                        <Input
                          id={`t_blurb_${topic.id}`}
                          name="blurb"
                          defaultValue={topic.blurb}
                          required
                          className="bg-cream"
                        />
                      </Field>

                      <Field label={t('topics.cluster')} htmlFor={`t_cluster_${topic.id}`}>
                        <select
                          id={`t_cluster_${topic.id}`}
                          name="cluster"
                          defaultValue={topic.cluster}
                          className="w-full rounded-lg border border-ink-20 bg-cream p-2.5 text-small text-navy-deep focus:outline-none"
                        >
                          {clusters.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label} ({c.id})
                            </option>
                          ))}
                        </select>
                      </Field>

                      {/* Arabic (A3) — optional. Blank stays NULL; the public site
                          falls back to English and the badge flags it untranslated. */}
                      <div dir="rtl" className="space-y-3 rounded-lg border border-dashed border-ink-20 bg-cream/50 p-3">
                        <label className="block text-small font-semibold uppercase tracking-eyebrow text-ink-70">
                          {t('common.arabic')}
                        </label>
                        <Field label={t('topics.titleArField')} htmlFor={`t_titleAr_${topic.id}`}>
                          <Input
                            id={`t_titleAr_${topic.id}`}
                            name="titleAr"
                            lang="ar"
                            defaultValue={topic.titleAr ?? ''}
                            className="bg-cream font-arabic-body"
                          />
                        </Field>
                        <Field label={t('topics.blurbArField')} htmlFor={`t_blurbAr_${topic.id}`}>
                          <Input
                            id={`t_blurbAr_${topic.id}`}
                            name="blurbAr"
                            lang="ar"
                            defaultValue={topic.blurbAr ?? ''}
                            className="bg-cream font-arabic-body"
                          />
                        </Field>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button type="submit" variant="ghost" size="sm">
                          💾 {t('common.save')}
                        </Button>
                      </div>
                    </form>
                  </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
