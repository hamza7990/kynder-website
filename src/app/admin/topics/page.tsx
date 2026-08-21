import { db } from '@/lib/db';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button, Field, Input } from '@/components/ui';
import {
  updateTopicAction,
  createTopicAction,
  deleteTopicAction,
} from '@/lib/actions/cms';
import { clusters } from '@/data/topics';

export default async function AdminTopicsPage() {
  const topicsList = await db.topic.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-10">
      <PageHeader
        title="15 Coaching Topics CMS"
        description="Edit existing coaching topics, create new specializations, and organize them into clusters."
        badge="Topics & Services"
      />

      {/* Add New Topic */}
      <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1">
        <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
          + Add New Coaching Topic
        </h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createTopicAction(formData);
          }}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Topic Title" htmlFor="new_title">
              <Input
                id="new_title"
                name="title"
                placeholder="e.g. Navigating Team Restructuring"
                required
                className="bg-cream"
              />
            </Field>

            <Field label="URL Slug" htmlFor="new_slug">
              <Input
                id="new_slug"
                name="slug"
                placeholder="e.g. navigating-team-restructuring"
                required
                className="bg-cream"
              />
            </Field>

            <Field label="Cluster Category" htmlFor="new_cluster">
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

          <Field label="Short Blurb / Subtitle (The outcome for the leader)" htmlFor="new_blurb">
            <Input
              id="new_blurb"
              name="blurb"
              required
              placeholder="e.g. lead effectively during organisational transitions"
              className="bg-cream"
            />
          </Field>

          <Button type="submit" variant="primary" size="md">
            Create Topic
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
                  {clusterTopics.length} topics
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {clusterTopics.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-ink-10 bg-cream-card p-6 shadow-1 transition-colors hover:border-ink-20"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-ink-10 pb-3 mb-4">
                      <div>
                        <span className="text-small font-semibold text-terracotta-text">
                          /{t.slug}
                        </span>
                        <h4 className="font-display text-h4 font-bold text-navy-deep">
                          {t.title}
                        </h4>
                      </div>

                      <form
                        action={async () => {
                          'use server';
                          await deleteTopicAction(t.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-danger-soft bg-danger-soft px-2.5 py-1 text-small font-semibold text-danger hover:border-danger transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>

                    <form
                      action={async (formData: FormData) => {
                        'use server';
                        await updateTopicAction(t.id, formData);
                      }}
                      className="space-y-3"
                    >
                      <Field label="Title" htmlFor={`t_title_${t.id}`}>
                        <Input
                          id={`t_title_${t.id}`}
                          name="title"
                          defaultValue={t.title}
                          required
                          className="bg-cream"
                        />
                      </Field>

                      <Field label="Blurb" htmlFor={`t_blurb_${t.id}`}>
                        <Input
                          id={`t_blurb_${t.id}`}
                          name="blurb"
                          defaultValue={t.blurb}
                          required
                          className="bg-cream"
                        />
                      </Field>

                      <Field label="Cluster Category" htmlFor={`t_cluster_${t.id}`}>
                        <select
                          id={`t_cluster_${t.id}`}
                          name="cluster"
                          defaultValue={t.cluster}
                          className="w-full rounded-lg border border-ink-20 bg-cream p-2.5 text-small text-navy-deep focus:outline-none"
                        >
                          {clusters.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label} ({c.id})
                            </option>
                          ))}
                        </select>
                      </Field>

                      <div className="flex justify-end pt-2">
                        <Button type="submit" variant="ghost" size="sm">
                          💾 Save
                        </Button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
