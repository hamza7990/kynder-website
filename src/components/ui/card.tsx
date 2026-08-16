import { forwardRef } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const cardVariants = cva('rounded-lg', {
  variants: {
    surface: {
      // Card surfaces are cream or cream-card — never white.
      cream: 'bg-cream',
      card: 'bg-cream-card',
    },
    elevation: {
      0: 'shadow-none',
      1: 'shadow-1',
      2: 'shadow-2',
      3: 'shadow-3',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    bordered: {
      true: 'border border-ink-10',
      false: '',
    },
  },
  defaultVariants: {
    surface: 'card',
    elevation: 1,
    padding: 'md',
    bordered: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, surface, elevation, padding, bordered, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ surface, elevation, padding, bordered }), className)}
      {...props}
    />
  );
});

export { cardVariants };
