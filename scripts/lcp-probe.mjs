import { chromium } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:3000/';
const browser = await chromium.launch();
const page = await browser.newPage();
const client = await page.context().newCDPSession(page);
// Emulate mobile-ish throttling so the LCP element matches Lighthouse's pick.
await client.send('Network.enable');
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(3000);
const lcp = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const obs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        resolve({
          time: Math.round(last.renderTime || last.loadTime || last.startTime),
          tag: last.element?.tagName,
          cls: last.element?.className,
          text: (last.element?.textContent || '').slice(0, 60),
        });
      });
      obs.observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve({ time: -1 }), 1000);
    }),
);
console.log(JSON.stringify(lcp, null, 2));
await browser.close();
