import Script from 'next/script';

/**
 * Plausible loader. Renders nothing until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, so
 * an unconfigured build ships no tracking script and reports honestly as "not
 * connected" — never a fake or half-wired analytics tag.
 *
 * When configured it loads Plausible's privacy-friendly script (no cookies, no
 * consent banner needed) plus the queue stub that lets track() fire custom events
 * before the script finishes loading. Custom events are defined in lib/analytics.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? 'https://plausible.io/js/script.js';

  return (
    <>
      <Script defer data-domain={domain} src={src} strategy="afterInteractive" />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
      </Script>
    </>
  );
}
