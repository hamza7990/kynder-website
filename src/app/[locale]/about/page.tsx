import type { Metadata } from 'next';
import { TrackLink } from '@/components/analytics/track-link';
import { buttonVariants, Container } from '@/components/ui';
import { Reveal } from '@/lib/motion';
import { about as staticAbout } from '@/data/about';
import { buildPageMetadata, pageSeo } from '@/data/seo';
import { PersonJsonLd } from '@/components/seo/person-json-ld';
import { getAboutContent } from '@/lib/content';

export const metadata: Metadata = buildPageMetadata(pageSeo.about, staticAbout.heading);

// Rendered per request so About CMS edits appear immediately.
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const about = await getAboutContent();
  const proofPoints = about.proofPoints;
  return (
    <section className="py-section-lg">
      <PersonJsonLd />
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          {/* Portrait: renders a real image when a local path or uploaded URL is
              set, or falls back to the PENDING placeholder frame if unresolved.
              The 4/5 frame is reserved in both cases so nothing shifts. */}
          <Reveal immediate>
            <div className="mx-auto w-full max-w-[24rem]">
              {/^(https?:\/\/|\/)/.test(about.portrait) ? (
                <img
                  src={about.portrait}
                  alt="Dr Shereen Williams"
                  className="aspect-[4/5] w-full rounded-lg object-cover object-top shadow-2"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center rounded-lg border border-ink-20 bg-cream-card p-8 text-center">
                  <span className="text-small text-ink-70">{about.portrait}</span>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal immediate delay={70}>
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

              <TrackLink
                event="booking_cta_click"
                href="/book"
                className={buttonVariants({ variant: 'primary', size: 'md' })}
              >
                {about.ctaLabel}
              </TrackLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
