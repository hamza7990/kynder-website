import { cn } from '@/lib/cn';

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

/**
 * Centered content column: 1120px max width, 24px gutters on mobile and 32px
 * from the 768px breakpoint up (see `.container-kynder` in globals.css).
 */
export function Container<T extends React.ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Component: React.ElementType = as ?? 'div';
  return (
    <Component className={cn('container-kynder', className)} {...props}>
      {children}
    </Component>
  );
}
