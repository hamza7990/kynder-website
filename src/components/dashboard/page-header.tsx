import { cn } from '@/lib/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-4 border-b border-ink-10 pb-6 sm:flex-row sm:items-center',
        className
      )}
    >
      <div>
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-terracotta-soft px-3 py-1 font-sans text-small font-semibold uppercase tracking-eyebrow text-terracotta-text">
            {badge}
          </span>
        )}
        <h1 className="font-display text-h2 font-bold tracking-tight text-navy-deep">
          {title}
        </h1>
        {description && <p className="mt-1 text-lead text-ink-70">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
