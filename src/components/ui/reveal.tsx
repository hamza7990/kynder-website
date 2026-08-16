'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export interface RevealProps {
  as?: React.ElementType;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** Reveal only once (default) or re-trigger when scrolled away. */
  once?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Reveal({
  as: Component = 'div',
  delay = 0,
  once = true,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion or no IntersectionObserver → show immediately.
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Component
      ref={ref}
      data-reveal={visible ? 'visible' : 'hidden'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'transition-[opacity,transform] duration-slow ease-out motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </Component>
  );
}
