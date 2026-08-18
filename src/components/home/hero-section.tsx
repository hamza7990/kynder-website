import Link from 'next/link';
import { buttonVariants } from '@/components/ui';
import { Container } from '@/components/ui';
import { Reveal } from '@/lib/motion';
import { hero } from '@/data/home';
import { Section } from './section';
import { Ripples } from './ripples';

/**
 * Renders the headline with its emphasised word in italic display serif /
 * terracotta. Splitting on the exact substring adds and removes no words.
 */
function Headline() {
  const { headline, headlineEmphasis } = hero;
  const at = headline.indexOf(headlineEmphasis);
  if (at === -1) {
    return <>{headline}</>;
  }
  return (
    <>
      {headline.slice(0, at)}
      <em className="font-display italic text-terracotta-ink">{headlineEmphasis}</em>
      {headline.slice(at + headlineEmphasis.length)}
    </>
  );
}

export function HeroSection() {
  return (
    // 160 padding: a grand, unhurried opening — the tallest rhythm on the page.
    <Section space="lg" className="overflow-hidden">
      <Ripples />
      <Container className="relative">
        <Reveal className="mx-auto flex max-w-[46rem] flex-col items-center gap-6 text-center">
          <span className="font-sans text-small font-semibold uppercase tracking-eyebrow text-navy">
            {hero.eyebrow}
          </span>
          <h1 className="text-balance font-display text-h2 tracking-display text-navy-deep xs:text-display-2 lg:text-display-1">
            <Headline />
          </h1>
          <p className="max-w-[54ch] text-lead text-ink-80">{hero.lead}</p>
          <div className="mt-2 flex w-full flex-col gap-3 xs:w-auto xs:flex-row">
            <Link
              href={hero.primaryCta.href}
              className={buttonVariants({ variant: 'primary', size: 'md' })}
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className={buttonVariants({ variant: 'ghost', size: 'md' })}
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
