import { ambient } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * Decorative concentric ripples — the brand's core visual personality. Purely
 * decorative (aria-hidden), transform-only via the Phase 4 ambient utility, and
 * paused under prefers-reduced-motion (handled in globals.css).
 *
 * They stay VISIBLE on mobile in a simplified form (smaller rings, no removal):
 * the old mockup deleted them below 860px, which stripped the brand from the
 * primary device. Sizes step up from the `xs` breakpoint; nothing is display:none.
 */
const RINGS = [
  { base: 'h-[260px] w-[260px]', up: 'xs:h-[440px] xs:w-[440px]', color: 'border-terracotta-soft', delay: 0 },
  { base: 'h-[400px] w-[400px]', up: 'xs:h-[660px] xs:w-[660px]', color: 'border-gold-soft', delay: 1800 },
  { base: 'h-[540px] w-[540px]', up: 'xs:h-[880px] xs:w-[880px]', color: 'border-terracotta-soft', delay: 3600 },
  { base: 'h-[680px] w-[680px]', up: 'xs:h-[1100px] xs:w-[1100px]', color: 'border-gold-soft', delay: 5400 },
];

export function Ripples({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-decor="ripples"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {RINGS.map((ring, i) => {
        const a = ambient(ring.delay);
        return (
          <div
            key={i}
            style={a.style}
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border',
              ring.base,
              ring.up,
              ring.color,
              a.className,
            )}
          />
        );
      })}
    </div>
  );
}
