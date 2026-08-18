'use client';

import { useEffect, useRef, useState } from 'react';
import { REVEAL_THRESHOLD, prefersReducedMotion } from './tokens';

/**
 * A SINGLE IntersectionObserver instance is shared by every useReveal on the
 * page. Elements register a one-shot callback; once an element intersects it
 * fires and is unobserved. When the registry empties the observer disconnects
 * itself, so nothing leaks.
 */
let sharedObserver: IntersectionObserver | null = null;
const registry = new Map<Element, () => void>();

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const onReveal = registry.get(entry.target);
        if (onReveal) {
          onReveal();
          stopObserving(entry.target); // fires once
        }
      }
    },
    { threshold: REVEAL_THRESHOLD },
  );
  return sharedObserver;
}

function startObserving(element: Element, onReveal: () => void): void {
  registry.set(element, onReveal);
  getObserver().observe(element);
}

function stopObserving(element: Element): void {
  if (!registry.has(element)) return;
  registry.delete(element);
  sharedObserver?.unobserve(element);
  if (registry.size === 0 && sharedObserver) {
    sharedObserver.disconnect();
    sharedObserver = null;
  }
}

export interface UseRevealResult<T extends Element> {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
}

/**
 * Reveal-on-scroll primitive. Returns a ref to attach and a `isVisible` flag
 * that flips true once (and stays true). Under reduced motion — or without
 * IntersectionObserver support — it reports visible immediately.
 */
export function useReveal<T extends Element = HTMLElement>(): UseRevealResult<T> {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    startObserving(element, () => setIsVisible(true));
    return () => stopObserving(element);
  }, []);

  return { ref, isVisible };
}
