'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

type TrackLinkProps = ComponentProps<typeof Link> & {
  event: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
};

/**
 * A next/link that fires a Plausible event on click before navigating. Lets
 * server-rendered CTAs emit analytics without turning their whole page into a
 * client component. Navigation is never blocked — track() is a safe no-op when
 * analytics is not connected.
 */
export function TrackLink({ event, eventProps, onClick, ...rest }: TrackLinkProps) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
