import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const WIDTHS = [320, 375, 768, 1024, 1440];
const NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

test.describe('questions page (Phase 7)', () => {
  for (const width of WIDTHS) {
    test(`zero horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/questions/');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    });
  }

  test('every #q-01..#q-10 deep link opens exactly that question', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    for (const no of NUMBERS) {
      await page.goto(`/questions/#q-${no}`);
      await expect(page.locator(`#q-trigger-${no}`)).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('[data-q-trigger][aria-expanded="true"]')).toHaveCount(1);
    }
  });

  test('each deep-linked question scrolls into view, clear of the fixed header', async ({
    page,
  }, testInfo) => {
    // Exact scroll positioning is engine-specific; assert it on desktop chromium
    // (mobile dynamic viewports rubber-band). Opening is verified cross-browser above.
    test.skip(testInfo.project.name !== 'chromium', 'scroll positioning checked on desktop chromium');
    await page.setViewportSize({ width: 1024, height: 800 });
    for (const no of NUMBERS) {
      // Force a fresh document load each time: a hash-only goto doesn't reload the
      // SPA, so prior open state would carry over and skew the measured position.
      await page.goto('about:blank');
      await page.goto(`/questions/#q-${no}`);
      await expect(page.locator(`#q-trigger-${no}`)).toHaveAttribute('aria-expanded', 'true');
      await page.waitForTimeout(900);
      const box = await page.locator(`#q-${no}`).boundingBox();
      expect(box, `bounding box for q-${no}`).not.toBeNull();
      expect(box!.y, `q-${no} clear of header`).toBeGreaterThanOrEqual(40);
      expect(box!.y, `q-${no} within viewport`).toBeLessThan(780);
    }
  });

  test('axe: zero violations closed, with one open, and with a filter applied', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/questions/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');

    const closed = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(closed.violations, 'closed').toEqual([]);

    await page.locator('[data-q-trigger]').first().click();
    await expect(page.locator('[data-q-trigger][aria-expanded="true"]')).toHaveCount(1);
    // Let the grid-rows expand + the 60ms-staggered step reveals fully settle;
    // contrast must be measured on the final state, not a mid-fade opacity frame.
    await page.waitForTimeout(1000);
    const open = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(open.violations, 'one open').toEqual([]);

    // exact:true so it matches the filter button, not the triggers whose
    // accessible name contains the COURAGE badge (Playwright name is substring).
    await page.getByRole('button', { name: 'COURAGE', exact: true }).click();
    await page.waitForTimeout(400); // let the filter buttons' colour transition settle
    const filtered = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(filtered.violations, 'filtered').toEqual([]);
  });

  test('CLS below 0.05 when a question expands', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'layout-shift API is Chromium-only');

    await page.goto('/questions/');
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
      }).observe({ type: 'layout-shift', buffered: false });
    });

    await page.locator('[data-q-trigger]').first().click();
    await page.waitForTimeout(600);

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.05);
  });
});
