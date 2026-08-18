/**
 * Motion tokens and the rules that enforce the KYNDER motion principles.
 *
 * Principles (enforced by the helpers here + the CSS in globals.css):
 *  - Animate only cheap, non-layout properties: transform, opacity and the
 *    colour family (color, background-color, border-color, fill, stroke,
 *    outline-color). Accordion grid-template-rows is the one sanctioned
 *    structural exception. Layout, box-shadow, filter and background-position
 *    are forbidden — see transitions.guard.test.ts for the enforced list.
 *  - Movement never exceeds REVEAL_DISTANCE (16px).
 *  - Stagger STAGGER_STEP ms between items, at most MAX_STAGGER items.
 *  - Nothing delays the readability of text.
 *  - Everything collapses to its final state under prefers-reduced-motion.
 */
export const REVEAL_DISTANCE = 16; // px — hard cap on movement
export const REVEAL_THRESHOLD = 0.15; // IntersectionObserver threshold
export const STAGGER_STEP = 70; // ms between staggered items (60–80 range)
export const MAX_STAGGER = 6; // never stagger more than 6 items in a group

/** Durations in ms, mirroring the CSS custom properties in tokens.css. */
export const DURATION = {
  fast: 160,
  base: 260,
  slow: 480,
  ambient: 14000,
} as const;

/** Ambient loop duration (14s) — decorative ripple motion only. */
export const AMBIENT_DURATION_MS = DURATION.ambient;

/** Stagger delay for an item at `index`, clamped so groups never exceed 6. */
export function staggerDelay(index: number): number {
  const clamped = Math.max(0, Math.min(index, MAX_STAGGER - 1));
  return clamped * STAGGER_STEP;
}

/** True when the user has requested reduced motion (SSR-safe). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
