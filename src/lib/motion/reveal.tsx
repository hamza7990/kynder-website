'use client';

import { cn } from '@/lib/cn';
import { useReveal } from './useReveal';

export interface RevealProps {
  as?: React.ElementType;
  /** Stagger delay in milliseconds (use staggerDelay() for groups). */
  delay?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Scroll-reveal wrapper: opacity 0→1 and translateY(16px)→0 — transform and
 * opacity only, so it can never cause layout shift. Under reduced motion it
 * renders in its final state (both via the hook and the motion-reduce classes,
 * so even pre-hydration the content is fully visible).
 */
export function Reveal({ as: Component = 'div', delay = 0, className, children }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();

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
