import { Container } from '@/components/ui';
import { Reveal } from '@/lib/motion';
import { positioning } from '@/data/home';
import { Section } from './section';

/**
 * A single quiet positioning statement. 96 padding: a deliberately tight breath
 * after the tall hero, so the line reads as a pause, not another content block.
 * Copy is a [PENDING: ...] placeholder from home.ts — rendered literally.
 */
export function PositioningSection() {
  return (
    <Section space="sm">
      <Container>
        <Reveal>
          <p className="mx-auto max-w-[46ch] text-balance text-center font-display text-h3 text-navy-deep">
            {positioning.statement}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
