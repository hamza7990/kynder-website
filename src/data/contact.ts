/**
 * Contact page copy.
 *
 * Field labels, button labels, validation messages and submit-status text are
 * functional UI copy. The page intro is brand voice the brief does not supply, so
 * it is a [PENDING: ...] placeholder. The contact email itself comes from site.ts.
 */
export const contact = {
  heading: "Contact",
  intro: "[PENDING: contact page intro line]",
  form: {
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    submitLabel: "Send message",
    submittingLabel: "Sending…",
    errors: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      messageRequired: "Please enter a message.",
    },
    // Shown honestly when FORM_ENDPOINT is unset — never a false success.
    notConnected:
      "Message sending is not connected yet. Please email us directly for now.",
    genericError: "Something went wrong sending your message. Please try again.",
    success: "Thanks — your message has been sent.",
  },
  emailFallbackLabel: "Or email us directly:",
} as const;
