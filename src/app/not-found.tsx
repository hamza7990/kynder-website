import Link from 'next/link';
import { buttonVariants, Container } from '@/components/ui';
import { notFoundCopy } from '@/data/not-found';

// Static export renders this to /404.html, which most hosts serve for unknown
// paths (see the host config in docs/HANDOVER.md).
export default function NotFound() {
  return (
    <section className="py-section-lg">
      <Container>
        <div className="mx-auto flex max-w-[46rem] flex-col items-center gap-6 text-center">
          <span className="font-sans text-small font-semibold uppercase tracking-eyebrow text-navy">
            {notFoundCopy.code}
          </span>
          <h1 className="font-display text-h2 tracking-display text-navy-deep md:text-display-2">
            {notFoundCopy.heading}
          </h1>
          <p className="max-w-[54ch] text-lead text-ink-80">{notFoundCopy.body}</p>
          <div className="mt-2 flex w-full flex-col gap-3 xs:w-auto xs:flex-row">
            {notFoundCopy.links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={buttonVariants({ variant: i === 0 ? 'primary' : 'ghost', size: 'md' })}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
