# KYNDER — Plan for the next build (v2)

Three workstreams. Each is a branch, a set of gates, and a sign-off. Nothing moves forward on a gate that hasn't been reported as passing.

| | Workstream | Why this order | Size |
|---|---|---|---|
| **A** | Bilingual (AR + EN, full RTL) | Touches every page and every string. Visual work done first would have to be rebuilt mirrored. | 3–4 days |
| **B** | Two founder profiles | Structural — changes the About page and the site's premise. Cheaper before polish. | 1 day |
| **C** | Illustrated states + motion | Polish, on top of a stable structure. | 2–3 days |

**Do not reorder.** C first means building it twice.

---

## Decisions before anything starts

| # | Decision | Owner | Blocks |
|---|---|---|---|
| 1 | Two founders — the brief is built on Shereen alone and forbids profiles. Written confirmation. | Client | B |
| 2 | Arabic — does she want it? Who signs off on the translation? | Client | A |
| 3 | Hisham's real bio, title, credentials | Client | B |
| 4 | Is bilingual + two founders inside the current fee, or a new line item? | You | All |
| 5 | Do your images exist for all six pillars, or only some? | You | C1 |

Decisions 1, 2 and 4 are not technical. Settle them before spending a day of build time.

---

## Risks, with kill criteria

Every risk here has a defined point where you stop rather than push on.

**The Arabic reads like machine translation.**
The likeliest failure, and the one that damages the client most. *Kill criterion:* if the three-question sample (Gate A1 below) doesn't read naturally to you, stop and hire a human translator for the client-facing copy. The agent still does the RTL, the plumbing, and the interface labels.

**Six illustrated figures feel childish for an executive audience.**
Real risk. Leadership coaching aimed at directors and founders can't look like a children's book. *Mitigation:* build **one** figure first, in context, and look at it. *Kill criterion:* if the single figure doesn't read as sophisticated, don't build the other five — fall back to abstract pillar marks (a geometric motif per pillar) instead of figures.

**RTL breaks layouts that pass in English.**
Predictable, not dangerous — as long as it's tested in Arabic specifically at every breakpoint, not assumed from the English pass.

**Scope creep turns a calm coaching site into an animated portfolio.**
*Kill criterion:* one flourish per section. If a section has two, remove one before committing.

**Context runs out mid-workstream.**
It has happened repeatedly on this project. See the last section.

---

# WORKSTREAM A — Bilingual

Split into three prompts. A1 is a spike, A2 is plumbing, A3 is language. Sending them as one prompt is how you get machine translation.

## A1 — Plan and translation sample

```
Planning spike. Write no production code in this step.

We are making the entire public website bilingual, Arabic and English — every page,
every string, both directions. Not just the dashboard.

Deliver four things, then stop:

1. TECHNICAL PLAN
   - Routing approach for /en and /ar, including how the switcher keeps the user
     on the same page in the other language
   - Schema changes for translatable fields, and how the admin edits both
     languages side by side in one form
   - Fallback behaviour when an Arabic value is missing
   - How many distinct strings need translating, split into: interface labels,
     client-facing marketing copy, and the ten questions with their fifty steps

2. ARABIC TYPE PAIRING
   Lora and Inter have no Arabic glyphs. Propose a self-hosted pairing — a serif
   or semi-serif Arabic display face and a clean Arabic sans — that matches the
   brand's editorial, warm, calm character. Tell me what you picked and why, and
   what it costs in page weight. Show me how each looks at heading and body size.

3. GLOSSARY
   Before translating anything, build docs/GLOSSARY-AR.md: the fixed Arabic
   rendering for every recurring term — coaching, coach, session, leadership,
   self-awareness, the six pillar names, booking, topic. One agreed term each, used
   everywhere. Inconsistent terminology is the fastest way to look amateur.
   "KYNDER" stays in Latin script and is never transliterated.

4. TRANSLATION SAMPLE — three questions only
   Translate questions 01, 04 and 09 with their five steps each. Not the rest.
   For each, give me three columns: the English, your Arabic, and a plain English
   back-translation of your Arabic done as literally as possible.
   The back-translation is the test — if it reads stiff or shifted in meaning, the
   Arabic is wrong and I'll see it without speaking to a translator.

   Voice target: the English is warm, plain, confident, never salesy, no
   exclamation marks, no hype. The Arabic must carry the same voice — Modern
   Standard Arabic in the natural contemporary register a professional leadership
   brand uses. Not formal literary Arabic. Not dialect. Not the stiff register of
   a translated corporate brochure.
   Transcreate, don't translate word for word. These questions are meant to land
   emotionally; a literal rendering kills them. Where a phrase has no good direct
   equivalent, say so and show me your alternative.

Stop after these four. I will approve or reject the sample before you translate
anything else.
```

