import { TrackLink } from '@/components/analytics/track-link';
import { cn } from '@/lib/cn';
import type { Topic } from '@/data/topics';

/**
 * A topic card: a real <a> to /book?topic={slug}, its accessible name the topic
 * title. Hover = 2px lift + border cream-card->terracotta@20% + 2px title shift.
 * No glow, no shadow animation, no scale (transform + border-colour only).
 */
export function TopicCard({ topic }: { topic: Topic }) {
  return (
    <TrackLink
      event="topic_selected"
      eventProps={{ topic: topic.slug }}
      href={`/book?topic=${topic.slug}`}
      aria-label={topic.title}
      className={cn(
        'group focus-ring flex h-full flex-col gap-2 rounded-lg border border-cream-card bg-cream p-6',
        'transition-[transform,border-color] duration-fast ease-out',
        'hover:border-terracotta/20 motion-safe:hover:-translate-y-0.5',
      )}
    >
      <h3 className="font-display text-h4 text-navy-deep transition-transform duration-fast ease-out motion-safe:group-hover:translate-x-0.5">
        {topic.title}
      </h3>
      <p className="text-body text-ink-70">{topic.blurb}</p>
    </TrackLink>
  );
}
