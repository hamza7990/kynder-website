'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { useFieldControl } from './field';

const textareaBase = [
  'focus-ring min-h-[7.5rem] w-full rounded-md px-4 py-3',
  'bg-cream-card font-sans text-body text-ink',
  'border border-ink-20 placeholder:text-ink-70',
  'transition-[border-color,box-shadow] duration-fast ease-out',
  'hover:border-ink-40 focus-visible:border-terracotta',
  'disabled:cursor-not-allowed disabled:opacity-50',
];

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, id, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  const field = useFieldControl();
  const invalid = ariaInvalid ?? field?.invalid;

  return (
    <textarea
      ref={ref}
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={invalid || undefined}
      className={cn(textareaBase, invalid && 'border-terracotta hover:border-terracotta', className)}
      {...props}
    />
  );
});
