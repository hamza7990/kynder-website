/**
 * Home page copy.
 *
 * SOURCE RULE: every string here is either (a) verbatim from the KYNDER Website
 * Design Brief, with the Part it came from noted, or (b) an explicit
 * "[PENDING: ...]" placeholder because the brief does not supply it.
 *
 * There is no third category. If a string is needed and the brief does not have
 * it, it becomes a PENDING placeholder and goes to the client — it is never
 * written here. The previous homepage mockup invented a "six pillars" framework,
 * an attributed quote, a "6 pillars" statistic and a rescheduling policy, none of
 * which exist in the brief. That is the failure mode this file prevents.
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
  /**
   * An eyebrow line above the headline is a design device the brief does not
   * supply copy for. Ask the client, or render no eyebrow at all — do not write one.
   */
  eyebrow: "[PENDING: hero eyebrow, or confirm we ship without one]",
  /** Brief Part 3, Phase 1 Home — the required call to action, exact label. */
  primaryCta: { label: "Book a 1-on-1 Session", href: "/book" },
  /** Secondary path into the Leadership Questions page (Brief Part 3 / Part 4). */
  secondaryCta: { label: "Explore the 10 Questions", href: "/questions" },
} as const;

/**
 * A single quiet positioning statement, shown between the hero and the previews.
 *
 * The brief's positioning paragraph IS hero.lead (Part 1, "Positioning"); it must
 * not be restated here, and the brief supplies no second, distinct line for this
 * slot — so it is a PENDING placeholder, rendered literally, never invented.
 */
export const positioning = {
  statement: "[PENDING: a single quiet positioning line, distinct from the hero lead]",
} as const;

/**
 * Proof/credential figures.
 *
 * ONLY these three are supported by the brief (Part 1 voice example; Part 3
 * About page requirements: "DProf, 25+ years, research reach"). Every one of
 * them must still be confirmed by the client before launch — the brief states
 * them in passing, not as approved marketing figures.
 *
 * Do NOT add a fourth stat. The mockup's "6 pillars" and "15+ coaching topics"
 * counts were invented; the six pillar names exist only as tags on the ten
 * questions, and were never a framework the client published.
 */
export const proofPoints = [
  { value: "DProf", label: "[PENDING: confirm doctorate label as it should appear]" },
  { value: "25+", label: "years of experience" },
  { value: "17+", label: "countries of doctoral research" },
] as const;

export const questionsPreview = {
  /** Brief Part 4 page name. */
  heading: "The 10 Leadership Questions",
  /** Not supplied by the brief. */
  lead: "[PENDING: one-line intro to the questions preview]",
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
  heading: "[PENDING: About section heading]",
  /** Brief Part 1, Voice and tone — given as the model Say example. */
  researchLine: "Built on doctoral research across 17+ countries.",
  /** Brief Part 3 requires bio copy on /about; final bio copy is a Part 7 deliverable. */
  body: "[PENDING: 2-paragraph bio summary — client to supply final bio copy]",
  /** Brief Part 2, Imagery style: real photography for anything showing Dr. Williams. */
  portrait: "[PENDING: headshot — real photography, not illustration]",
  linkLabel: "About Dr. Shereen Williams",
  href: "/about",
} as const;

export const ctaBand = {
  heading: "[PENDING: closing CTA heading]",
  body: "[PENDING: closing CTA supporting line]",
  cta: { label: "Book a 1-on-1 Session", href: "/book" },
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
