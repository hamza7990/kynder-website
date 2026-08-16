import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Automated accessibility checks. Tagged @a11y so `npm run test:a11y` can select
// them via Playwright's --grep filter.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('accessibility @a11y', () => {
  test('home route has no WCAG A/AA violations @a11y', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });

  test('styleguide has no WCAG A/AA violations (incl. contrast) @a11y', async ({ page }) => {
    await page.goto('/styleguide/');

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });

  test('styleguide passes the dedicated colour-contrast rule @a11y', async ({ page }) => {
    await page.goto('/styleguide/');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
