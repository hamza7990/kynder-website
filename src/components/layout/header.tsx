'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useScrolled } from '@/lib/motion';
import { bookingCta } from '@/data/nav';
import { MobileNav } from './mobile-nav';
import { Nav } from './nav';

export function Header() {
  const scrolled = useScrolled(40);

  return (
    <>
      <header
        data-state={scrolled ? 'compact' : 'top'}
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b',
          // Only colour/border animate (260ms). Height changes via tokens, never
          // a transitioned property.
          'transition-[background-color,border-color] duration-base ease-out',
          scrolled ? 'border-ink-10 bg-cream' : 'border-transparent bg-transparent',
        )}
      >
        <div
          className={cn(
            'container-kynder flex items-center justify-between',
            scrolled ? 'h-16' : 'h-20',
          )}
        >
          <Link
            href="/"
            className="focus-ring rounded-sm font-display text-h4 font-semibold tracking-[0.04em] text-navy-deep"
          >
            KYNDER
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Nav />
            <Link href={bookingCta.href} className={buttonVariants({ variant: 'primary', size: 'sm' })}>
              {bookingCta.label}
            </Link>
          </div>

          <MobileNav className="md:hidden" />
        </div>
      </header>

      {/* Reserve the expanded header height so it never overlaps content. */}
      <div aria-hidden="true" className="h-20" />
    </>
  );
}
