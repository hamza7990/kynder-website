// Small, dependency-free validation helpers for client-side form checks.

/** Pragmatic email check: a non-empty local part, an @, and a dotted domain. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}
