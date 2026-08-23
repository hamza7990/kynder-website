'use client';

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/cn';

/* --------------------------------- Root ---------------------------------- */

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion parts must be used within <Accordion>.');
  return ctx;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `single` allows one open panel; `multiple` allows many. */
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  /** When `single`, allow closing the open panel. */
  collapsible?: boolean;
}

export function Accordion({
  type = 'single',
  defaultValue = [],
  collapsible = true,
  className,
  children,
  ...props
}: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(
    (value: string) => {
      setOpen((current) => {
        const isCurrentlyOpen = current.includes(value);
        if (type === 'single') {
          if (isCurrentlyOpen) return collapsible ? [] : current;
          return [value];
        }
        return isCurrentlyOpen ? current.filter((v) => v !== value) : [...current, value];
      });
    },
    [type, collapsible],
  );

  const isOpen = useCallback((value: string) => open.includes(value), [open]);

  const ctx = useMemo<AccordionContextValue>(
    () => ({ isOpen, toggle, rootRef }),
    [isOpen, toggle],
  );

  return (
    <AccordionContext.Provider value={ctx}>
      <div ref={rootRef} className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/* --------------------------------- Item ---------------------------------- */

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  triggerId: string;
  panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItem(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error('AccordionTrigger/Content must be used within <AccordionItem>.');
  return ctx;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { isOpen } = useAccordion();
  const uid = useId();
  const item = useMemo<AccordionItemContextValue>(
    () => ({ value, open: isOpen(value), triggerId: `${uid}-trigger`, panelId: `${uid}-panel` }),
    [value, isOpen, uid],
  );

  return (
    <AccordionItemContext.Provider value={item}>
      <div className={cn('border-b border-ink-10', className)} data-state={item.open ? 'open' : 'closed'} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/* ------------------------------- Trigger --------------------------------- */

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const { toggle, rootRef } = useAccordion();
  const { value, open, triggerId, panelId } = useAccordionItem();

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const root = rootRef.current;
    if (!root) return;
    const triggers = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'),
    );
    const index = triggers.indexOf(event.currentTarget);
    if (index === -1) return;
    event.preventDefault();
    const target =
      event.key === 'ArrowDown'
        ? triggers[(index + 1) % triggers.length]
        : event.key === 'ArrowUp'
          ? triggers[(index - 1 + triggers.length) % triggers.length]
          : event.key === 'Home'
            ? triggers[0]
            : triggers[triggers.length - 1];
    target?.focus();
  }

  return (
    <button
      type="button"
      id={triggerId}
      data-accordion-trigger=""
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => toggle(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        'focus-ring flex w-full items-center justify-between gap-4 py-4 text-start',
        'font-display text-h4 text-navy-deep',
        'transition-colors duration-fast ease-out hover:text-terracotta',
        className,
      )}
      {...props}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          'h-5 w-5 shrink-0 text-terracotta transition-transform duration-base ease-out motion-reduce:transition-none',
          open && 'rotate-180',
        )}
      >
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ------------------------------- Content --------------------------------- */

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { open, triggerId, panelId } = useAccordionItem();

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      // `inert` removes collapsed content from tab order and the a11y tree.
      inert={!open}
      className={cn(
        'grid transition-[grid-template-rows] duration-base ease-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <div className="overflow-hidden">
        <div className={cn('pb-4 text-body text-ink-70', className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}
