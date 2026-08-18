import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Enforces the motion principle: transitions must never animate a property that
 * triggers layout or expensive paint. Colour-family transitions ARE allowed
 * (they're core to the brand feel); box-shadow, filter and layout props are not.
 *
 * Fails on e.g. `transition-[height]`, `transition-[box-shadow]`,
 * `transition-shadow`, `transition-all`. Passes on `transition-colors`,
 * `transition-[background-color]`, `transition-[transform,opacity]`.
 */
const FORBIDDEN_PROPS = new Set([
  'height',
  'width',
  'min-height',
  'max-height',
  'min-width',
  'max-width',
  'top',
  'right',
  'bottom',
  'left',
  'margin',
  'padding',
  'box-shadow',
  'filter',
  'backdrop-filter',
  'background-position',
]);

// `transition-all` transitions every property (incl. layout); `transition-shadow`
// transitions box-shadow. Both are forbidden.
const FORBIDDEN_NAMED = /\btransition-(all|shadow)\b/;
const ARBITRARY = /transition-\[([^\]]+)\]/g;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

describe('transitions never animate layout or expensive-paint properties', () => {
  const files = walk(join(process.cwd(), 'src')).filter(
    (f) => /\.(ts|tsx)$/.test(f) && !/\.(test|spec)\.[tj]sx?$/.test(f),
  );

  it.each(files)('%s uses no forbidden transition properties', (file) => {
    const contents = readFileSync(file, 'utf8');
    const offenders: string[] = [];

    contents.split('\n').forEach((line, i) => {
      if (FORBIDDEN_NAMED.test(line)) {
        offenders.push(`${i + 1}: ${line.trim()}`);
      }
      for (const match of line.matchAll(ARBITRARY)) {
        const props = match[1]!.split(',').map((p) => p.trim());
        const bad = props.filter((p) => FORBIDDEN_PROPS.has(p));
        if (bad.length > 0) {
          offenders.push(`${i + 1}: ${match[0]} (forbidden: ${bad.join(', ')})`);
        }
      }
    });

    expect(offenders, `forbidden transitions in ${file}:\n${offenders.join('\n')}`).toEqual([]);
  });
});
