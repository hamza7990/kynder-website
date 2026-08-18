import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useReveal } from './useReveal';

/** Minimal IntersectionObserver mock that records lifecycle calls. */
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly callback: IntersectionObserverCallback;
  readonly observed = new Set<Element>();
  root = null;
  rootMargin = '';
  thresholds: number[] = [];
  observe = vi.fn((el: Element) => this.observed.add(el));
  unobserve = vi.fn((el: Element) => this.observed.delete(el));
  disconnect = vi.fn(() => this.observed.clear());
  takeRecords = () => [] as IntersectionObserverEntry[];

  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
    MockIntersectionObserver.instances.push(this);
  }

  fire(el: Element, isIntersecting: boolean) {
    act(() => {
      this.callback([{ target: el, isIntersecting } as IntersectionObserverEntry], this);
    });
  }
}

function Probe() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  return <div ref={ref} data-testid="probe" data-visible={isVisible ? 'yes' : 'no'} />;
}

describe('useReveal', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('observes on mount and disconnects the shared observer on unmount', () => {
    const { unmount } = render(<Probe />);
    const io = MockIntersectionObserver.instances[0];
    expect(io).toBeDefined();
    expect(io!.observe).toHaveBeenCalledTimes(1);

    unmount();
    expect(io!.unobserve).toHaveBeenCalledTimes(1);
    // Registry is now empty, so the shared observer disconnects itself.
    expect(io!.disconnect).toHaveBeenCalledTimes(1);
  });

  it('shares one observer instance across multiple elements', () => {
    render(
      <>
        <Probe />
        <Probe />
        <Probe />
      </>,
    );
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(MockIntersectionObserver.instances[0]!.observe).toHaveBeenCalledTimes(3);
  });

  it('flips visible once on intersection, then unobserves that element', () => {
    render(<Probe />);
    const io = MockIntersectionObserver.instances[0]!;
    const el = [...io.observed][0]!;

    expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'no');
    io.fire(el, true);
    expect(screen.getByTestId('probe')).toHaveAttribute('data-visible', 'yes');
    expect(io.unobserve).toHaveBeenCalledWith(el);
  });
});
