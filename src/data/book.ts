/**
 * Booking page copy.
 *
 * Section labels and system messages are functional UI text. The actual session
 * DETAILS (what to expect, length, price, cancellation) and the confirmation
 * wording are brief content the brief does not supply, so they are explicit
 * [PENDING: ...] placeholders — never invent a duration, price or policy.
 */
export const book = {
  heading: "Book a session",
  selectedTopicLabel: "Your topic",
  changeTopicLabel: "Change topic",

  /** Left rail. Labels functional; values are session details. */
  details: [
    { label: "What to expect", value: "A confidential, one-to-one conversation with Shereen — space to think, reflect, challenge assumptions and turn insight into action." },
    { label: "Session length", value: "60 minutes" },
    { label: "Price", value: "Please enquire for current rates" },
    { label: "Cancellation", value: "Free cancellation up to 24 hours before your session" },
  ],

  scheduler: {
    regionLabel: "Booking calendar",
    notConnectedTitle: "Booking calendar not yet connected",
    notConnectedBody:
      "The live scheduling calendar will appear here once booking is configured.",
    loadingLabel: "Loading the booking calendar",
    fallbackTitle: "The booking calendar could not load",
    fallbackContactPrefix: "Please email us to book:",
  },

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
