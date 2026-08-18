import { expect, test } from '@playwright/test';

test.describe('motion system', () => {
  test('application code registers no non-passive scroll listeners', async ({ page }) => {
    // Record every scroll listener registration with its target + passive flag,
    // before any app code runs.
    await page.addInitScript(() => {
      const w = window as unknown as {
        __scrollListeners: { passive: boolean; target: string; stack: string }[];
      };
      w.__scrollListeners = [];
      const original = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'scroll') {
          const passive =
            typeof options === 'object' && options !== null ? options.passive === true : false;
          const target =
            this === window ? 'window' : this === document ? 'document' : 'other';
          w.__scrollListeners.push({ passive, target, stack: new Error().stack ?? '' });
        }
        return original.call(this, type, listener, options as AddEventListenerOptions);
      };
    });

    await page.goto('/styleguide/');
    await page.waitForLoadState('networkidle');

    const listeners = await page.evaluate(
      () =>
        (
          window as unknown as {
            __scrollListeners: { passive: boolean; target: string; stack: string }[];
          }
        ).__scrollListeners,
    );

    // Application scroll listeners (e.g. useScrolled) attach to `window` and must
    // be passive. React's event delegation attaches non-passively to `document`
    // — framework behaviour, out of scope for this gate.
    const appNonPassive = listeners.filter((l) => !l.passive && l.target === 'window');

    expect(
      appNonPassive,
      `non-passive window scroll listeners:\n${appNonPassive.map((l) => l.stack).join('\n---\n')}`,
    ).toEqual([]);
  });

  test('reveals cause no layout shift (CLS ~ 0)', async ({ page, browserName }) => {
    // The layout-shift performance entry is Chromium-only.
    test.skip(browserName !== 'chromium', 'layout-shift API is Chromium-only');

    await page.goto('/styleguide/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');

    // Start measuring only after load + fonts have settled, so we isolate
    // shifts caused by scroll-triggered reveals.
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

    // Scroll the whole page so every Reveal enters the viewport.
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let travelled = 0;
        const step = () => {
          window.scrollBy(0, 500);
          travelled += 500;
          if (travelled < document.body.scrollHeight) requestAnimationFrame(step);
          else resolve();
        };
        step();
      });
    });
    await page.waitForTimeout(600);

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.01);
  });
});
