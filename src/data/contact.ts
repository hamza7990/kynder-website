/**
 * Contact page copy.
 *
 * The page heading and intro are client-facing copy (translated in A3). The FORM
 * field labels, validation and status messages are interface chrome and have moved
 * into the public interface dictionary (src/i18n/public) as of A2 Slice 4 — see
 * ContactForm's `usePublicT('contactForm.*')`. The contact email comes from site.ts.
 */
export const contact = {
  heading: "Contact",
  intro: "Whether you have a question about coaching, want to explore working together or simply need to get in touch — we'd love to hear from you.",
  emailFallbackLabel: "Or email us directly:",
} as const;
