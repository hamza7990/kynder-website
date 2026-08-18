'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the page has scrolled past `threshold` px — used to drive the
 * compact header state. The scroll listener is passive and rAF-throttled so it
 * never blocks scrolling or fires more than once per frame.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    let ticking = false;

    const update = () => {
      setScrolled(window.scrollY > threshold);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = window.requestAnimationFrame(update);
    };

    update(); // set initial state
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
