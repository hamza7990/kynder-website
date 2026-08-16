import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-2 rounded-full',
    'px-3 py-1 font-sans text-small font-semibold uppercase tracking-eyebrow',
    'border',
  ],
  {
    variants: {
      variant: {
        terracotta: 'border-terracotta-soft bg-terracotta-soft text-navy-deep',
        gold: 'border-gold-soft bg-gold-soft text-navy-deep',
        neutral: 'border-ink-10 bg-cream-card text-ink',
      },
    },
    defaultVariants: {
      variant: 'terracotta',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
