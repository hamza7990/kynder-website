import { expect, test } from '@playwright/test';

// Baseline smoke check that the exported site boots and serves the home route.
test('home route responds and renders a document', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/KYNDER/);
});
