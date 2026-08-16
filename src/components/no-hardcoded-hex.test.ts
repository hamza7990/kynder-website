import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guardrail: components must consume design tokens only. There must be zero
 * hardcoded hex colour values anywhere under src/components — all colour comes
 * from CSS custom properties defined in src/styles/tokens.css.
 */
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const HEX = /#[0-9a-fA-F]{3,8}\b/;

describe('no hardcoded hex in src/components', () => {
  const files = walk(join(process.cwd(), 'src', 'components')).filter(
    (f) => /\.(ts|tsx|css)$/.test(f) && !/\.test\.[tj]sx?$/.test(f),
  );

  it('scans at least the primitives', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('%s contains no hex colour literals', (file) => {
    const contents = readFileSync(file, 'utf8');
    const offendingLines = contents
      .split('\n')
      .map((line, i) => ({ line, n: i + 1 }))
      .filter(({ line }) => HEX.test(line));

    expect(offendingLines, `hex found in ${file}: ${JSON.stringify(offendingLines)}`).toEqual([]);
  });
});
