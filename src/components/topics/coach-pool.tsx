import { poolLine } from '@/data/topics';

// Five decorative circles. NEUTRAL marks only — a generic person glyph, never
// initials, so nothing implies a specific real coach. Purely decorative.
const CIRCLES = [0, 1, 2, 3, 4];

function CoachMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-navy">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5a8 8 0 0 1 16 0Z" />
    </svg>
  );
}

export function CoachPool() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div aria-hidden="true" className="flex items-center">
        {CIRCLES.map((i) => (
          <span
            key={i}
            style={{
              animationDelay: `${i * 700}ms`,
              marginLeft: i === 0 ? undefined : '-0.75rem',
              zIndex: CIRCLES.length - i,
            }}
            className="animate-float inline-flex h-14 w-14 items-center justify-center rounded-full border border-ink-10 bg-cream-card"
          >
            <CoachMark />
          </span>
        ))}
      </div>
      <p className="text-small text-ink-70">{poolLine}</p>
    </div>
  );
}
