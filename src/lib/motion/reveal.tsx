'use client';

import { cn } from '@/lib/cn';
import { useReveal } from './useReveal';

export interface RevealProps {
  as?: React.ElementType;
  /** Stagger delay in milliseconds (use staggerDelay() for groups). */
  delay?: number;
  /**
   * Above-the-fold mode for LCP-critical content (e.g. the hero headline).
   * Keeps opacity at 1 at first paint and animates only the composited
   * translateY, so the element is painted immediately — the reveal never
   * delays Largest Contentful Paint. Off-screen content should NOT set this.
   */
  immediate?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Scroll-reveal wrapper: opacity 0→1 and translateY(16px)→0 — transform and
 * opacity only, so it can never cause layout shift. Under reduced motion it
 * renders in its final state (both via the hook and the motion-reduce classes,
 * so even pre-hydration the content is fully visible).
 *
 * With `immediate`, opacity is fixed at 1 (only the slide animates) so the LCP
 * element paints at first paint rather than after hydration + observer fire.
 */
export function Reveal({
  as: Component = 'div',
  delay = 0,
  immediate = false,
  className,
  children,
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  // Above-the-fold: render in the final resting state with no transform or
  // transition, so the LCP element paints at first paint. A CSS transition on a
  // transformed element can make Chrome defer the LCP paint to animation-end —
  // exactly what we must avoid for the hero headline.
  if (immediate) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={ref}
      data-reveal={isVisible ? 'visible' : 'hidden'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'motion-safe:transition-[transform,opacity] motion-safe:duration-slow motion-safe:ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        // Reduced motion → straight to final state, no transition.
        'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        className,
      )}
    >
      {children}
    </Component>
  );
}
