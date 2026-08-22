import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/ui';
import { book } from '@/data/book';
import { BookContent } from '@/components/book/book-content';
import { buildPageMetadata, pageSeo } from '@/data/seo';

export const metadata: Metadata = buildPageMetadata(pageSeo.book, book.heading);

export default function BookPage() {
  return (
    <section className="py-section-lg">
      <Container>
        <h1 className="max-w-[18ch] text-balance font-display text-h2 tracking-display text-navy-deep md:text-display-2">
          {book.heading}
        </h1>
        <div className="mt-12">
          {/* useSearchParams needs a Suspense boundary in the static export. */}
          <Suspense fallback={<div aria-hidden="true" className="min-h-[28rem]" />}>
            <BookContent />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
