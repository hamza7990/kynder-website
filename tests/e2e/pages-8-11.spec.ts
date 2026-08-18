import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const WIDTHS = [320, 375, 768, 1024, 1440];
const ROUTES = ['/topics/', '/book/', '/about/', '/contact/'];

async function overflow(page: import('@playwright/test').Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

test.describe('pages 8/10/11', () => {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      test(`no horizontal overflow at ${width}px on ${route}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        expect(await overflow(page), `${route} @ ${width}px`).toBeLessThanOrEqual(1);
      });
    }
  }

  test('book with a valid topic shows the not-connected panel, no calendar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/book/?topic=having-hard-conversations');
    await expect(page.getByText('Booking calendar not yet connected')).toBeVisible();
    expect(await page.locator('iframe').count()).toBe(0);
    expect(await overflow(page)).toBeLessThanOrEqual(1);
  });

  const axeRoutes = ['/topics/', '/book/?topic=having-hard-conversations', '/about/', '/contact/'];
  for (const route of axeRoutes) {
    test(`axe: zero violations on ${route}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 375, height: 900 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations, route).toEqual([]);
    });
  }

  test('axe: contact form in its error state', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/contact/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    // Move the pointer off the submit button so axe measures its resting state,
    // not the incidental :hover left by the click. (The primary button's hover
    // contrast is a separate, flagged design-system item for the a11y phase.)
    await page.mouse.move(0, 0);

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations, 'contact error state').toEqual([]);
  });
});
