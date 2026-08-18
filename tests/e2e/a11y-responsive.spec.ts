import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Consolidated Block-1 gate: responsive integrity + accessibility across all six
 * Phase-1 pages, at every breakpoint, in every interactive state.
 *
 * Overflow, touch targets and reflow are checked structurally; axe is run in the
 * default state and in each interactive state (accordion open, mobile drawer
 * open, contact error, topic filter applied), plus the primary button on :hover.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440];
const ROUTES = ['/', '/questions/', '/topics/', '/book/', '/about/', '/contact/'];

async function horizontalOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

test.describe('Block 1 — responsive integrity', () => {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      test(`no horizontal overflow at ${width}px on ${route}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        // <=1px absorbs sub-pixel rounding; anything more is a real overflow.
        expect(await horizontalOverflow(page), `${route} @ ${width}px`).toBeLessThanOrEqual(1);
      });
    }
  }

  // WCAG 1.4.10 reflow: content at a 200%-zoom equivalent (1280 CSS px viewed at
  // 200% ~= a 640px layout) must not require horizontal scrolling.
  test('reflow: no horizontal scroll at a 200%-zoom equivalent (640px)', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route);
      expect(await horizontalOverflow(page), `${route} reflow`).toBeLessThanOrEqual(1);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
});

test.describe('Block 1 — touch targets (>=44px)', () => {
  test('mobile menu toggle, drawer links and drawer CTA are >=44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    const toggleBox = await toggle.boundingBox();
    expect(toggleBox!.width).toBeGreaterThanOrEqual(44);
    expect(toggleBox!.height).toBeGreaterThanOrEqual(44);

    await toggle.click();
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    for (const link of await dialog.getByRole('link').all()) {
      const box = await link.boundingBox();
      expect(box!.height, (await link.textContent()) ?? '').toBeGreaterThanOrEqual(44);
    }
  });

  test('pillar filter chips are >=44px tall on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/questions/');
    const group = page.getByRole('group', { name: 'Filter questions by pillar' });
    for (const chip of await group.getByRole('button').all()) {
      const box = await chip.boundingBox();
      expect(box!.height, (await chip.textContent()) ?? '').toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Block 1 — axe in every interactive state', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 900 });
  });

  async function analyze(page: Page) {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    return new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  }

  for (const route of ['/', '/questions/', '/topics/', '/book/', '/about/', '/contact/']) {
    test(`default state clean: ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await analyze(page);
      expect(results.violations, route).toEqual([]);
    });
  }

  test('questions: accordion open + filter applied', async ({ page }) => {
    await page.goto('/questions/');
    await page.locator('[data-q-trigger]').first().click();
    await expect(page.locator('[data-state="open"][id^="q-"]')).toBeVisible();
    let results = await analyze(page);
    expect(results.violations, 'accordion open').toEqual([]);

    // Apply a pillar filter, then re-check.
    const group = page.getByRole('group', { name: 'Filter questions by pillar' });
    await group.getByRole('button').nth(1).click();
    results = await analyze(page);
    expect(results.violations, 'filter applied').toEqual([]);
  });

  test('home: mobile drawer open', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    const results = await analyze(page);
    expect(results.violations, 'drawer open').toEqual([]);
  });

  test('contact: form in its error state', async ({ page }) => {
    await page.goto('/contact/');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    await page.mouse.move(0, 0);
    const results = await analyze(page);
    expect(results.violations, 'contact error').toEqual([]);
  });

  test('primary button keeps AA contrast on :hover', async ({ page }) => {
    await page.goto('/about/');
    // Hover the primary CTA so axe measures the :hover background-color.
    const cta = page.getByRole('link', { name: 'Book a 1-on-1 Session' }).last();
    await cta.hover();
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include('a[href="/book/"]')
      .analyze();
    const contrast = results.violations.filter((v) => v.id === 'color-contrast');
    expect(contrast, 'primary CTA hover contrast').toEqual([]);
  });
});
