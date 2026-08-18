import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants, Container } from '@/components/ui';
import { Reveal } from '@/lib/motion';
import { about } from '@/data/about';
import { proofPoints } from '@/data/home';

export const metadata: Metadata = { title: about.heading };

export default function AboutPage() {
  return (
    <section className="py-section-lg">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          {/* Portrait placeholder frame — fixed 4:5 so no layout shift occurs when
              the real photograph replaces it. Label is the literal PENDING string. */}
          <Reveal>
            <div className="mx-auto w-full max-w-[24rem]">
              <div className="flex aspect-[4/5] items-center justify-center rounded-lg border border-ink-20 bg-cream-card p-8 text-center">
                <span className="text-small text-ink-70">{about.portrait}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-h2 tracking-display text-navy-deep md:text-display-2">
                  {about.heading}
                </h1>
                <p className="text-lead text-ink-80">{about.intro}</p>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="font-display text-h4 text-navy-deep">{about.bioHeading}</h2>
                <p className="max-w-[60ch] text-body text-ink-80">{about.bio}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-h4 text-navy-deep">{about.storyHeading}</h2>
                <p className="max-w-[60ch] text-body text-ink-80">{about.story}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-h4 text-navy-deep">{about.credentialsHeading}</h2>
                <p className="max-w-[60ch] text-body text-ink-80">{about.credentials}</p>
              </div>

              {/* The three proof points reused from home.ts — no new figures. */}
              <dl className="grid grid-cols-3 gap-6 border-t border-ink-10 pt-6">
                {proofPoints.map((point) => (
                  <div key={point.value} className="flex flex-col gap-1">
                    <dt className="font-display text-h3 text-navy-deep">{point.value}</dt>
                    <dd className="text-small text-ink-70">{point.label}</dd>
                  </div>
                ))}
              </dl>

              <Link href="/book" className={buttonVariants({ variant: 'primary', size: 'md' })}>
                {about.ctaLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
