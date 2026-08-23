'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';
import { localeFromPathname, switchLocalePath } from '@/lib/i18n/locale-path';
import { cn } from '@/lib/cn';

// Autonyms shown in each language's own script. Codes are Western letters; no
// digits are involved, so the "Western digits" rule is unaffected.
const SHORT: Record<string, string> = { en: 'EN', ar: 'ع' };
const NAME: Record<string, string> = { en: 'English', ar: 'العربية' };

/**
 * Public language switcher (A2). Renders one link per locale that keeps the user
 * on the same page in the other language. The active locale is marked and not a
 * link target. Distinct from the admin dashboard's account-locale switcher.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() ?? '/';
  const current = localeFromPathname(pathname);

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn('flex items-center gap-1 text-small font-medium', className)}
    >
      {locales.map((loc) => {
        const active = loc === current;
        return (
          <Link
            key={loc}
            href={switchLocalePath(pathname, loc)}
            hrefLang={loc}
            lang={loc}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'focus-ring rounded-sm px-2 py-1 transition-colors duration-fast ease-out',
              active ? 'text-navy-deep' : 'text-ink-60 hover:text-terracotta',
            )}
          >
            <span className="sr-only">{NAME[loc]}</span>
            <span aria-hidden="true">{SHORT[loc]}</span>
          </Link>
        );
      })}
    </div>
  );
}
