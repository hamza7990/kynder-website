import { headers } from 'next/headers';
import Link from 'next/link';
import { buttonVariants, Container } from '@/components/ui';
import { getPublicT } from '@/i18n/public/server';
import { isLocale } from '@/i18n/config';
import { localeHref } from '@/lib/i18n/locale-path';

/**
 * Locale-aware 404 for the public site (A2 Slice 4). not-found components do NOT
 * receive route params, so the locale is read from the `x-locale` header the
 * middleware sets from the URL prefix (absent → English). Chrome comes from the
 * public interface dictionary; the destination hrefs are locale-prefixed.
 *
 * NOTE: this is the A2 functional 404. Workstream C2 turns it into an illustrated
 * arrival moment — build that on top of this, not instead of it.
 */
export default async function LocaleNotFound() {
  const raw = (await headers()).get('x-locale');
  const locale = isLocale(raw) ? raw : 'en';
  const t = getPublicT(locale);

  const links = [
    { label: t('notFound.questionsLabel'), href: '/questions' },
    { label: t('notFound.bookLabel'), href: '/book' },
  ];

  return (
    <section className="py-section-lg">
      <Container>
        <div className="mx-auto flex max-w-[46rem] flex-col items-center gap-6 text-center">
          <span className="font-sans text-small font-semibold uppercase tracking-eyebrow text-navy">
            {t('notFound.code')}
          </span>
          <h1 className="font-display text-h2 tracking-display text-navy-deep md:text-display-2">
            {t('notFound.heading')}
          </h1>
          <p className="max-w-[54ch] text-lead text-ink-80">{t('notFound.body')}</p>
          <div className="mt-2 flex w-full flex-col gap-3 xs:w-auto xs:flex-row">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={localeHref(locale, link.href)}
                className={buttonVariants({ variant: i === 0 ? 'primary' : 'ghost', size: 'md' })}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
