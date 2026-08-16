import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// next/font relies on the Next.js build transform, which Vitest doesn't run.
// Mock the loaders so components importing fonts render in the test environment.
// NB: mock each loader explicitly — a Proxy that returns a function for every
// key (incl. `then`) makes the module thenable and hangs the import.
vi.mock('next/font/google', () => {
  const loader = () => ({
    className: 'font-mock',
    variable: '--font-mock',
    style: { fontFamily: 'mock' },
  });
  return { Lora: loader, Inter: loader };
});

// Ensure the DOM is reset between tests.
afterEach(() => {
  cleanup();
});
