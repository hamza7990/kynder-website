import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const WIDTHS = [320, 375, 768, 1024, 1440];

test.describe('home page (Phase 6)', () => {
  for (const width of WIDTHS) {
    test(`zero horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    });
  }

  test('decorative ripples remain visible on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const anyVisibleRing = await page.evaluate(() => {
      const container = document.querySelector('[data-decor="ripples"]');
      if (!container) return false;
      return Array.from(container.querySelectorAll('div')).some((ring) => {
        const cs = getComputedStyle(ring);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && ring.getBoundingClientRect().width > 100;
      });
    });
    expect(anyVisibleRing).toBe(true);
  });

  test('axe: zero violations on the home page (mobile width)', async ({ page }) => {
    // Pause ambient ripples so contrast is sampled on a stable frame; settle fonts
    // so it is measured against final rendered type, not a fallback-font frame.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations).toEqual([]);
  });

  test('CLS below 0.05 including the portrait placeholder', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'layout-shift API is Chromium-only');

    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!entry.hadRecentInput) w.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    // Scroll the whole page so every section (incl. the portrait frame) settles.
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let travelled = 0;
        const step = () => {
          window.scrollBy(0, 400);
          travelled += 400;
          if (travelled < document.body.scrollHeight) requestAnimationFrame(step);
          else resolve();
        };
        step();
      });
    });
    await page.waitForTimeout(500);

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.05);
  });
});