**GATE A1 — you read the sample yourself.** Read the Arabic aloud. If it sounds like a translated brochure, reject it and say why. Don't approve out of momentum — the remaining 47 steps will be written in whatever voice this sample establishes.

## A2 — Infrastructure

```
Sample approved. Build the bilingual infrastructure now. NO client-facing
translation in this step — interface labels only. The questions, topics and page
copy stay English until A3.

ROUTING
- /en and /ar path prefixes. Root redirects on Accept-Language, remembered in a
  cookie.
- Language switcher in the header on every page, keeping the user on the same page.
- hreflang between versions; both locales in the sitemap; locale-correct metadata
  and structured data.

CONTENT MODEL
- Every translatable field gets an English and an Arabic value. Migration plus seed
  update.
- Missing Arabic falls back to English, never blank, and the admin flags the field
  as untranslated.
- Admin edits both languages side by side in one form.

RTL
- dir="rtl" and lang="ar" on the Arabic locale.
- Logical CSS properties throughout: margin-inline, padding-inline, inset-inline,
  text-align: start/end. Do NOT write mirrored rules behind a [dir="rtl"] override
  — one rule set serves both directions. Add a guard test that fails on any new
  physical left/right spacing property in components.
- Mirror: nav order, sidebar, chevrons and arrows, the accordion rail, card
  alignment, the mobile drawer's slide direction, form label alignment, footer
  columns.
- Do NOT mirror: the KYNDER wordmark, the decorative ripples, phone numbers.
- Numbers and dates in Western digits.

TYPOGRAPHY
Self-host the approved Arabic pairing. Tune Arabic separately — it needs different
line-height and letter-spacing from Latin, and Arabic display type usually needs to
be set slightly larger to feel equal in weight. Do not just swap the family.

GATE A2 — report each with real output:
  [ ] every page renders in both locales
  [ ] switcher preserves the current page, both directions
  [ ] zero horizontal overflow in Arabic at 320/375/768/1024/1440
  [ ] axe zero violations on every page in Arabic, including the accordion open
      and the mobile drawer open
  [ ] no physical left/right spacing properties remain in components
  [ ] Lighthouse has not regressed on either locale
  [ ] typecheck, lint, tests, build all pass
Screenshot every page at 375 and 1440 in Arabic. Then stop.
```

## A3 — Translation

```
Translate the remaining client-facing copy, following the approved sample's voice
and docs/GLOSSARY-AR.md exactly.

Scope: the remaining seven questions and their steps, all fifteen topic titles and
blurbs, all page copy, metadata and structured data, form labels and validation
messages, empty and error states.

Rules:
- Same voice as the approved sample. If you find yourself writing a different
  register, stop and tell me.
- Every glossary term uses its agreed rendering. No synonyms.
- Provide a back-translation column for the ten questions and the fifteen topics
  so I can review without a translator.
- Every Arabic string you author for client-facing content is a DRAFT. Mark it so
  the admin displays it as awaiting approval, and list it in docs/PENDING.md for
  client sign-off.
- The English copy is contractually verbatim and is not touched. Not one character.

GATE A3:
  [ ] every client-facing string has an Arabic value
  [ ] terminology matches the glossary throughout — prove it with a check
  [ ] back-translations supplied for the questions and topics
  [ ] everything marked as draft and listed in PENDING.md
  [ ] English copy unchanged — prove it with the existing verbatim snapshots
```

---

# WORKSTREAM B — Two founders

```
The site now represents two founders, Hisham and Shereen, not one.

- Extend the User model so an ADMIN can be published as a public profile: published
  flag, display order, portrait, role/title, bio in both languages.
- Each admin manages their own profile and can publish or unpublish themselves.
  Either can manage the other's.
- The About page renders whichever profiles are published. It must look right with
  two AND with one — no hardcoded two-column layout that collapses when someone
  unpublishes. With none published, it falls back gracefully rather than empty.
- Audit every page for singular-founder assumptions: the homepage About teaser,
  metadata, structured data, proof points, and any "Dr. Shereen" reference in
  navigation or copy. Make them work for either or both.
- The existing proof points (25+ years, 17+ countries, the doctorate) belong to
  Shereen specifically. They must not silently become claims about both founders.
  Attribute them, or move them into her profile.
- Do not invent anything about Hisham — no bio, credentials, title, qualifications,
  or years of experience. All [PENDING: ...] until I supply real content. Shereen's
  confirmed content stays exactly as it is.
- Structured data: a Person schema per published profile.

GATE B:
  [ ] About renders correctly with 2, 1, and 0 published profiles
  [ ] no claim about Shereen has become a claim about both
  [ ] nothing invented about Hisham
  [ ] both locales, both directions
  [ ] typecheck, lint, tests, build pass
```

---

# WORKSTREAM C — The visual layer

Four phases. C0 and C1 are gates, not steps.

