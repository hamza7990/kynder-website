import { PageHeader } from '@/components/dashboard/page-header';
import { getContactMessages, markContactMessageHandledAction } from '@/lib/actions/contact';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Messages"
        description="Messages submitted through the public contact form."
        badge="Inbox"
      />

      {messages.length === 0 ? (
        <p className="rounded-2xl border border-ink-10 bg-cream-card p-8 text-center text-body text-ink-60">
          No messages yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-ink-10 bg-cream-card p-6 shadow-1"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-navy-deep">{m.name}</span>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-small text-terracotta-text hover:underline"
                    >
                      {m.email}
                    </a>
                    {m.handled && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-small font-semibold text-green-800">
                        Handled
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-small text-ink-60">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>

                <form
                  action={async () => {
                    'use server';
                    await markContactMessageHandledAction(m.id, !m.handled);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-small font-semibold text-navy-deep transition-colors hover:bg-cream-card"
                  >
                    {m.handled ? 'Mark unhandled' : 'Mark handled'}
                  </button>
                </form>
              </div>

              <p className="mt-4 whitespace-pre-wrap border-t border-ink-10 pt-4 text-body text-ink-80">
                {m.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
