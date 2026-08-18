'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { useFieldControl } from './field';

const inputBase = [
  'focus-ring h-11 w-full rounded-md px-4',
  'bg-cream-card font-sans text-body text-ink',
  'border border-ink-20 placeholder:text-ink-70',
  'transition-[color,background-color,border-color] duration-fast ease-out',
  'hover:border-ink-40 focus-visible:border-terracotta',
  'disabled:cursor-not-allowed disabled:opacity-50',
];

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, id, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  const field = useFieldControl();
  const invalid = ariaInvalid ?? field?.invalid;

  return (
    <input
      ref={ref}
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={invalid || undefined}
      className={cn(inputBase, invalid && 'border-terracotta hover:border-terracotta', className)}
      {...props}
    />
  );
});
