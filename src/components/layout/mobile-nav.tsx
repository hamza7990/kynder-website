'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { TrackLink } from '@/components/analytics/track-link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { bookingCta, nav } from '@/data/nav';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Mobile navigation: a hamburger button + slide-in drawer. The drawer traps
 * focus while open, closes on Escape or overlay click, locks body scroll, and
 * returns focus to the trigger on close. Full parity with the desktop nav.
 */
export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);
  const panelId = useId();

  // Open: lock scroll, focus into the panel, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // The panel is a modal: make the dimmed background inert so it's removed from
    // the a11y tree (and so contrast tooling doesn't evaluate text under the scrim).
    const background = [document.getElementById('main'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el !== null,
    );
    background.forEach((el) => {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    });

    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      background.forEach((el) => {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      });
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Return focus to the trigger when the drawer closes (never on first mount).
  useEffect(() => {
    if (open) {
      hasOpened.current = true;
    } else if (hasOpened.current) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
        className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md text-navy-deep"
      >
        <HamburgerIcon open={open} />
      </button>

      {/* Overlay + panel. Kept mounted (inert when closed) so the slide animates.
          The viewport-sized container clips the off-canvas panel — no overflow. */}
      <div
        className={cn(
          'fixed inset-0 z-50 overflow-hidden md:hidden',
          open ? '' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 cursor-default bg-[var(--navy-deep-60)] transition-opacity duration-base ease-out',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          inert={!open}
          className={cn(
            'absolute right-0 top-0 flex h-full w-[min(320px,85vw)] flex-col gap-2 bg-cream p-6',
            'transition-transform duration-base ease-out motion-reduce:transition-none',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-h4 tracking-[0.04em] text-navy-deep">KYNDER</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md text-navy-deep"
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-4 flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-sm border-b border-ink-10 py-4 font-display text-h4 text-navy-deep transition-colors duration-fast ease-out hover:text-terracotta"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Booking CTA — last and most prominent. */}
          <TrackLink
            event="booking_cta_click"
            href={bookingCta.href}
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'mt-auto w-full')}
          >
            {bookingCta.label}
          </TrackLink>
        </div>
      </div>
    </div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return open ? (
    <CloseIcon />
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
