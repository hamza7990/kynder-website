import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScrolled } from './useScrolled';

describe('useScrolled', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers the scroll listener as passive', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    renderHook(() => useScrolled(10));

    const scrollCall = addSpy.mock.calls.find((call) => call[0] === 'scroll');
    expect(scrollCall).toBeTruthy();
    expect(scrollCall?.[2]).toMatchObject({ passive: true });
  });

  it('reports false when scrolled less than the threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    const { result } = renderHook(() => useScrolled(50));
    expect(result.current).toBe(false);
  });
});
