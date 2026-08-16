import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

function Fixture() {
  return (
    <Accordion type="single" defaultValue={['a']}>
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First panel</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second panel</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders triggers as buttons with aria-expanded reflecting open state', () => {
    render(<Fixture />);
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('wires each trigger to its panel via aria-controls', () => {
    render(<Fixture />);
    const trigger = screen.getByRole('button', { name: 'First' });
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toHaveAttribute('role', 'region');
  });

  it('opens a closed item and collapses the previous one in single mode', async () => {
    render(<Fixture />);
    const second = screen.getByRole('button', { name: 'Second' });
    await userEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('moves focus with ArrowDown between triggers', async () => {
    render(<Fixture />);
    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
  });
});
