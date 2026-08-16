import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge needs to know our custom font-size scale, otherwise it can't
 * distinguish size utilities (e.g. `text-body`) from colour utilities
 * (e.g. `text-cream`) — they share the `text-` prefix — and wrongly drops the
 * colour when both are present.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display-1', 'display-2', 'h2', 'h3', 'h4', 'lead', 'body', 'small'] },
      ],
    },
  },
});

/** Merge conditional class names, de-duplicating conflicting Tailwind classes. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
