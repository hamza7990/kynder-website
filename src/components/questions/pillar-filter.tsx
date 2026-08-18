import { cn } from '@/lib/cn';
import type { Pillar } from '@/data/questions';

export type PillarFilterValue = 'ALL' | Pillar;

export interface PillarFilterProps {
  pillars: readonly Pillar[];
  active: PillarFilterValue;
  onChange: (next: PillarFilterValue) => void;
}

/**
 * Filter row: "All" plus the six pillars. Real <button>s with aria-pressed;
 * keyboard-operable natively. The active-state announcement to screen readers
 * (result count) lives in the parent's aria-live region.
 */
export function PillarFilter({ pillars, active, onChange }: PillarFilterProps) {
  const options: { value: PillarFilterValue; label: string }[] = [
    { value: 'ALL', label: 'All' },
    ...pillars.map((p) => ({ value: p, label: p })),
  ];

  return (
    <div role="group" aria-label="Filter questions by pillar" className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              'focus-ring rounded-full border px-4 py-2 font-sans text-small font-semibold uppercase tracking-eyebrow',
              'transition-colors duration-fast ease-out',
              isActive
                ? 'border-navy-deep bg-navy-deep text-cream'
                : 'border-ink-20 bg-transparent text-navy-deep hover:border-terracotta',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
