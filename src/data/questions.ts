/**
 * The 10 Leadership Questions — page content.
 *
 * SOURCE: KYNDER Website Design Brief, Part 4.
 * The brief states: "Please use this text exactly — do not paraphrase or shorten it."
 *
 * Punctuation is character-for-character as authored: straight apostrophes (U+0027),
 * straight double quotes (U+0022), em dashes (U+2014). Do not let an editor or
 * formatter "smarten" these into curly quotes — the snapshot test compares exactly.
 */

export type Pillar =
  | "COURAGE"
  | "COMMUNICATION"
  | "EMPATHY"
  | "SELF-AWARENESS"
  | "CONSISTENCY"
  | "GROWTH MINDSET";

export type Question = {
  /** Display number, "01"–"10". Also the deep-link anchor: /questions#q-01 */
  no: string;
  question: string;
  pillar: Pillar;
  steps: [string, string, string, string, string];
};

export const questions: Question[] = [
  {
    no: "01",
    question:
      "What conversation have I been avoiding — and what am I afraid will happen if I have it?",
    pillar: "COURAGE",
    steps: [
      "Name the conversation out loud, or write it down — vague avoidance thrives on staying unnamed.",
      "Write down exactly what you're afraid will happen if you have it.",
      "Ask yourself what happens if you avoid it for another month.",
      "Choose one sentence you could open with — nothing else, just the opener.",
      "Put a date on your calendar this week to have it.",
    ],
  },
  {
    no: "02",
    question:
      "When someone pushes back on me, do I actually listen — or am I just waiting to respond?",
    pillar: "COMMUNICATION",
    steps: [
      "Next time someone disagrees, count to three before replying.",
      "Repeat back what they said, in your own words, before you respond.",
      "Ask one genuine follow-up question instead of defending your position.",
      "Notice if your body tenses when challenged — that's often the tell.",
      "Afterwards, ask yourself honestly: did I actually change my mind about anything?",
    ],
  },
  {
    no: "03",
    question: "Whose voice on my team do I hear the least, and why?",
    pillar: "EMPATHY",
    steps: [
      "List your team and mark who actually spoke in your last three meetings.",
      "Book a 1-on-1 with the quietest person this week.",
      "Ask them directly: \"What haven't you told me that I should know?\"",
      "In your next meeting, ask a direct question to someone who usually stays quiet.",
      "Notice if the same people dominate every conversation — and interrupt the pattern.",
    ],
  },
  {
    no: "04",
    question:
      "What feedback have I received more than once that I still haven't acted on?",
    pillar: "SELF-AWARENESS",
    steps: [
      "Write down every piece of repeated feedback you can remember.",
      "Pick the one that stings the most — that's usually the truest.",
      "Ask one trusted colleague if they'd say the same thing.",
      "Choose one small, specific behaviour to change this month.",
      "Tell someone what you're working on, so they can hold you to it.",
    ],
  },
  {
    no: "05",
    question:
      "If my team described how I show up under pressure, would I recognise myself?",
    pillar: "SELF-AWARENESS",
    steps: [
      "Think back to your last stressful week — what did you actually do?",
      "Ask one direct report, honestly, how you seem under pressure.",
      "Notice your own warning signs — short replies, cancelled 1-on-1s, a sharper tone.",
      "Pick one thing you'll do differently next time pressure hits.",
      "Tell your team what you're working on — it invites honesty, not perfection.",
    ],
  },
  {
    no: "06",
    question:
      "What's one hard truth I need to tell someone this week — and how can I say it with respect?",
    pillar: "COURAGE",
    steps: [
      "Write the truth down in one plain sentence, with no cushioning.",
      "Separate the behaviour from the person in how you phrase it.",
      "Choose a private setting, not a group one.",
      "Plan to say it early in the conversation, not buried at the end.",
      "Book the conversation before the week is out.",
    ],
  },
  {
    no: "07",
    question:
      "Am I consistent, or do people have to guess which version of me they'll get today?",
    pillar: "CONSISTENCY",
    steps: [
      "Ask yourself what mood you walked in with today — and whether it showed.",
      "Notice if your standards shift depending on how busy you are.",
      "Pick one behaviour — tone, responsiveness, follow-through — to keep steady this week.",
      "Ask a colleague, honestly, if they'd call you predictable in a good way.",
      "Build one small routine that stays the same no matter what kind of day it is.",
    ],
  },
  {
    no: "08",
    question:
      "What did I get wrong recently — did I treat it as failure, or as information?",
    pillar: "GROWTH MINDSET",
    steps: [
      "Write down what actually happened, without the self-judgment attached.",
      "Ask what the mistake taught you that success wouldn't have.",
      "Say it out loud to someone else — naming it out loud reduces its weight.",
      "Decide one thing you'll do differently because of it.",
      "Notice how you talk about your own mistakes in front of your team.",
    ],
  },
  {
    no: "09",
    question:
      "Before I react to bad news, do I pause long enough to actually understand it first?",
    pillar: "COMMUNICATION",
    steps: [
      "Practice one full breath before you respond to bad news, every time.",
      "Ask a clarifying question before offering an opinion.",
      "Delay your first reaction email or message by ten minutes.",
      "Ask \"what don't I know yet?\" before deciding what it means.",
      "Notice if your first instinct is usually blame — and catch it.",
    ],
  },
  {
    no: "10",
    question:
      "Who on my team needs to hear that I see their effort, not just their output?",
    pillar: "EMPATHY",
    steps: [
      "Think of one person whose effort has gone unspoken lately.",
      "Be specific — name exactly what you saw them do, not just \"good job.\"",
      "Say it in person or by name, not folded into a group message.",
      "Do it this week, while it's still relevant.",
      "Make it a habit, not a one-off.",
    ],
  },
];

/** Rendered under the last question, above the CTA button. */
export const closingLine =
  "Sit with one a week. If a question opens up more than you expected, that's usually the one worth bringing to a session.";

/** Label of the CTA button that follows the closing line. */
export const closingCta = "Book a Session to Talk It Through";

/** Label above the 5 steps in the open state of a question. */
export const stepsLabel = "5 steps you can take now";

/** Filter row order, if the pillar filter is built. "All" is prepended in the UI. */
export const pillars: Pillar[] = [
  "COURAGE",
  "COMMUNICATION",
  "EMPATHY",
  "SELF-AWARENESS",
  "CONSISTENCY",
  "GROWTH MINDSET",
];
