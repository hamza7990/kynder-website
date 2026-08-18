/**
 * 404 page copy. Functional UI text authored for the site (the brief supplies
 * none); the two CTA labels reuse the site's existing wording so nothing new is
 * introduced. Flagged in docs/PENDING.md for client review of the wording.
 */
export const notFoundCopy = {
  code: '404',
  heading: 'We can’t find that page',
  body: 'The page you’re looking for has moved or never existed. Here are two good places to pick things back up:',
  links: [
    { label: 'Explore the 10 Questions', href: '/questions' },
    { label: 'Book a 1-on-1 Session', href: '/book' },
  ],
} as const;
