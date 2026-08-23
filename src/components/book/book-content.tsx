'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { buttonVariants } from '@/components/ui';
import { book } from '@/data/book';
import { site } from '@/data/site';
import { topics } from '@/data/topics';
import type { Locale } from '@/i18n/config';
import { localeFromPathname, localeHref } from '@/lib/i18n/locale-path';
import { usePublicT } from '@/i18n/public/client';
import { SchedulerEmbed } from './scheduler-embed';
import { DirectBookingForm } from './direct-booking-form';

const isPending = (value: string) => value.startsWith('[PENDING');

function NoTopic({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto flex max-w-[46rem] flex-col items-center gap-6 rounded-lg border border-ink-10 bg-cream-card p-10 text-center">
      <h2 className="font-display text-h3 text-navy-deep">{book.noTopic.title}</h2>
      <p className="max-w-[46ch] text-body text-ink-70">{book.noTopic.body}</p>
      <Link href={localeHref(locale, '/topics')} className={buttonVariants({ variant: 'primary', size: 'md' })}>
        {book.noTopic.cta}
      </Link>
    </div>
  );
}

export function BookContent() {
  const t = usePublicT();
  const params = useSearchParams();
  // Client-side: the URL's own first segment is the source of truth for locale.
  const locale = localeFromPathname(usePathname());
  const slug = params.get('topic') ?? undefined;
  const topic = slug ? topics.find((t) => t.slug === slug) : undefined;

  // Missing or invalid ?topic= → a clear prompt, never a crash or blank panel.
  if (!topic) {
    return <NoTopic locale={locale} />;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-2">
          <span className="font-sans text-small font-semibold uppercase tracking-eyebrow text-navy">
            {t('booking.selectedTopicLabel')}
          </span>
          <h2 className="font-display text-h3 text-navy-deep">{topic.title}</h2>
          <p className="text-body text-ink-70">{topic.blurb}</p>
          <Link
            href={localeHref(locale, '/topics')}
            className="focus-ring rounded-sm text-small font-semibold text-navy-deep underline transition-colors duration-fast ease-out hover:text-terracotta"
          >
            {t('booking.changeTopicLabel')}
          </Link>
        </div>

        <dl className="flex flex-col gap-5 border-t border-ink-10 pt-6">
          {book.details.map((detail) => (
            <div key={detail.label} className="flex flex-col gap-1">
              <dt className="font-sans text-small font-semibold text-navy-deep">{detail.label}</dt>
              <dd className="text-body text-ink-70">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Direct booking saves to the database and is the active path. Once an
          external scheduler URL is configured, the embed takes over instead. */}
      {isPending(site.schedulerBaseUrl) ? (
        <DirectBookingForm topicSlug={topic.slug} topicTitle={topic.title} />
      ) : (
        <SchedulerEmbed topicSlug={topic.slug} />
      )}
    </div>
  );
}
