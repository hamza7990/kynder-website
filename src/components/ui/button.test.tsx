import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders a native <button>, not a <div>', () => {
    render(<Button>Click</Button>);
    const el = screen.getByRole('button', { name: 'Click' });
    expect(el.tagName).toBe('BUTTON');
  });

  it('defaults to type="button"', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies the correct variant and size classes', () => {
    const { rerender } = render(<Button variant="primary">A</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-terracotta');

    rerender(
      <Button variant="ghost" size="sm">
        A
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('border', 'h-9');
  });

  it('shows a spinner, disables and marks aria-busy while loading', () => {
    render(<Button isLoading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards its ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
