import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { contact } from '@/data/contact';
import { site } from '@/data/site';
import { ContactForm } from '@/components/contact/contact-form';
import { buildPageMetadata, pageSeo } from '@/data/seo';
import { isLocale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(pageSeo.contact, contact.heading, isLocale(locale) ? locale : 'en');
}

const isPending = (value: string) => value.startsWith('[PENDING');

export default function ContactPage() {
  return (
    <section className="py-section-lg">
      <Container>
        <div className="flex max-w-[42rem] flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-h2 tracking-display text-navy-deep md:text-display-2">
              {contact.heading}
            </h1>
            <p className="text-lead text-ink-80">{contact.intro}</p>
          </div>

          <ContactForm />

          <p className="border-t border-ink-10 pt-6 text-body text-ink-70">
            {contact.emailFallbackLabel}{' '}
            {isPending(site.contactEmail) ? (
              <span>{site.contactEmail}</span>
            ) : (
              <a
                href={`mailto:${site.contactEmail}`}
                className="focus-ring rounded-sm text-navy-deep underline transition-colors duration-fast ease-out hover:text-terracotta"
              >
                {site.contactEmail}
              </a>
            )}
          </p>
        </div>
      </Container>
    </section>
  );
}
