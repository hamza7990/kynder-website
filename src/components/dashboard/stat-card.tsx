import { cn } from '@/lib/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-ink-10 bg-cream-card p-6 shadow-1 transition-colors duration-fast hover:border-ink-20',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-small font-semibold uppercase tracking-eyebrow text-ink-70">
          {title}
        </span>
        {icon && <div className="text-terracotta">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-h2 font-bold text-navy-deep">{value}</span>
        {trend && <span className="text-small font-medium text-terracotta-text">{trend}</span>}
      </div>
      {description && <p className="mt-1 text-small text-ink-60">{description}</p>}
    </div>
  );
}
