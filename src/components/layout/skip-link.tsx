'use client';

import { usePublicT } from '@/i18n/public/client';

/**
 * Skip-to-content link. Rendered as the FIRST focusable element on the page so
 * keyboard users can jump past the header straight into <main id="main">.
 *
 * Visually hidden (sr-only) until focused; on focus it becomes a clearly visible
 * pill in brand styling, pinned to the top reading-start corner above the fixed
 * header. Its target <main> carries tabIndex={-1} so activating this link moves
 * real focus there.
 *
 * `start-4` is the logical inline-start inset: top-left in LTR, top-right in RTL,
 * so the skip link always lands at the corner a keyboard user's eye starts from.
 */
export function SkipLink() {
  const t = usePublicT();
  return (
    <a
      href="#main"
      className={[
        'sr-only rounded-full bg-terracotta px-5 py-3 font-sans text-small font-semibold text-navy-deep',
        'focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60]',
        'focus:outline-none focus:ring-2 focus:ring-navy-deep focus:ring-offset-2 focus:ring-offset-cream',
      ].join(' ')}
    >
      {t('skip.toContent')}
    </a>
  );
}
