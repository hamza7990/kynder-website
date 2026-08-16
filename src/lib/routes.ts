/**
 * Routes that exist for internal/visual-review purposes and must be kept out of
 * production navigation and the generated sitemap. Consumed by the (future)
 * sitemap generator and any navigation builder.
 */
export const HIDDEN_ROUTES = ['/styleguide'] as const;

export function isHiddenRoute(path: string): boolean {
  return HIDDEN_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
}
