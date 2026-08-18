/**
 * Site navigation. Phase 1 routes are always present; Phase 2 routes exist in
 * the model but are gated behind `phase2Enabled` (default false) so they can be
 * enabled in one place when that work ships.
 */
export type NavPhase = 1 | 2;

export interface NavItem {
  label: string;
  href: string;
  phase: NavPhase;
}

/** Flip to true to surface Phase 2 routes in navigation. */
export const phase2Enabled = false;

const ALL_NAV_ITEMS: NavItem[] = [
  // Phase 1 — primary navigation
  { label: 'Leadership Questions', href: '/questions', phase: 1 },
  { label: 'Coaching Topics', href: '/topics', phase: 1 },
  { label: 'About', href: '/about', phase: 1 },
  { label: 'Contact', href: '/contact', phase: 1 },
  // Phase 2 (gated)
  { label: 'Programmes', href: '/programmes', phase: 2 },
  { label: 'Insights', href: '/insights', phase: 2 },
  { label: 'Corporate', href: '/corporate', phase: 2 },
];

/** Persistent primary call-to-action (wordmark handles Home). */
export const bookingCta = { label: 'Book a 1-on-1 Session', href: '/book' } as const;

/** Primary nav items visible given the current phase gate. */
export const nav: NavItem[] = ALL_NAV_ITEMS.filter(
  (item) => item.phase === 1 || phase2Enabled,
);

/** All items regardless of gate (e.g. for building the sitemap-aware router). */
export const allNavItems: NavItem[] = ALL_NAV_ITEMS;
