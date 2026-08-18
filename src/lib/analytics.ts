/**
 * Analytics event tracking (Plausible).
 *
 * Exactly five custom events are defined — the union below is the whole surface,
 * so a typo or an unplanned event is a type error. `track` is a safe no-op until
 * the Plausible script is connected (NEXT_PUBLIC_PLAUSIBLE_DOMAIN set): the queue
 * stub swallows calls, so nothing throws and no event is silently invented.
 */
export type AnalyticsEvent =
  | 'booking_cta_click'
  | 'topic_selected'
  | 'question_opened'
  | 'contact_submitted'
  | 'newsletter_submitted';

type PlausibleProps = Record<string, string | number | boolean>;

interface PlausibleWindow {
  plausible?: (event: string, options?: { props?: PlausibleProps }) => void;
}

export function track(event: AnalyticsEvent, props?: PlausibleProps): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as PlausibleWindow;
  w.plausible?.(event, props ? { props } : undefined);
}
