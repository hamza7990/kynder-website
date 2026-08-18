/**
 * VERBATIM COPY SNAPSHOTS.
 *
 * These inline snapshots ARE the contract that the coaching copy — all 10
 * questions, all 50 steps, and all 15 topic lines (via topicLine()) — has not
 * been altered. They were generated once from the source files and committed.
 *
 * DO NOT regenerate with `vitest -u` unless a human has read the resulting diff
 * line by line and confirmed the copy change was intended and approved. A failure
 * here means the copy changed; that is a content decision, never an auto-fix.
 */
import { describe, expect, it } from 'vitest';
import { closingCta, closingLine, questions, stepsLabel } from '../questions';
import { moreLine, poolLine, topicLine, topics, trustMarkers } from '../topics';

describe('leadership questions — verbatim', () => {
  it('all 10 questions and 50 steps are unchanged', () => {
    expect(questions).toMatchInlineSnapshot(`
      [
        {
          "no": "01",
          "pillar": "COURAGE",
          "question": "What conversation have I been avoiding — and what am I afraid will happen if I have it?",
          "steps": [
            "Name the conversation out loud, or write it down — vague avoidance thrives on staying unnamed.",
            "Write down exactly what you're afraid will happen if you have it.",
            "Ask yourself what happens if you avoid it for another month.",
            "Choose one sentence you could open with — nothing else, just the opener.",
            "Put a date on your calendar this week to have it.",
          ],
        },
        {
          "no": "02",
          "pillar": "COMMUNICATION",
          "question": "When someone pushes back on me, do I actually listen — or am I just waiting to respond?",
          "steps": [
            "Next time someone disagrees, count to three before replying.",
            "Repeat back what they said, in your own words, before you respond.",
            "Ask one genuine follow-up question instead of defending your position.",
            "Notice if your body tenses when challenged — that's often the tell.",
            "Afterwards, ask yourself honestly: did I actually change my mind about anything?",
          ],
        },
        {
          "no": "03",
          "pillar": "EMPATHY",
          "question": "Whose voice on my team do I hear the least, and why?",
          "steps": [
            "List your team and mark who actually spoke in your last three meetings.",
            "Book a 1-on-1 with the quietest person this week.",
            "Ask them directly: "What haven't you told me that I should know?"",
            "In your next meeting, ask a direct question to someone who usually stays quiet.",
            "Notice if the same people dominate every conversation — and interrupt the pattern.",
          ],
        },
        {
          "no": "04",
          "pillar": "SELF-AWARENESS",
          "question": "What feedback have I received more than once that I still haven't acted on?",
          "steps": [
            "Write down every piece of repeated feedback you can remember.",
            "Pick the one that stings the most — that's usually the truest.",
            "Ask one trusted colleague if they'd say the same thing.",
            "Choose one small, specific behaviour to change this month.",
            "Tell someone what you're working on, so they can hold you to it.",
          ],
        },
        {
          "no": "05",
          "pillar": "SELF-AWARENESS",
          "question": "If my team described how I show up under pressure, would I recognise myself?",
          "steps": [
            "Think back to your last stressful week — what did you actually do?",
            "Ask one direct report, honestly, how you seem under pressure.",
            "Notice your own warning signs — short replies, cancelled 1-on-1s, a sharper tone.",
            "Pick one thing you'll do differently next time pressure hits.",
            "Tell your team what you're working on — it invites honesty, not perfection.",
          ],
        },
        {
          "no": "06",
          "pillar": "COURAGE",
          "question": "What's one hard truth I need to tell someone this week — and how can I say it with respect?",
          "steps": [
            "Write the truth down in one plain sentence, with no cushioning.",
            "Separate the behaviour from the person in how you phrase it.",
            "Choose a private setting, not a group one.",
            "Plan to say it early in the conversation, not buried at the end.",
            "Book the conversation before the week is out.",
          ],
        },
        {
          "no": "07",
          "pillar": "CONSISTENCY",
          "question": "Am I consistent, or do people have to guess which version of me they'll get today?",
          "steps": [
            "Ask yourself what mood you walked in with today — and whether it showed.",
            "Notice if your standards shift depending on how busy you are.",
            "Pick one behaviour — tone, responsiveness, follow-through — to keep steady this week.",
            "Ask a colleague, honestly, if they'd call you predictable in a good way.",
            "Build one small routine that stays the same no matter what kind of day it is.",
          ],
        },
        {
          "no": "08",
          "pillar": "GROWTH MINDSET",
          "question": "What did I get wrong recently — did I treat it as failure, or as information?",
          "steps": [
            "Write down what actually happened, without the self-judgment attached.",
            "Ask what the mistake taught you that success wouldn't have.",
            "Say it out loud to someone else — naming it out loud reduces its weight.",
            "Decide one thing you'll do differently because of it.",
            "Notice how you talk about your own mistakes in front of your team.",
          ],
        },
        {
          "no": "09",
          "pillar": "COMMUNICATION",
          "question": "Before I react to bad news, do I pause long enough to actually understand it first?",
          "steps": [
            "Practice one full breath before you respond to bad news, every time.",
            "Ask a clarifying question before offering an opinion.",
            "Delay your first reaction email or message by ten minutes.",
            "Ask "what don't I know yet?" before deciding what it means.",
            "Notice if your first instinct is usually blame — and catch it.",
          ],
        },
        {
          "no": "10",
          "pillar": "EMPATHY",
          "question": "Who on my team needs to hear that I see their effort, not just their output?",
          "steps": [
            "Think of one person whose effort has gone unspoken lately.",
            "Be specific — name exactly what you saw them do, not just "good job."",
            "Say it in person or by name, not folded into a group message.",
            "Do it this week, while it's still relevant.",
            "Make it a habit, not a one-off.",
          ],
        },
      ]
    `);
  });

  it('page-level strings are unchanged', () => {
    expect({ closingLine, closingCta, stepsLabel }).toMatchInlineSnapshot(`
      {
        "closingCta": "Book a Session to Talk It Through",
        "closingLine": "Sit with one a week. If a question opens up more than you expected, that's usually the one worth bringing to a session.",
        "stepsLabel": "5 steps you can take now",
      }
    `);
  });
});

