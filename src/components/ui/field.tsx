'use client';

import { createContext, useContext, useId } from 'react';
import { cn } from '@/lib/cn';

interface FieldContextValue {
  controlId: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Consumed by Input/Textarea to auto-wire id + aria-* when inside a Field. */
export function useFieldControl(): FieldContextValue | null {
  return useContext(FieldContext);
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Override the generated control id. */
  htmlFor?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, error, htmlFor, className, children, ...props }: FieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const invalid = Boolean(error);

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <FieldContext.Provider value={{ controlId, describedBy, invalid }}>
      <div className={cn('flex flex-col gap-2', className)} {...props}>
        <label htmlFor={controlId} className="font-sans text-small font-medium text-navy-deep">
          {label}
        </label>

        {children}

        {hint && !error ? (
          <p id={hintId} className="text-small text-ink-70">
            {hint}
          </p>
        ) : null}

        {error ? (
          <p
            id={errorId}
            className="flex items-center gap-2 text-small font-medium text-navy-deep"
          >
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-terracotta" />
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
