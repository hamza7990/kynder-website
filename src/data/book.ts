/**
 * Booking page copy.
 *
 * The page heading, the session DETAILS (what to expect, length, price,
 * cancellation) and the confirmation wording are client-facing content — the brief
 * supplies none, so several are [PENDING: ...] placeholders; never invent a
 * duration, price or policy. These stay here and are translated in A3.
 *
 * The functional booking CHROME (selected-topic label, change-topic link, the
 * scheduler system-state messages) and the direct booking FORM moved into the
 * public interface dictionary (src/i18n/public, `booking.*` / `bookForm.*`) in A2
 * Slice 4 — see book-content / scheduler-embed / direct-booking-form `usePublicT`.
 */
export const book = {
  heading: "Book a session",

  /** Left rail. Labels functional; values are session details. */
  details: [
    { label: "What to expect", value: "A confidential, one-to-one conversation with Shereen — space to think, reflect, challenge assumptions and turn insight into action." },
    { label: "Session length", value: "60 minutes" },
    { label: "Price", value: "Please enquire for current rates" },
    { label: "Cancellation", value: "Free cancellation up to 24 hours before your session" },
  ],

  noTopic: {
    title: "Choose a topic to book",
    body: "Pick the area you want to work on from the coaching topics, and we will match you to the right coach.",
    cta: "Browse coaching topics",
  },

  confirmed: {
    heading: "You're booked — see you soon.",
    body: "Check your email for a confirmation with the session details. In the meantime, you might find it helpful to sit with one of the 10 Leadership Questions before your session.",
    cta: "Explore the 10 Questions",
  },
} as const;
