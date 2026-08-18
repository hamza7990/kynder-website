import { AMBIENT_DURATION_MS } from './tokens';

/**
 * Ambient motion for decorative ripple elements — a very slow (14s+) transform
 * loop defined by `.animate-ambient` in globals.css. It animates transform only
 * and is paused entirely under prefers-reduced-motion (handled in CSS).
 *
 * Use on purely decorative, aria-hidden elements. Never wrap text in it.
 */
export const AMBIENT_CLASS = 'animate-ambient';

/**
 * Props for a decorative ambient element. `delayMs` offsets the loop so
 * multiple ripples don't move in lockstep.
 */
export function ambient(delayMs = 0): { className: string; style?: React.CSSProperties } {
  return {
    className: AMBIENT_CLASS,
    style: delayMs ? { animationDelay: `${delayMs}ms` } : undefined,
  };
}

export { AMBIENT_DURATION_MS };
