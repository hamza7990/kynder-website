import { cn } from '@/lib/cn';

type Space = 'sm' | 'md' | 'lg';
type Surface = 'cream' | 'card' | 'navy';

// Section vertical rhythm is intentionally varied (96 / 120 / 160), never one
// uniform value — see each home section for the choice it makes.
const SPACE: Record<Space, string> = {
  sm: 'py-section-sm', // 96
  md: 'py-section-md', // 120
  lg: 'py-section-lg', // 160
};

// Backgrounds are deliberate, not alternating: cream is the page default,
// cream-card groups a distinct zone, navy-deep marks the conversion moment.
const SURFACE: Record<Surface, string> = {
  cream: '',
  card: 'bg-cream-card',
  navy: 'bg-navy-deep',
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  space?: Space;
  surface?: Surface;
}

export function Section({ space = 'md', surface = 'cream', className, children, ...props }: SectionProps) {
  return (
    <section className={cn('relative', SPACE[space], SURFACE[surface], className)} {...props}>
      {children}
    </section>
  );
}
