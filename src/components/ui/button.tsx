import { forwardRef } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  // Base — layout, typography, motion, focus and disabled behaviour.
  [
    'focus-ring inline-flex select-none items-center justify-center gap-2',
    'rounded-full font-sans font-semibold',
    'transition-[background-color,border-color,color,box-shadow] duration-fast ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        // Terracotta fill with dark ink text (AA on the accent).
        primary: 'bg-terracotta text-navy-deep shadow-1 hover:bg-terracotta-hover active:bg-terracotta-active',
        // Outlined, for light surfaces.
        ghost: 'border border-ink-20 bg-transparent text-navy-deep hover:bg-cream-card active:bg-cream-card',
        // Outlined, for dark surfaces.
        'ghost-light': 'border border-ink-20 bg-transparent text-cream hover:border-terracotta hover:text-terracotta active:text-terracotta',
      },
      size: {
        sm: 'h-9 px-4 text-small',
        md: 'h-11 px-6 text-body',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner and blocks interaction while true. */
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, isLoading = false, disabled, type = 'button', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <svg
          className="h-4 w-4 animate-spin motion-reduce:animate-none"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-90" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : null}
      {children}
    </button>
  );
});

export { buttonVariants };