describe('coaching topics — verbatim', () => {
  it('all 15 topic lines via topicLine() are unchanged', () => {
    expect(topics.map(topicLine)).toMatchInlineSnapshot(`
      [
        "Having hard conversations — say what needs saying, without losing the relationship",
        "Listening better — move from waiting to reply, to actually hearing people",
        "Giving and receiving feedback — feedback that lands, and feedback you can actually use",
        "Managing conflict on your team — address tension before it becomes dysfunction",
        "Leading through change — keep your team steady when the ground is shifting",
        "Delegation and letting go — hand off real ownership, not just tasks",
        "Building trust as a new manager — earn credibility in the first 90 days",
        "Building psychological safety — make it safe for your team to speak up and fail forward",
        "Imposter syndrome — lead confidently even when you feel unsure",
        "Burnout and sustainable leadership — lead well without running yourself into the ground",
        "Work-life boundaries — lead fully without disappearing from your own life",
        "Navigating up — manage expectations with your own manager or board",
        "Executive presence — show up with authority in the room that matters",
        "Career transitions — step into a bigger role, or a different one entirely",
        "Cross-cultural leadership — lead well across different markets and teams",
      ]
    `);
  });

  it('page-level strings are unchanged', () => {
    expect({ poolLine, moreLine, trustMarkers }).toMatchInlineSnapshot(`
      {
        "moreLine": "…and more. If your topic isn't listed, tell us — we'll match you regardless.",
        "poolLine": "a growing pool of accredited coaches",
        "trustMarkers": [
          "Accredited coaches",
          "Confidential, always",
          "Matched to your topic and level",
        ],
      }
    `);
  });
});
