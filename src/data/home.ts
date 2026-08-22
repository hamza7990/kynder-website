/**
 * Home page copy.
 *
 * Content drawn from the client-supplied biography of Dr. Shereen Williams
 * and the KYNDER brand positioning. PENDING items have been resolved with
 * copy that stays faithful to the brand voice and the supplied materials.
 *
 * Section headings below are page/section NAMES taken from the brief's own
 * structure (Part 3, Part 4, Part 5), not marketing copy written for the site.
 */

export const hero = {
  /** Brief Part 1, "Voice and tone" — given as the model Say example. */
  headline: "Leadership starts with self-awareness.",
  /**
   * The word set in italic display serif within the headline above.
   * Presentation choice, not copy — it adds and removes no words.
   */
  headlineEmphasis: "self-awareness",
  /** Brief Part 1, "Positioning" — verbatim, the whole paragraph. */
  lead:
    "Kynder is a leadership development brand built around a simple idea: kind leadership is strong leadership. It offers real, human-led coaching with Dr. Shereen Williams, grounded in original doctoral research into what makes leaders effective across cultures.",
  /** Eyebrow line above the headline — drawn from the brand's own tagline. */
  eyebrow: "Human-led leadership coaching",
  /** Brief Part 3, Phase 1 Home — the required call to action, exact label. */
  primaryCta: { label: "Talk to Shereen", href: "/book" },
  /** Secondary path into the Leadership Questions page (Brief Part 3 / Part 4). */
  secondaryCta: { label: "Explore the 10 Questions", href: "/questions" },
} as const;

/**
 * A single quiet positioning statement, shown between the hero and the previews.
 * Drawn from the core brand belief — the human insight behind KYNDER.
 */
export const positioning = {
  statement: "Sometimes people don't need more information — they need a safe space to think.",
} as const;

/**
 * Proof/credential figures.
 *
 * These three are supported by the client-supplied biography. DProf is confirmed
 * as "Professional Doctorate in Leadership & Cultural Transformation with
 * Distinction". 25+ years of experience and doctoral research across 17+ countries.
 */
export const proofPoints = [
  { value: "DProf", label: "Professional Doctorate with Distinction" },
  { value: "25+", label: "years of experience" },
  { value: "17+", label: "countries of doctoral research" },
] as const;

export const questionsPreview = {
  /** Brief Part 4 page name. */
  heading: "The 10 Leadership Questions",
  /** Intro line drawn from the closing sentiment of the questions page. */
  lead: "Honest questions that help leaders think, reflect and act — with five practical steps each.",
  /** Number of questions shown on the home page. The rest live on /questions. */
  count: 3,
  linkLabel: "See all 10 questions",
  href: "/questions",
} as const;

export const topicsPreview = {
  /** Brief Part 5 page name. */
  heading: "Coaching Topics",
  /**
   * Brief Part 5, opening line — the matching model stated in the client's own
   * words: visitors bring a topic, Kynder matches them to the right coach.
   */
  lead: "Visitors choose a topic, not a face — we match them to the right coach.",
  /** Number of topic cards shown on the home page. All 15 live on /topics. */
  count: 6,
  linkLabel: "See all coaching topics",
  href: "/topics",
} as const;

export const aboutTeaser = {
  heading: "Meet Dr Shereen Williams",
  /** Brief Part 1, Voice and tone — given as the model Say example. */
  researchLine: "Built on doctoral research across 17+ countries.",
  /** Two-sentence bio summary drawn from the full bio. */
  body: "ICF-certified coach, author of The Currency of Kindness, and Managing Director of the Global Kindness Institute. Shereen brings 25+ years of leadership and transformation experience to every session.",
  /** Real portrait photograph. */
  portrait: "/shereen-williams.jpg",
  linkLabel: "About Dr Shereen Williams",
  href: "/about",
} as const;

export const ctaBand = {
  heading: "Talk it through.",
  body: "You don't need to have everything figured out before you book. Whether you're navigating a career decision, preparing for a difficult conversation or simply need a confidential space to think — book time with Shereen.",
  cta: { label: "Talk to Shereen", href: "/book" },
} as const;

/**
 * Sections the brief does NOT authorise on the home page. Listed so nobody
 * reintroduces them from the old mockup:
 *   - a "six pillars" framework section (not in the brief; KQ / Currency of
 *     Kindness is Phase 2 material)
 *   - any quotation attributed to Dr. Williams (none supplied)
 *   - testimonials, client logos, or partner marks (Part 7: only once approved)
 *   - coach names, photos, titles or biographies (Part 5, IMPORTANT box)
 *   - Phase 2 content: Programmes, Insights, Corporate / GKI
 */
