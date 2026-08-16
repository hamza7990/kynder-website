import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Automated accessibility checks. Tagged @a11y so `npm run test:a11y` can select
// them via Playwright's --grep filter.
test.describe('accessibility @a11y', () => {
  test('home route has no WCAG A/AA violations @a11y', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
