/**
 * Newsletter sign-up copy.
 *
 * Functional UI text (labels, status messages). Submission posts to
 * NEWSLETTER_ENDPOINT; while that is unset the form validates but reports
 * honestly that sign-up is not connected — it never shows a fake success.
 */
export const newsletter = {
  emailLabel: 'Email address',
  placeholder: 'you@example.com',
  submitLabel: 'Sign up',
  submittingLabel: 'Signing up…',
  invalidEmail: 'Please enter a valid email address.',
  notConnected: 'Newsletter sign-up is not connected yet. Please check back soon.',
  success: 'Thanks — you are on the list.',
  error: 'Something went wrong. Please try again.',
} as const;
