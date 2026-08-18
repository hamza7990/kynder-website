import Link from 'next/link';
import { buttonVariants, Container, SectionHeader } from '@/components/ui';
import { Reveal, staggerDelay } from '@/lib/motion';
import { aboutTeaser, proofPoints } from '@/data/home';
import { Section } from './section';

export function AboutTeaser() {
  return (
    // 160 padding; cream — the spacious, personal centrepiece of the page.
    <Section space="lg">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Portrait placeholder frame: fixed 4:5 aspect so no layout shift
              occurs when the real photograph replaces it. Label is the literal
              [PENDING: ...] string from home.ts. */}
          <Reveal>
            <div className="mx-auto w-full max-w-[22rem]">
              <div className="flex aspect-[4/5] items-center justify-center rounded-lg border border-ink-20 bg-cream-card p-8 text-center">
                <span className="text-small text-ink-70">{aboutTeaser.portrait}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={staggerDelay(1)}>
            <div className="flex flex-col gap-6">
              <SectionHeader as="h2" title={aboutTeaser.heading} lead={aboutTeaser.body} />
              <p className="text-lead text-navy">{aboutTeaser.researchLine}</p>

              {/* The three proof points — placed with the About teaser, never the
                  hero. Exactly three, straight from home.ts. */}
              <dl className="grid grid-cols-3 gap-6 border-t border-ink-10 pt-6">
                {proofPoints.map((point) => (
                  <div key={point.value} className="flex flex-col gap-1">
                    <dt className="font-display text-h3 text-navy-deep">{point.value}</dt>
                    <dd className="text-small text-ink-70">{point.label}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href={aboutTeaser.href}
                className={buttonVariants({ variant: 'ghost', size: 'md' })}
              >
                {aboutTeaser.linkLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
