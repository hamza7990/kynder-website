'use client';

import { useEffect, useState } from 'react';
import { book } from '@/data/book';
import { site } from '@/data/site';

const isPending = (value: string) => value.startsWith('[PENDING');

/** Panel shown while NEXT_PUBLIC_SCHEDULER_URL is unset — never a fake calendar. */
function NotConnected() {
  return (
    <div
      role="status"
      className="flex min-h-[28rem] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-ink-20 bg-cream-card p-8 text-center"
    >
      <p className="font-display text-h4 text-navy-deep">{book.scheduler.notConnectedTitle}</p>
      <p className="max-w-[40ch] text-body text-ink-70">{book.scheduler.notConnectedBody}</p>
    </div>
  );
}

/** The real embed. Lazy iframe with the topic passed as a prefill query param,
 *  a branded skeleton until it loads, and an email fallback after 8s. */
function Embed({ topicSlug }: { topicSlug: string | undefined }) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    if (state !== 'loading') return;
    const timer = window.setTimeout(() => setState((s) => (s === 'loading' ? 'failed' : s)), 8000);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === 'failed') {
    return (
      <div
        role="status"
        className="flex min-h-[28rem] flex-col items-center justify-center gap-3 rounded-lg border border-ink-20 bg-cream-card p-8 text-center"
      >
        <p className="font-display text-h4 text-navy-deep">{book.scheduler.fallbackTitle}</p>
        <p className="text-body text-ink-70">
          {book.scheduler.fallbackContactPrefix}{' '}
          <a
            href={`mailto:${site.contactEmail}`}
            className="focus-ring rounded-sm text-navy-deep underline transition-colors duration-fast ease-out hover:text-terracotta"
          >
            {site.contactEmail}
          </a>
        </p>
      </div>
    );
  }

  const base = site.schedulerBaseUrl;
  const src = topicSlug ? `${base}?topic=${encodeURIComponent(topicSlug)}` : base;

  return (
    <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-ink-10 bg-cream-card">
      {state === 'loading' ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-cream-card motion-reduce:animate-none"
        />
      ) : null}
      <iframe
        title={book.scheduler.regionLabel}
        src={src}
        loading="lazy"
        onLoad={() => setState('ready')}
        className="min-h-[28rem] w-full"
      />
    </div>
  );
}

export function SchedulerEmbed({ topicSlug }: { topicSlug?: string }) {
  return (
    <section aria-label={book.scheduler.regionLabel}>
      {isPending(site.schedulerBaseUrl) ? <NotConnected /> : <Embed topicSlug={topicSlug} />}
    </section>
  );
}
