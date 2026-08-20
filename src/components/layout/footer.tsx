import Link from 'next/link';
import { site as staticSite } from '@/data/site';
import type { SiteContent } from '@/lib/content';
import { NewsletterForm } from './newsletter-form';

const isPending = (value: string) => value.startsWith('[PENDING');

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring rounded-sm text-body text-cream transition-colors duration-fast ease-out hover:text-terracotta"
    >
      {children}
    </Link>
  );
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-small font-semibold uppercase tracking-eyebrow text-terracotta">
      {children}
    </h2>
  );
}

/** External social link, or a plain [PENDING: ...] label when the URL is unset. */
function SocialLink({ label, href }: { label: string; href: string }) {
  if (isPending(href)) {
    return (
      <span className="text-body text-cream">
        {label} — {href}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="focus-ring rounded-sm text-body text-cream transition-colors duration-fast ease-out hover:text-terracotta"
    >
      {label}
    </a>
  );
}

export function Footer({ site }: { site?: SiteContent }) {
  // DB-backed site content with a fall back to the static (env-based) defaults.
  const name = site?.name ?? staticSite.name;
  const tagline = site?.tagline ?? staticSite.tagline;
  const copyright = site?.copyright ?? staticSite.copyright;
  const contactEmail = site?.contactEmail ?? staticSite.contactEmail;
  const social = site?.social ?? staticSite.social;

  return (
    <footer className="bg-navy-deep text-cream">
      <div className="container-kynder py-section-sm">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <span className="font-display text-h3 tracking-[0.04em] text-cream">{name}</span>
            <p className="max-w-[28ch] text-body text-cream">{tagline}</p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="flex flex-col gap-3">
            <ColumnHeading>Explore</ColumnHeading>
            <FooterLink href="/questions">Leadership Questions</FooterLink>
            <FooterLink href="/topics">Coaching Topics</FooterLink>
            <FooterLink href="/book">Book a Session</FooterLink>
          </nav>

          {/* Connect */}
          <nav aria-label="Connect" className="flex flex-col gap-3">
            <ColumnHeading>Connect</ColumnHeading>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <SocialLink label="LinkedIn" href={social.linkedin} />
            <SocialLink label="Instagram" href={social.instagram} />
            <SocialLink label="YouTube" href={social.youtube} />
            {isPending(contactEmail) ? (
              <span className="text-body text-cream">{contactEmail}</span>
            ) : (
              <a
                href={`mailto:${contactEmail}`}
                className="focus-ring rounded-sm text-body text-cream transition-colors duration-fast ease-out hover:text-terracotta"
              >
                {contactEmail}
              </a>
            )}
          </nav>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <ColumnHeading>Stay in touch</ColumnHeading>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-cream/20 pt-8 text-small text-cream xs:flex-row xs:items-center xs:justify-between">
          <p>{copyright}</p>
          <Link
            href="/login"
            className="text-xs text-cream/70 hover:text-terracotta transition-colors"
          >
            Coach & Admin Portal →
          </Link>
        </div>
      </div>
    </footer>
  );
}
