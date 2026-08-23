/**
 * RTL LOGICAL-CSS GUARD (A2 Slice 5).
 *
 * The public site renders in both LTR (en) and RTL (ar). Direction-specific
 * physical utilities (`ml-/mr-`, `pl-/pr-`, `left-/right-`, `text-left/right`,
 * `border-l/r`, `rounded-l/r/...`, `space-x-`) do NOT flip for RTL and silently
 * break the Arabic layout. This test fails if any land in a public source file,
 * forcing the logical equivalent instead:
 *
 *   ml-/mr-  → ms-/me-        pl-/pr-        → ps-/pe-
 *   left-/right- → start-/end-    text-left/right → text-start/end
 *   border-l/r → border-s/e   rounded-l/r/tl/… → rounded-s/e/ss/…
 *   space-x-  → gap-* (or a logical inline utility)
 *
 * SCOPE: public surfaces only — `src/components` (minus the admin `dashboard/`
 * and `auth/` trees, which use the session locale, not the URL locale) and the
 * public `src/app/[locale]` route tree. Genuine, reviewed exceptions go in
 * ALLOW below with the exact token and the reason — nothing else is exempt.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

const SCAN_ROOTS = [
  join(ROOT, 'src', 'components'),
  join(ROOT, 'src', 'app', '[locale]'),
];

// Admin surfaces — different audience, session locale, not part of the RTL brand.
const EXCLUDE_DIRS = new Set(['dashboard', 'auth']);

const PATTERNS: RegExp[] = [
  /(?<![\w-])-?(?:ml|mr|pl|pr)-[a-z0-9./[\]%-]+/gi, // margin / padding left|right
  /(?<![\w-])-?(?:left|right)-[a-z0-9./[\]%-]+/gi, //  inset left|right
  /(?<![\w-])text-(?:left|right)(?![\w-])/gi, //        text alignment
  /(?<![\w-])border-[lr](?:-[a-z0-9]+)?(?![\w])/gi, //  side border (not border-lg — no such class)
  /(?<![\w-])rounded-(?:tl|tr|bl|br|l|r)(?:-[a-z0-9]+)?(?![\w])/gi, // corner radius (not rounded-lg)
  /(?<![\w-])space-x-[a-z0-9./[\]%-]+/gi, //            horizontal child spacing
];

/** Reviewed, intentional physical usages: file suffix + exact token + why. */
const ALLOW: { file: string; token: string; reason: string }[] = [
  {
    file: 'components/home/ripples.tsx',
    token: 'left-1/2',
    reason:
      'Decorative concentric rings are centred with the left-1/2 + -translate-x-1/2 idiom — symmetric, aria-hidden, and explicitly NOT mirrored in RTL (A2 Slice 5 exclusion).',
  },
];

function walk(dir: string): string[] {
  const out: string[] = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out; // a scan root may not exist yet — that's fine
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      out.push(...walk(join(dir, entry.name)));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

const files = SCAN_ROOTS.flatMap(walk);

function isAllowed(relFile: string, token: string): boolean {
  const norm = relFile.split(sep).join('/');
  return ALLOW.some((a) => norm.endsWith(a.file) && a.token === token);
}

describe('RTL logical-CSS guard — public components', () => {
  it('finds a non-trivial set of public source files to scan', () => {
    // A guard that silently scans nothing is worse than no guard.
    expect(files.length).toBeGreaterThan(20);
  });

  it('uses only logical (RTL-safe) inline utilities', () => {
    const violations: string[] = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const rel = relative(ROOT, file).split(sep).join('/');
      for (const re of PATTERNS) {
        for (const match of src.matchAll(re)) {
          const token = match[0];
          if (isAllowed(rel, token)) continue;
          const line = src.slice(0, match.index ?? 0).split('\n').length;
          violations.push(`${rel}:${line}  ${token}`);
        }
      }
    }
    expect(
      violations,
      `Physical left/right utilities found in public code — convert to logical equivalents:\n${violations.join('\n')}`,
    ).toEqual([]);
  });
});
