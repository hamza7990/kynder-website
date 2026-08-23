import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  Container,
  Field,
  Input,
  Reveal,
  SectionHeader,
  Textarea,
} from '@/components/ui';

// Excluded from search indexing; also kept out of nav + sitemap via
// src/lib/routes.ts (HIDDEN_ROUTES).
export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

const COLORS: { token: string; className: string }[] = [
  { token: '--navy-deep', className: 'bg-navy-deep' },
  { token: '--navy', className: 'bg-navy' },
  { token: '--terracotta', className: 'bg-terracotta' },
  { token: '--gold', className: 'bg-gold' },
  { token: '--cream', className: 'bg-cream' },
  { token: '--cream-card', className: 'bg-cream-card' },
  { token: '--ink', className: 'bg-ink' },
];

const TYPE_SCALE: { label: string; className: string; sample: string }[] = [
  { label: 'display-1 · 64', className: 'text-display-1', sample: 'Lead with clarity' },
  { label: 'display-2 · 48', className: 'text-display-2', sample: 'Lead with clarity' },
  { label: 'h2 · 36', className: 'text-h2', sample: 'Section heading' },
  { label: 'h3 · 28', className: 'text-h3', sample: 'Subsection heading' },
  { label: 'h4 · 22', className: 'text-h4', sample: 'Card heading' },
  { label: 'lead · 18', className: 'text-lead', sample: 'A leading paragraph that introduces the section.' },
  { label: 'body · 16', className: 'text-body', sample: 'Body copy with a comfortable 1.6 line height for reading.' },
  { label: 'small · 14', className: 'text-small', sample: 'Small supporting text and captions.' },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-ink-10 py-section-sm first:border-t-0">
      <h2 className="font-display text-h3 text-navy-deep">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-small font-medium text-ink-70">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-cream py-section-sm text-ink">
      <Container>
        <header className="flex flex-col gap-4 pb-section-sm">
          <Badge variant="gold">Internal</Badge>
          <h1 className="font-display text-display-2 text-navy-deep">KYNDER Styleguide</h1>
          <p className="max-w-[60ch] text-lead text-ink-70">
            Every design-system primitive in every state. This route is excluded from
            navigation, the sitemap and search indexing.
          </p>
        </header>

        {/* -------------------------------- Colour -------------------------------- */}
        <Block title="Colour">
          <div className="grid grid-cols-2 gap-6 xs:grid-cols-3 md:grid-cols-4">
            {COLORS.map(({ token, className }) => (
              <div key={token} className="flex flex-col gap-2">
                <div className={`h-20 w-full rounded-md border border-ink-10 ${className}`} />
                <code className="text-small text-ink">{token}</code>
              </div>
            ))}
          </div>
        </Block>

        {/* ----------------------------- Typography ------------------------------- */}
        <Block title="Typography">
          <div className="flex flex-col gap-6">
            {TYPE_SCALE.map(({ label, className, sample }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-small font-medium text-ink-70">{label}</span>
                <span className={`${className} text-ink`}>{sample}</span>
              </div>
            ))}
          </div>
        </Block>

        {/* ------------------------------- Buttons -------------------------------- */}
        <Block title="Buttons">
          <Row label="Primary — sizes">
            <Button size="sm">Book a session</Button>
            <Button size="md">Book a session</Button>
          </Row>
          <Row label="Primary — states (default · loading · disabled)">
            <Button>Default</Button>
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Row label="Ghost — sizes & states">
            <Button variant="ghost" size="sm">
              Learn more
            </Button>
            <Button variant="ghost" size="md">
              Learn more
            </Button>
            <Button variant="ghost" disabled>
              Disabled
            </Button>
          </Row>
          <Row label="Ghost-light — on a dark surface">
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-navy-deep p-6">
              <Button variant="ghost-light" size="sm">
                Explore
              </Button>
              <Button variant="ghost-light" size="md">
                Explore
              </Button>
              <Button variant="ghost-light" disabled>
                Disabled
              </Button>
            </div>
          </Row>
        </Block>

        {/* -------------------------------- Badges -------------------------------- */}
        <Block title="Badges (pillar tags)">
          <div className="flex flex-wrap gap-4">
            <Badge variant="terracotta">Leadership</Badge>
            <Badge variant="gold">Strategy</Badge>
            <Badge variant="neutral">Culture</Badge>
          </div>
        </Block>

        {/* -------------------------------- Cards --------------------------------- */}
        <Block title="Cards">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card elevation={1}>
              <h3 className="font-display text-h4 text-navy-deep">Cream card</h3>
              <p className="mt-2 text-body text-ink-70">Elevation 1, default surface.</p>
            </Card>
            <Card surface="cream" elevation={2} bordered>
              <h3 className="font-display text-h4 text-navy-deep">Cream surface</h3>
              <p className="mt-2 text-body text-ink-70">Elevation 2, bordered.</p>
            </Card>
            <Card elevation={3} padding="lg">
              <h3 className="font-display text-h4 text-navy-deep">Elevated</h3>
              <p className="mt-2 text-body text-ink-70">Elevation 3, large padding.</p>
            </Card>
          </div>
        </Block>

        {/* ---------------------------- SectionHeader ----------------------------- */}
        <Block title="Section header">
          <SectionHeader
            eyebrow="How it works"
            title="A calmer path to better leadership"
            lead="An optional lead paragraph that frames the section for the reader."
          />
          <div className="mt-8 rounded-lg bg-navy-deep p-8">
            <SectionHeader
              tone="dark"
              eyebrow="On dark"
              title="The same header on a dark surface"
              lead="Accent and text colours adapt to stay legible."
            />
          </div>
        </Block>

        {/* ---------------------------- Form controls ----------------------------- */}
        <Block title="Form controls">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Full name" hint="As you'd like to be addressed.">
              <Input placeholder="Jane Doe" />
            </Field>
            <Field label="Work email" error="Please enter a valid email address.">
              <Input type="email" defaultValue="not-an-email" />
            </Field>
            <Field label="Disabled">
              <Input placeholder="Unavailable" disabled />
            </Field>
            <Field label="Message" hint="A short note about your goals.">
              <Textarea placeholder="What would you like to work on?" />
            </Field>
          </div>
        </Block>

        {/* ------------------------------ Accordion ------------------------------- */}
        <Block title="Accordion">
          <Accordion type="single" defaultValue={['item-1']} className="max-w-[640px]">
            <AccordionItem value="item-1">
              <AccordionTrigger>What happens in a first session?</AccordionTrigger>
              <AccordionContent>
                We map where you are, where you want to be, and the smallest next step.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How long is a coaching engagement?</AccordionTrigger>
              <AccordionContent>
                Most engagements run three to six months, with sessions every two weeks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you work with teams?</AccordionTrigger>
              <AccordionContent>
                Yes — alongside individual coaching we facilitate team sessions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Block>

        {/* -------------------------------- Reveal -------------------------------- */}
        <Block title="Reveal (scroll-reveal wrapper)">
          <Reveal>
            <Card>
              <p className="text-body text-ink-70">
                This card fades and lifts into view on scroll. With reduced motion it appears
                instantly.
              </p>
            </Card>
          </Reveal>
        </Block>

        {/* ---------------------------- Radius & shadow --------------------------- */}
        <Block title="Radius & elevation">
          <Row label="Radius — sm · md · lg · full">
            <div className="h-16 w-16 rounded-sm bg-cream-card" />
            <div className="h-16 w-16 rounded-md bg-cream-card" />
            <div className="h-16 w-16 rounded-lg bg-cream-card" />
            <div className="h-16 w-16 rounded-full bg-cream-card" />
          </Row>
          <Row label="Shadow — 1 · 2 · 3">
            <div className="h-16 w-16 rounded-md bg-cream shadow-1" />
            <div className="h-16 w-16 rounded-md bg-cream shadow-2" />
            <div className="h-16 w-16 rounded-md bg-cream shadow-3" />
          </Row>
        </Block>
      </Container>
    </div>
  );
}
