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

  /** Left rail. Labels functional; values are PENDING brief content. */
  details: [
    { label: "What to expect", value: "[PENDING: what to expect in a session]" },
    { label: "Session length", value: "[PENDING: session length]" },
    { label: "Price", value: "[PENDING: session price]" },
    { label: "Cancellation", value: "[PENDING: cancellation terms]" },
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
    heading: "[PENDING: confirmation page heading]",
    body: "[PENDING: confirmation page message]",
    cta: "Explore the 10 Questions",
  },
} as const;
