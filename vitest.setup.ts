import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Provide a JWT secret so modules that import the auth/server-action chain (which
// now refuses to load without JWT_SECRET) can be imported in tests. DATABASE_URL
// is intentionally left unset: DB reads then fail fast and the content resolvers
// fall back to the static src/data copy — exactly the "DB unreachable" path.
process.env.JWT_SECRET ||= 'test-jwt-secret-not-for-production';

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
  return { Lora: loader, Inter: loader, IBM_Plex_Sans_Arabic: loader };
});

// Ensure the DOM is reset between tests.
afterEach(() => {
  cleanup();
});
