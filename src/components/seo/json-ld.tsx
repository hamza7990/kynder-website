/**
 * Renders a JSON-LD <script>. Server-only; the object is serialised at build so
 * the markup is present in the static HTML for crawlers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Data is authored from our own config/brief content, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
