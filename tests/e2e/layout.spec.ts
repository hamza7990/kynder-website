import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
// Content-driven widths: small phones, phone, tablet, desktop breakpoint, wide.
const WIDTHS = [320, 375, 768, 1024, 1440];
// Desktop nav appears at the `md` (1024px) breakpoint; below it the hamburger.
const DESKTOP_FROM = 1024;

test.describe('global layout (Phase 5)', () => {
  test('skip link is the first focusable element and moves focus to <main>', async ({ page }) => {
    await page.goto('/');

    // First focusable element in DOM order is the skip link. (Asserted by DOM
    // order rather than a Tab press: WebKit/Safari skip links on Tab by default,
    // which is a browser setting, not a layout bug.)
    const firstFocusable = await page.evaluate(() => {
      const selector =
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return document.querySelector<HTMLElement>(selector)?.textContent?.trim();
    });
    expect(firstFocusable).toBe('Skip to content');

    // Focusing and activating it moves REAL focus to <main id="main">.
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await skip.focus();
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    const activeId = await page.evaluate(() => document.activeElement?.id);
    expect(activeId).toBe('main');
  });

  for (const width of WIDTHS) {
    test(`navigation works with no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);

      if (width >= DESKTOP_FROM) {
        const primary = page.getByRole('navigation', { name: 'Primary' });
        await expect(primary).toBeVisible();
        await expect(primary.getByRole('link', { name: 'Leadership Questions' })).toBeVisible();
      } else {
        const trigger = page.getByRole('button', { name: /open menu/i });
        await expect(trigger).toBeVisible();
        await trigger.click();
        const dialog = page.getByRole('dialog', { name: 'Menu' });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('link', { name: 'Leadership Questions' })).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
      }
    });
  }

  test('axe: zero violations with the drawer closed and open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    // Pause ambient ripples + settle fonts so contrast is measured on a stable frame.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');

    const closed = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(closed.violations, 'violations with drawer closed').toEqual([]);

    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();

    const open = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(open.violations, 'violations with drawer open').toEqual([]);
  });

  test('header compact transition causes no layout shift (CLS ~ 0)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'layout-shift API is Chromium-only');

    // Use the tall styleguide page so scrolling actually crosses the compact
    // threshold and the header shrinks from h-20 to h-16.
    await page.goto('/styleguide/');
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

    // Scroll down past the threshold (compacts the header) and back up.
    await page.evaluate(async () => {
      window.scrollTo(0, 600);
      await new Promise((r) => setTimeout(r, 500));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.01);
  });
});
