import { TrackLink } from '@/components/analytics/track-link';
import { buttonVariants, Container, SectionHeader } from '@/components/ui';
import { Reveal } from '@/lib/motion';
import { ctaBand } from '@/data/home';
import { Section } from './section';
import { Ripples } from './ripples';

export function CtaBand() {
  return (
    // 96 padding; navy-deep — the one dark surface, marking the decisive
    // conversion moment. Ambient ripples echo the hero on the closing beat.
    <Section space="sm" surface="navy" className="overflow-hidden">
      <Ripples />
      <Container className="relative">
        <Reveal className="mx-auto flex max-w-[40rem] flex-col items-center gap-8 text-center">
          <SectionHeader
            as="h2"
            tone="dark"
            align="center"
            title={ctaBand.heading}
            lead={ctaBand.body}
          />
          <TrackLink
            event="booking_cta_click"
            href={ctaBand.cta.href}
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            {ctaBand.cta.label}
          </TrackLink>
        </Reveal>
      </Container>
    </Section>
  );
}
