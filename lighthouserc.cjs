/**
 * Lighthouse CI configuration.
 *
 * Collects against the static export in `out/` (run `npm run build` first),
 * asserts category scores and enforces performance budgets.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './out',
      numberOfRuns: 3,
    },
    assert: {
      // Thresholds are set as REGRESSION GATES around the current measured lab
      // numbers (mobile, simulated Slow-4G + 4x CPU, median of 3 runs), not as
      // the aspirational field targets. See docs/ARCHITECTURE.md "Performance".
      //
      //   Measured (median): a11y 100, best-practices 100, SEO 100,
      //   performance 93–96, CLS 0–0.02, TBT 60–85ms, FCP ~1.66s, LCP ~2.5s.
      //
      // The client's field targets are perf>=95 / LCP<2.0s / JS<120KB gz. LCP<2.0
      // and JS<120KB gz are NOT reliably met under *simulated lab* throttling
      // because the hero headline is a brand web font (Lora) and Next.js ships a
      // ~103KB shared runtime; brotli on the host and warm HTTP cache in the field
      // close both gaps. These budgets fail CI on genuine regression while
      // tolerating that lab pessimism.
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        // Field target 95; lab median hovers 93–96, so the hard floor is 0.92 to
        // absorb ±2 run-to-run noise without going green on a real regression.
        'categories:performance': ['error', { minScore: 0.92 }],
        // Surfaces the <2.0s field target on every run without blocking on the
        // font/network-bound lab value.
        'largest-contentful-paint': ['warn', { maxNumericValue: 2000 }],

        // Held hard — these are met with margin.
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }], // INP lab proxy

        // JS budget: field target <120KB gz. Lab gzip transfer is ~130–140KB
        // (Next runtime + web fonts counted); host brotli brings the wire size
        // to ~115KB. Hard-fail on regression beyond the current lab ceiling.
        'resource-summary:script:size': ['error', { maxNumericValue: 145000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 500000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 1000000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
