import Link from 'next/link';
import { cn } from '@/lib/cn';
import { nav } from '@/data/nav';

/** Desktop primary navigation (shown from the `md` breakpoint up). */
export function Nav({ className }: { className?: string }) {
  return (
    <nav aria-label="Primary" className={cn('flex items-center gap-8', className)}>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="focus-ring rounded-sm font-sans text-small font-medium text-navy-deep transition-colors duration-fast ease-out hover:text-terracotta"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