## C0 — Inventory (you do this)

Put every image you've made in `public/art/` and write `docs/ART-INVENTORY.md`: filename, what it depicts, which state or page it's for, format, dimensions.

The agent designs around what exists. Without this it invents placeholders or ignores your work.

## C1 — One figure, then decide

The brief asks for painterly silhouetted illustrations and nobody built them. That's the signature — not more animation.

**The idea:** one silhouetted figure per pillar. When a question opens, its pillar's figure appears alongside it, marking *who is being asked*. Six recurring presences across the site.

**Build one first.** Six illustrated characters can easily tip into childish for an executive audience. One figure, in place, at both breakpoints, both directions — then judge.

```
Design spike. Build ONE pillar figure, not six.

Read docs/ART-INVENTORY.md first and design around the art that exists. Do not
generate imagery to fill gaps — list what's missing and I'll supply it.

Build the Courage figure only, placed in question 01's open state.

Requirements:
- Silhouetted and painterly, per the brief's own imagery direction. Sophisticated,
  not cartoon — the audience is directors and founders, not children.
- Inline optimised SVG. No image request during interaction.
- Enters as the panel expands: a quiet reveal, no bounce, no slide-in, nothing
  that delays reading the question.
- Sits on the mirrored side in RTL.
- On mobile, where horizontal space is scarce, decide deliberately whether it
  appears, shrinks, or moves — do not let it squeeze the text.
- Fully disabled under prefers-reduced-motion.
- No CLS. Reserve its space.

Then show me: screenshots at 375 and 1440, in English and Arabic, with the question
closed and open. Tell me what you'd change before building the other five.

Stop there.
```

**GATE C1 — look at it.** If it reads sophisticated, build the remaining five. If not, fall back to abstract geometric pillar marks. Don't build six of something you're unsure about.

## C2 — State moments

```
Build the state moments, using art from the inventory.

- 404 — an illustrated moment with a real route back to /questions and /book, in
  the brand's voice. Not an apology.
- /book/confirmed — a genuine arrival moment. This is the emotional peak of the
  whole site and it is currently a text page.
- Empty admin lists — an invitation to act, not a shrug.
- Form success and error — specific, in the interface's voice. Errors never
  apologise and are never vague about what happened.
- Loading — branded skeletons, not spinners.

Both locales. Both directions. Reduced-motion safe.

GATE C2: every state reachable and screenshotted in both languages; axe clean;
no CLS regression.
```

## C3 — Transitions

This also addresses the heaviness you noticed between pages.

```
Page transitions — and the navigation heaviness I reported earlier.

- Implement the View Transitions API with a graceful no-op where unsupported.
- Shared-element continuity only where it's true: a topic card morphing into the
  booking page's topic header; the home questions preview connecting to the full
  page.
- 200-300ms. A slow transition is worse than none. If a transition makes
  navigation feel slower than today, cut it.
- Measure navigation timing before and after, in a production build, and show me
  both numbers. If the numbers don't improve, the transition isn't earning its
  place.

WHAT NOT TO DO — anywhere in workstream C
No parallax. No 3D. No cursor effects. No animated gradients. No glow. No
scroll-jacking. No animation that delays reading. No effect that exists only
because it is impressive. One flourish per section — if a section has two, remove
one.

GATE C3: navigation timing improved or unchanged, never worse; Lighthouse not
regressed; reduced-motion fully respected; both locales.
```

---

## Running this across sessions

Context has run out mid-task on this project more than once, and each recovery costs an hour. Handle it deliberately:

- **One workstream phase per session.** A1, A2, A3, B, C1, C2, C3 — seven sessions, not one heroic run.
- **Commit after every meaningful step,** not at the end of a phase.
- **Start each session with the same opening line:** *"Read the git log and docs/ to orient yourself, report the current state, and tell me the first incomplete item before doing anything."*
- **At 70% context, stop and hand over.** Ask for: what's done, what's in progress, what's next, and anything I'd need to know to resume. Paste that into the next session.
- **Keep `docs/DECISIONS.md`** — every approval you give and every kill decision, dated. The agent forgets; the file doesn't.

---

## Timeline

| | |
|---|---|
| A1 spike + your review | half a day + your reading time |
| A2 infrastructure | 2 days |
| A3 translation | 1–1.5 days |
| B two founders | 1 day |
| C0 + C1 spike | half a day + your judgement |
| C2 + C3 | 2 days |
| **Total** | **7–9 working days** |

Plus client time: Hisham's real content, and sign-off on the Arabic.

---

## The two moments that decide this build

**The A1 sample.** Everything Arabic inherits its voice. Read it properly.

**The C1 figure.** Everything visual sits on top of it. Look at it properly.

Both are cheap to reject and expensive to undo. Spend your attention there, and the rest is execution.
