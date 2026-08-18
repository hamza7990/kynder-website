import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { stepsLabel, type Question } from '@/data/questions';

export interface QuestionItemProps {
  question: Question;
  open: boolean;
  onToggle: (no: string) => void;
  onTriggerKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * One question. Closed: number, question text, pillar badge, chevron — nothing
 * else. Open: stepsLabel + the five steps, staggered 60ms, along a vertical rail.
 *
 * The trigger is a real <button> inside an <h3>; the panel is a role="region"
 * labelled by the trigger, height-animated via grid-template-rows 0fr->1fr, and
 * `inert` while closed so it is out of tab order and the a11y tree.
 */
export function QuestionItem({ question, open, onToggle, onTriggerKeyDown }: QuestionItemProps) {
  const { no, question: text, pillar, steps } = question;
  const triggerId = `q-trigger-${no}`;
  const panelId = `q-panel-${no}`;

  return (
    <div id={`q-${no}`} data-state={open ? 'open' : 'closed'} className="scroll-mt-28 border-b border-ink-10">
      <h3 className="m-0">
        <button
          type="button"
          id={triggerId}
          data-q-trigger=""
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(no)}
          onKeyDown={onTriggerKeyDown}
          className="focus-ring flex w-full items-start gap-4 py-6 text-left sm:gap-6"
        >
          <span className="font-display text-h3 leading-none text-terracotta-text">{no}</span>
          <span className="flex flex-1 flex-col items-start gap-3">
            <span className="font-display text-h4 text-navy-deep">{text}</span>
            <Badge variant="terracotta">{pillar}</Badge>
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className={cn(
              'mt-1 h-5 w-5 shrink-0 text-terracotta-text transition-transform duration-base ease-out motion-reduce:transition-none',
              open && 'rotate-180',
            )}
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] duration-base ease-out motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-8 pl-11 sm:pl-14">
            <p className="mb-4 font-sans text-small font-semibold uppercase tracking-eyebrow text-navy">
              {stepsLabel}
            </p>
            <ol className="flex flex-col gap-4 border-l-2 border-terracotta-soft pl-6">
              {steps.map((step, i) => (
                <li
                  key={i}
                  style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
                  className={cn(
                    'max-w-[68ch] text-body text-ink-80',
                    'motion-safe:transition-[opacity,transform] motion-safe:duration-base motion-safe:ease-out',
                    open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                    'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                  )}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
