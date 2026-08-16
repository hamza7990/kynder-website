import { cn } from '@/lib/cn';

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** `light` = on cream surfaces, `dark` = on navy surfaces. */
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  /** Heading level for the title (defaults to h2). */
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  tone = 'light',
  align = 'left',
  as: Heading = 'h2',
  className,
  ...props
}: SectionHeaderProps) {
  const isDark = tone === 'dark';
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <span
          className={cn(
            'inline-flex items-center gap-3 font-sans text-small font-semibold uppercase tracking-eyebrow',
            // Accent-coloured text only on dark; dark text + terracotta marker on light.
            isDark ? 'text-terracotta' : 'text-navy',
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
          {eyebrow}
        </span>
      ) : null}

      <Heading
        className={cn(
          'text-balance font-display text-h2 tracking-display',
          isDark ? 'text-cream' : 'text-navy-deep',
        )}
      >
        {title}
      </Heading>

      {lead ? (
        <p
          className={cn(
            'max-w-[60ch] text-lead',
            isDark ? 'text-cream' : 'text-ink-70',
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
