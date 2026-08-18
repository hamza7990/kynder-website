import { expect, test, type Page } from '@playwright/test';

/**
 * Block-3 gate: per-page SEO metadata + structured data, and the three
 * client-side analytics events. The two submission events (contact_submitted,
 * newsletter_submitted) fire only on an accepted backend response and are covered
 * where the endpoints are wired — see docs/HANDOVER.md.
 */

const attr = (page: Page, selector: string, name: string) =>
  page.locator(selector).first().getAttribute(name);

test.describe('SEO metadata', () => {
  const pages = [
    { route: '/', canonicalEnds: '/', ld: 'Organization' },
    { route: '/questions/', canonicalEnds: '/questions/', ld: 'FAQPage' },
    { route: '/topics/', canonicalEnds: '/topics/', ld: 'Service' },
    { route: '/about/', canonicalEnds: '/about/', ld: 'Person' },
    { route: '/book/', canonicalEnds: '/book/', ld: null },
    { route: '/contact/', canonicalEnds: '/contact/', ld: null },
  ];

  for (const p of pages) {
    test(`${p.route} has unique title, description, canonical, OG image`, async ({ page }) => {
      await page.goto(p.route);
      await expect(page).toHaveTitle(/KYNDER/);
      const desc = await attr(page, 'meta[name="description"]', 'content');
      expect(desc && desc.length).toBeGreaterThan(20);
      const canonical = await attr(page, 'link[rel="canonical"]', 'href');
      expect(canonical, 'canonical').toContain(p.canonicalEnds);
      const og = await attr(page, 'meta[property="og:image"]', 'content');
      expect(og, 'og:image').toContain('opengraph-image');
      const tw = await attr(page, 'meta[name="twitter:card"]', 'content');
      expect(tw).toBe('summary_large_image');
    });

    if (p.ld) {
      test(`${p.route} emits ${p.ld} JSON-LD`, async ({ page }) => {
        await page.goto(p.route);
        const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
        const types = blocks.map((b) => JSON.parse(b)['@type']);
        expect(types).toContain(p.ld);
      });
    }
  }

  test('robots.txt and sitemap.xml exclude /styleguide', async ({ page }) => {
    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Disallow: /styleguide/');
    expect(robots).toContain('Sitemap:');
    const sitemap = await (await page.request.get('/sitemap.xml')).text();
    expect(sitemap).not.toContain('/styleguide');
    expect(sitemap).not.toContain('/book/confirmed');
    expect(sitemap).toContain('/questions/');
  });

  test('FAQ JSON-LD uses the verbatim question text', async ({ page }) => {
    await page.goto('/questions/');
    const block = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const data = JSON.parse(block!);
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(10);
    expect(data.mainEntity[0].name).toContain('What conversation have I been avoiding');
  });
});

test.describe('analytics events', () => {
  // Stub Plausible before any script runs and record every event.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __ev: unknown[] }).__ev = [];
      (window as unknown as { plausible: (e: string, o?: unknown) => void }).plausible = (e, o) =>
        (window as unknown as { __ev: unknown[] }).__ev.push({ e, o });
    });
  });

  const events = (page: Page) =>
    page.evaluate(() => (window as unknown as { __ev: { e: string; o?: { props?: Record<string, unknown> } }[] }).__ev);

  test('booking_cta_click fires from the hero CTA', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.getByRole('link', { name: 'Book a 1-on-1 Session' }).first().click();
    await page.waitForURL('**/book/**');
    expect((await events(page)).map((x) => x.e)).toContain('booking_cta_click');
  });

  test('topic_selected fires with the topic slug', async ({ page }) => {
    await page.goto('/topics/');
    await page.getByRole('link', { name: 'Having hard conversations' }).click();
    await page.waitForURL('**/book/**');
    const ev = (await events(page)).find((x) => x.e === 'topic_selected');
    expect(ev).toBeTruthy();
    expect(ev!.o?.props?.topic).toBe('having-hard-conversations');
  });

  test('question_opened fires with the question number', async ({ page }) => {
    await page.goto('/questions/');
    await page.locator('[data-q-trigger]').first().click();
    const ev = (await events(page)).find((x) => x.e === 'question_opened');
    expect(ev).toBeTruthy();
    expect(ev!.o?.props?.question).toBe(1);
  });
});
