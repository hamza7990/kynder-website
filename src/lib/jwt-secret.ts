/**
 * Edge-safe JWT secret loader.
 *
 * JWT_SECRET is required and has NO default. If it is unset the app fails loudly
 * the first time this module is imported (at server/edge startup and in the
 * middleware) rather than silently signing sessions with a known key.
 *
 * This module intentionally has no Node-only dependencies so it can be imported
 * from the edge middleware as well as the Node server runtime.
 */
const secret = process.env.JWT_SECRET;

if (!secret || secret.trim().length === 0) {
  throw new Error(
    'JWT_SECRET is not set. Refusing to start with an insecure default. ' +
      'Set JWT_SECRET to a long random string (e.g. `openssl rand -base64 48`).',
  );
}

export const JWT_SECRET = new TextEncoder().encode(secret);
