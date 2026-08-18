/**
 * Coaching Topics — page content.
 *
 * SOURCE: KYNDER Website Design Brief, Part 5 ("The topic list (15 to start, not limited to)").
 *
 * The brief lists each topic as a single line: "<title> — <blurb>".
 * `title` and `blurb` below are that line split on the em dash; concatenating them
 * as `${title} — ${blurb}` reproduces the brief's line character-for-character.
 *
 * `cluster` is a presentation-only grouping. It adds no copy and changes no text —
 * it exists so the page reads as four grouped sets rather than a flat wall of 15
 * identical cards. The brief does not name these groups; they are not shown as
 * client copy without approval.
 *
 * `slug` is derived kebab-case from the title. The brief specifies no slugs.
 */

export type Cluster = "conversations" | "team-trust" | "self" | "growth";

export type Topic = {
  slug: string;
  title: string;
  blurb: string;
  cluster: Cluster;
};

export const topics: Topic[] = [
  {
    slug: "having-hard-conversations",
    title: "Having hard conversations",
    blurb: "say what needs saying, without losing the relationship",
    cluster: "conversations",
  },
  {
    slug: "listening-better",
    title: "Listening better",
    blurb: "move from waiting to reply, to actually hearing people",
    cluster: "conversations",
  },
  {
    slug: "giving-and-receiving-feedback",
    title: "Giving and receiving feedback",
    blurb: "feedback that lands, and feedback you can actually use",
    cluster: "conversations",
  },
  {
    slug: "managing-conflict-on-your-team",
    title: "Managing conflict on your team",
    blurb: "address tension before it becomes dysfunction",
    cluster: "conversations",
  },
  {
    slug: "leading-through-change",
    title: "Leading through change",
    blurb: "keep your team steady when the ground is shifting",
    cluster: "team-trust",
  },
  {
    slug: "delegation-and-letting-go",
    title: "Delegation and letting go",
    blurb: "hand off real ownership, not just tasks",
    cluster: "team-trust",
  },
  {
    slug: "building-trust-as-a-new-manager",
    title: "Building trust as a new manager",
    blurb: "earn credibility in the first 90 days",
    cluster: "team-trust",
  },
  {
    slug: "building-psychological-safety",
    title: "Building psychological safety",
    blurb: "make it safe for your team to speak up and fail forward",
    cluster: "team-trust",
  },
  {
    slug: "imposter-syndrome",
    title: "Imposter syndrome",
    blurb: "lead confidently even when you feel unsure",
    cluster: "self",
  },
  {
    slug: "burnout-and-sustainable-leadership",
    title: "Burnout and sustainable leadership",
    blurb: "lead well without running yourself into the ground",
    cluster: "self",
  },
  {
    slug: "work-life-boundaries",
    title: "Work-life boundaries",
    blurb: "lead fully without disappearing from your own life",
    cluster: "self",
  },
  {
    slug: "navigating-up",
    title: "Navigating up",
    blurb: "manage expectations with your own manager or board",
    cluster: "growth",
  },
  {
    slug: "executive-presence",
    title: "Executive presence",
    blurb: "show up with authority in the room that matters",
    cluster: "growth",
  },
  {
    slug: "career-transitions",
    title: "Career transitions",
    blurb: "step into a bigger role, or a different one entirely",
    cluster: "growth",
  },
  {
    slug: "cross-cultural-leadership",
    title: "Cross-cultural leadership",
    blurb: "lead well across different markets and teams",
    cluster: "growth",
  },
];

/** Intro line for the page — visitors bring a topic, we match them to the right coach. */
export const poolLine = "a growing pool of accredited coaches";

/** Closing line under the topic grid. Note the leading ellipsis character (U+2026). */
export const moreLine =
  "…and more. If your topic isn't listed, tell us — we'll match you regardless.";

/** Three short trust markers shown below the grid. */
export const trustMarkers = [
  "Accredited coaches",
  "Confidential, always",
  "Matched to your topic and level",
] as const;

/** Reconstructs the brief's original single-line form, for the verbatim snapshot test. */
export const topicLine = (t: Topic): string => `${t.title} — ${t.blurb}`;
