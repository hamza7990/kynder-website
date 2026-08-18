import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Automated accessibility checks. Tagged @a11y so `npm run test:a11y` can select
// them via Playwright's --grep filter.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('accessibility @a11y', () => {
  // Settle fonts + network before analysing so contrast is measured against the
  // final rendered type, not a transient fallback-font frame.
  const settle = async (page: import('@playwright/test').Page, path: string) => {
    // Pause ambient motion so contrast is sampled against a stable frame (the
    // decorative ripples otherwise drift behind the hero and jitter the reading).
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
  };

  test('home route has no WCAG A/AA violations @a11y', async ({ page }) => {
    await settle(page, '/');

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });

  test('styleguide has no WCAG A/AA violations (incl. contrast) @a11y', async ({ page }) => {
    await settle(page, '/styleguide/');

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });

  test('styleguide passes the dedicated colour-contrast rule @a11y', async ({ page }) => {
    await settle(page, '/styleguide/');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
