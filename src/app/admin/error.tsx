'use client';

/**
 * Error boundary for the whole /admin section. A failed database call (or any
 * render error) shows this recoverable panel instead of white-screening.
 */
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md rounded-2xl border border-ink-10 bg-cream-card p-8 text-center shadow-1">
        <h1 className="font-display text-h3 font-bold text-navy-deep">
          Something went wrong
        </h1>
        <p className="mt-2 text-body text-ink-70">
          The admin area hit an error — this is often a temporary database issue.
          Your data is safe. Try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-navy-deep px-5 py-2.5 text-small font-semibold text-cream transition-colors hover:bg-navy-hover"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
