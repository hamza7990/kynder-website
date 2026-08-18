import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants, Container } from '@/components/ui';
import { closingCta, closingLine, heading } from '@/data/questions';
import { QuestionsExperience } from '@/components/questions/questions-experience';

export const metadata: Metadata = {
  title: heading,
};

export default function QuestionsPage() {
  return (
    <section className="py-section-lg">
      <Container>
        <h1 className="max-w-[18ch] text-balance font-display text-h2 tracking-display text-navy-deep md:text-display-2">
          {heading}
        </h1>

        <div className="mt-12">
          <QuestionsExperience />
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-ink-10 pt-12">
          <p className="max-w-[60ch] text-lead text-ink-80">{closingLine}</p>
          <Link href="/book" className={buttonVariants({ variant: 'primary', size: 'md' })}>
            {closingCta}
          </Link>
        </div>
      </Container>
    </section>
  );
}
