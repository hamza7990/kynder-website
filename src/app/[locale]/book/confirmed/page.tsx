import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants, Container } from '@/components/ui';
import { book } from '@/data/book';
import { isLocale } from '@/i18n/config';
import { localeHref } from '@/lib/i18n/locale-path';

export const metadata: Metadata = {
  title: book.confirmed.heading,
  robots: { index: false, follow: false },
};

export default async function BookingConfirmedPage({
  params,
}: {
  params?: Promise<{ locale: string }>;
} = {}) {
  const resolved = params ? await params : { locale: 'en' };
  const locale = isLocale(resolved.locale) ? resolved.locale : 'en';
  return (
    <section className="py-section-lg">
      <Container>
        <div className="mx-auto flex max-w-[46rem] flex-col items-center gap-6 text-center">
          <h1 className="font-display text-h2 tracking-display text-navy-deep md:text-display-2">
            {book.confirmed.heading}
          </h1>
          <p className="max-w-[54ch] text-lead text-ink-80">{book.confirmed.body}</p>
          <Link href={localeHref(locale, '/questions')} className={buttonVariants({ variant: 'primary', size: 'md' })}>
            {book.confirmed.cta}
          </Link>
        </div>
      </Container>
    </section>
  );
}
