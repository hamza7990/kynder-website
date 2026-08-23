# A1 — Bilingual planning spike

Planning only. **No production code was written in this step.** Deliverables:
1. Technical plan
2. Arabic type pairing + reasoning
3. `docs/GLOSSARY-AR.md` (separate file)
4. Translation sample — questions 01, 04, 09, with back-translations and per-question
   reasoning notes

Stop after these. Owner approves or rejects the sample before any further translation.

---

## 1. TECHNICAL PLAN

### 1a. Routing (`/en` and `/ar`)

- **Approach:** a `[locale]` dynamic segment at the root of the public tree — move
  the public routes under `src/app/[locale]/(public)/…` with
  `generateStaticParams()` returning `['en','ar']`. This is App-Router-idiomatic and
  compatible with the current **static export** (`next build` → `./out`, deployed on
  Netlify).
- **Admin stays separate.** `/admin`, `/coach`, `/api`, `/login` are **not**
  locale-prefixed. They already use a *different* i18n mechanism: **per-user session
  locale**, not a URL prefix. Public = per-URL (`/en`, `/ar`); admin = per-account.
  Keep the two mechanisms distinct; the middleware/segment must exclude the admin
  tree from prefixing.
- **Switcher = prefix swap.** Because paths are prefixed, switching language on any
  page is swapping the first segment and preserving the rest, including the hash:
  `/en/questions#q-01` ⇄ `/ar/questions#q-01`.
- **Slugs — decision needed.** Topic slugs are English kebab-case
  (`having-hard-conversations`). Two choices:
  - **Shared English slugs across both locales** (recommended): the switch stays a
    pure prefix swap, one set of `generateStaticParams`, simplest. SEO-acceptable.
  - Localised Arabic slugs: better Arabic SEO, but needs a slug↔slug map, doubles
    static params, and the switcher must translate the slug. More moving parts.
  - **Recommendation: shared English slugs.** Revisit only if Arabic organic search
    is a stated priority.
- **[CORRECTED 2026-08-23 in A2] Root `/` redirect.** A1 assumed static export; the
  app is actually **SSR** (`next build`/`next start`, `force-dynamic` pages), so
  middleware runs and the redirect is handled there cleanly — the "wrinkle" below
  does not apply. Left for the record:
- ~~**Root `/` redirect — static-hosting wrinkle (flagging honestly).** The plan wants
  Accept-Language detection + a `NEXT_LOCALE` cookie. On a **pure static export**
  there is no server to run middleware, so `/` can't do server-side Accept-Language.
  Options: (a) a Netlify **edge redirect** / `_redirects` rule for `/`, or (b) a tiny
  static `/` page that detects `navigator.language` client-side and replaces to
  `/en` or `/ar`. Cookie persistence then lives client-side. This is a real
  architectural choice A2 must make explicit — it is not free on static hosting.
- **SEO:** per-page `hreflang` alternates (`en`, `ar`, `x-default`); both locales in
  `sitemap.xml`; `<html lang dir>` correct per locale; locale-correct `<title>`,
  meta description, and JSON-LD.

### 1b. Content model & where the copy actually lives

**Key finding:** most public marketing copy is **NOT in the database** — it lives in
static TypeScript under `src/data/*.ts` (home, about, book, contact, questions,
topics), and the DB is seeded *from* that same data. So "translatable content"
splits into two populations with different mechanics:

1. **DB-backed, admin-editable:** `Question` (question, steps), `Topic` (title,
   blurb), `SiteSetting` values, coach profile `bio`/`title`. These need Arabic
   values **and** side-by-side editing in the admin.
2. **Static `src/data/*.ts` marketing copy:** not admin-editable today. This is the
   contractually-verbatim English. Recommendation: **keep it static**, adding a
   parallel Arabic value in the data structures (compile-time), rather than migrating
   verbatim-locked copy into the DB. It changes rarely and must not change in English.

**Schema strategy for the DB-backed content — two options:**

- **Option A — parallel nullable columns** (`questionAr`, `stepsAr`, `titleAr`,
  `blurbAr`, `bioAr`, `titleAr`…). Migration is **additive, nullable, no backfill**.
  Fallback is trivial: `questionAr ?? question`. Admin form = simple two-column
  layout. Best for **two** locales.
- **Option B — translations table / JSON** (`ContentTranslation(entity, field,
  locale, value)` or a JSON column). Scales to N locales, per-field flags for free,
  but heavier queries, a more abstract admin form, and app-layer fallback logic.
- **Recommendation: Option A.** Two locales don't justify Option B's complexity;
  additive nullable columns are the cheapest safe migration and the clearest admin UX.

**Fallback behaviour:** any missing/empty Arabic value → render English, never blank.
The admin flags such fields as **untranslated**. Note this dovetails with A3's
requirement that Arabic client copy is **DRAFT / awaiting approval** until client
sign-off — so we need an approval marker per translated entity/field, not just
"present/absent". A2 should land the columns + fallback; A3 adds the draft flag.

### 1c. The steps-as-JSON question (both options, as requested)

`Question.steps` is a single `TEXT` column holding a JSON array of exactly 5 strings.

- **Option 1 — parallel `stepsAr TEXT` (JSON array of 5).**
  - Migration: `ALTER TABLE "Question" ADD COLUMN "stepsAr" TEXT;` — additive,
    nullable, **no backfill**.
  - App: parse both; `stepsAr` empty/null → fall back to `steps`.
  - Admin: render 5 paired EN/AR inputs.
  - Cost: **trivial.** Keeps the existing shape and every existing read path.
  - Risk: two arrays could drift in length → add a guard asserting both are length 5.
- **Option 2 — normalise into `QuestionStep(questionId, order, en, ar)`.**
  - Migration: create table **+ backfill 50 rows** from the existing JSON via a data
    migration, **+ rewrite every read/write** (questions page, seed, admin editor).
  - Cost: **high.** Real work in seed, all read paths, and admin UI.
  - Benefit here: essentially none — steps are always exactly 5, edited as a set,
    never queried individually. Normalisation solves problems this data doesn't have.
- **Recommendation: Option 1.** The migration cost gap is large (one nullable column
  vs. a table + backfill + read/write rewrite) for zero functional gain. Add the
  length-5 validation guard. **Owner picks.**

### 1d. String count (grounded in a file scan, not a guess)

| Bucket | Count | Basis |
|---|---|---|
| Admin interface labels | **327** (done) | leaf strings in `src/i18n/en.json` — already extracted last session; reused, not re-translated here |
| Public interface labels | **~80–120** (est.) | nav/header/footer/buttons/form labels + validation/empty/error states — **not yet extracted** into a public dictionary |
| Client marketing copy (static `src/data`) | **~70–90** | home ≈25, book ≈15, contact ≈12, topics intro/clusters/trust ≈8, about ≈8 (excl. [PENDING] founder bio), questions closing/labels ≈4 |
| The 10 questions + 50 steps + closing | **61** | `src/data/questions.ts` |
| 15 topics (title+blurb) + 4 cluster labels | **34** | `src/data/topics.ts` |

**Net new Arabic to author for A2+A3 ≈ 250–300 client-facing strings** (excludes the
327 admin labels already done, and any `[PENDING]` founder content). Exact figure
pinned during the A2 extraction pass.

---

## 2. ARABIC TYPE PAIRING

**Brand Latin:** Lora (serif display, warm editorial) for headings; Inter (humanist
sans) for body. The Arabic must mirror that structure — a warm editorial Arabic
display face for headings, a clean quiet Arabic sans for body — self-hosted, tuned
separately from Latin.

**Recommendation:**
- **Headings → Markazi Text** (Naskh, OFL, variable). A contemporary editorial Naskh
  with moderate stroke contrast and a calm, warm character — the Arabic analogue of
  Lora's calligraphic-rooted-but-modern feel. It carries editorial presence at
  display sizes without tipping into liturgical/classical formality.
- **Body → Noto Sans Arabic** (OFL, wide weight range). Clean, neutral, superbly
  legible at 16px and in dense contexts; mirrors Inter's quiet neutrality. Warmth
  comes from the Markazi headings; the body stays out of the way, exactly as Inter
  does under Lora.

**Why not IBM Plex Sans Arabic (already installed):** per the owner's standing
guidance, justified against the brief, not convenience. Plex Sans Arabic is a fine
*utilitarian* sans and is the right face for the **admin dashboard** (dense tables,
neutral tool voice). But (a) it's a sans only — it can't supply the editorial
warmth the *headings* need, and (b) reusing the admin's tool-face on the public
brand blurs the tool/brand line the owner explicitly drew. The public brand's warmth
should come from a Naskh display (Markazi), with a quiet sans (Noto) beneath —
neither of which is Plex. So Plex stays admin-only.

**Runners-up considered:** *Amiri* (beautiful but skews classical/literary — works
against the "not stiff, not literary" voice target); *Noto Naskh Arabic* (excellent
but more neutral than warm — a safe fallback if Markazi feels too characterful at
display size); *Tajawal*/*Almarai* for body (warmer/rounder, but risk reading
"friendly-consumer" rather than "calm-executive").

**Both are on Google Fonts**, so they self-host through the existing `next/font/google`
setup — same mechanism as Lora/Inter/Plex today. No new runtime dependency.

**Page weight (honest estimate, exact numbers measured in A2):** Arabic Naskh faces
are heavier than Latin (contextual joining forms, larger glyph sets). Subsetted woff2
to the Arabic block: Markazi Text ≈ 40–70 KB and Noto Sans Arabic ≈ 40–80 KB per
weight. Loading ~2 weights of each ≈ **150–250 KB** of extra Arabic font data —
which should load **only on `/ar` routes**, so `/en` pays nothing. `font-display:
swap`, preload the two primary weights.

**Tuning (Arabic ≠ swap-the-family):** Arabic needs its own metrics —
- **Larger effective size:** Arabic has no capitals and a smaller x-height feel; set
  it ~+8–15% vs Latin to feel equal in weight (esp. headings).
- **Looser line-height:** tall ascenders + deep descenders → body `line-height`
  ~1.7–1.8 vs Latin's 1.6.
- **Zero letter-spacing, always:** Arabic is cursive/joined; tracking breaks the
  joins. Any Latin `letter-spacing`/`tracking` token must be neutralised in Arabic.
- Implement as Arabic-specific tokens (`--lh-body-ar`, heading size bump) applied
  under `[lang="ar"]`, not a blanket family swap.

**The one thing I can't put in a text channel:** rendered glyph specimens at heading
and body size. I won't pretend to have shown you type I haven't rendered. The
cheapest honest way to see it is a **throwaway specimen route as the first step of
A2** (both faces, heading + body, EN and AR side by side) before committing the
tokens. Not built here — A1 is plan-only.

---

## 3 & 4. TRANSLATION SAMPLE — Q01, Q04, Q09

Three columns per line: **English (verbatim)** · **Arabic (draft)** · **literal
back-translation**. The back-translation is deliberately literal — its job is to
expose any shift in meaning so the owner can review without a translator. After each
question, a **note on what I deliberately changed from a literal rendering, and why**
— that reasoning is the real test of whether the remaining 47 steps can be trusted.

Register: contemporary MSA, warm/plain/confident. **Masculine-generic address**
throughout (placeholder — see the gender decision in GLOSSARY-AR.md). All Arabic here
is **DRAFT**, pending owner review.

---

### Question 01 — COURAGE

**Q.** *What conversation have I been avoiding — and what am I afraid will happen if I have it?*
- **AR:** ما الحديث الذي ظللتُ أتجنّبه — وما الذي أخشى أن يحدث إن أجريتُه؟
- **Back:** "What is the conversation I have kept avoiding — and what do I fear will happen if I hold it?"

**Steps**

1. *Name the conversation out loud, or write it down — vague avoidance thrives on staying unnamed.*
   - **AR:** سمِّ هذا الحديث بصوتٍ مسموع، أو اكتُبه — فالتجنّب المبهم يزدهر ما دام بلا اسم.
   - **Back:** "Name this conversation in an audible voice, or write it — for vague avoidance flourishes as long as it has no name."
2. *Write down exactly what you're afraid will happen if you have it.*
   - **AR:** اكتُب بالتحديد ما الذي تخشى حدوثه إن أجريتَه.
   - **Back:** "Write precisely what you fear will happen if you hold it."
3. *Ask yourself what happens if you avoid it for another month.*
   - **AR:** اسأل نفسك: ماذا يحدث إن تجنّبتَه شهرًا آخر؟
   - **Back:** "Ask yourself: what happens if you avoid it another month?"
4. *Choose one sentence you could open with — nothing else, just the opener.*
   - **AR:** اختَر جملةً واحدة تفتتح بها الحديث — لا أكثر، مجرّد بداية.
   - **Back:** "Choose one sentence with which you open the conversation — no more, just a beginning."
5. *Put a date on your calendar this week to have it.*
   - **AR:** حدِّد له موعدًا في جدولك هذا الأسبوع.
   - **Back:** "Set a date for it in your schedule this week."

**What I changed, and why:**
- English "have a conversation" has no Arabic equivalent — you don't *have* a talk,
  you **conduct/hold** one. So "have it" → «أجريته» (hold/conduct it), used
  consistently in the question and steps 2 & 5.
- "have I been avoiding" → «ظللتُ أتجنّبه» (I kept avoiding). MSA has no
  perfect-progressive; «ظلّ + مضارع» is the natural way to carry the *ongoing* sense.
- Step 1 preserves the English wordplay between **name** and **un-named**: imperative
  «سمِّ» (name it) answered by «بلا اسم» (without a name). The echo survives.
- Step 5: dropped the explicit "to have it" — «له» (for it) already points at the
  conversation, and repeating «أجريته» a third time would clutter. Deliberate compression.

---

### Question 04 — SELF-AWARENESS

**Q.** *What feedback have I received more than once that I still haven't acted on?*
- **AR:** ما الملاحظة التي تلقّيتُها أكثر من مرّة ولم أتصرّف بشأنها بعد؟
- **Back:** "What is the remark I received more than once and have not yet acted regarding?"

**Steps**

1. *Write down every piece of repeated feedback you can remember.*
   - **AR:** اكتُب كل ملاحظةٍ متكرّرة تستطيع تذكّرها.
   - **Back:** "Write every repeated remark you can remember."
2. *Pick the one that stings the most — that's usually the truest.*
   - **AR:** اختَر أشدَّها إيلامًا — فهي غالبًا أصدقها.
   - **Back:** "Choose the most painful of them — for it is usually the most truthful."
3. *Ask one trusted colleague if they'd say the same thing.*
   - **AR:** اسأل زميلًا واحدًا تثق به: هل كان ليقول الشيء نفسه؟
   - **Back:** "Ask one colleague you trust: would he say the same thing?"
4. *Choose one small, specific behaviour to change this month.*
   - **AR:** اختَر سلوكًا واحدًا صغيرًا ومحدّدًا لتغيّره هذا الشهر.
   - **Back:** "Choose one small, specific behaviour to change this month."
5. *Tell someone what you're working on, so they can hold you to it.*
   - **AR:** أخبِر أحدًا بما تعمل عليه، كي يُذكّرك به ويُحاسبك عليه.
   - **Back:** "Tell someone what you are working on, so that he reminds you of it and holds you accountable for it."

**What I changed, and why:**
- "feedback" → «الملاحظة/الملاحظات», **not** the calque «التغذية الراجعة» (which reads
  like a translated HR manual). Warmth over technical fidelity — a core voice call,
  locked in the glossary.
- "acted on" → «أتصرّف بشأنها» (take action regarding it); Arabic has no "act on."
- Step 2: "stings the most" → «أشدّها إيلامًا» (the most painful); the idiom for a
  hurtful truth is pain, not the literal «لسع» (sting). "the truest" → «أصدقها»
  (most truthful/sincere). The em-dash's causal beat is carried by «فـ» (for).
- Step 5: "hold you to it" has no one-word Arabic match. Rendered as a doublet —
  «يُذكّرك … ويُحاسبك» (remind you + hold you accountable) — because a single verb
  undershoots the accountability. Deliberate expansion for meaning.
- Step 3 exposes the **gender** question: «تثق به … ليقول» is masculine-generic. Fine
  as a placeholder; a project-wide call is pending (GLOSSARY-AR.md).

---

### Question 09 — COMMUNICATION

**Q.** *Before I react to bad news, do I pause long enough to actually understand it first?*
- **AR:** قبل أن أنفعل بالأخبار السيّئة، هل أتوقّف مدّةً كافية لأفهمها أولًا حقًّا؟
- **Back:** "Before I react (emotionally) to bad news, do I pause a sufficient period to understand it first, truly?"

**Steps**

1. *Practice one full breath before you respond to bad news, every time.*
   - **AR:** تدرَّب على أخذ نفَسٍ كاملٍ واحد قبل أن تردّ على أيّ خبرٍ سيّئ، في كل مرّة.
   - **Back:** "Train yourself to take one full breath before you respond to any bad news, every time."
2. *Ask a clarifying question before offering an opinion.*
   - **AR:** اطرح سؤالًا يستوضح الأمر قبل أن تُبدي رأيًا.
   - **Back:** "Pose a question that clarifies the matter before you give an opinion."
3. *Delay your first reaction email or message by ten minutes.*
   - **AR:** أخِّر أوّل رسالةٍ تردّ بها — بريدًا أو رسالةً نصّية — عشر دقائق.
   - **Back:** "Delay the first message you respond with — an email or a text message — by ten minutes."
4. *Ask "what don't I know yet?" before deciding what it means.*
   - **AR:** اسأل: «ما الذي لا أعرفه بعد؟» قبل أن تقرّر ما معناه.
   - **Back:** "Ask: «what is it that I don't know yet?» before you decide what it means."
5. *Notice if your first instinct is usually blame — and catch it.*
   - **AR:** انتبه إن كان أوّل ما يتبادر إليك عادةً هو اللوم — وأمسِك بنفسك قبل أن تنساق إليه.
   - **Back:** "Notice if the first thing that comes to your mind is usually blame — and catch yourself before you are drawn into it."

**What I changed, and why:**
- "react to bad news" → «أنفعل» (react *emotionally* / get agitated), **not** the
  neutral «أتفاعل» (interact). The English clearly means an over-reaction to catch and
  slow; «أنفعل» carries that reflexive charge, «أتفاعل» would flatten it. The single
  most important word-choice in this question.
- Step 1: added «أخذ» — Arabic takes a breath («أخذ نفَس») rather than "practising a
  breath" bare; «تدرَّب على أخذ…» reads natural.
- Step 3: English "reaction email or message" is slightly redundant; folded "reaction"
  into «تردّ بها» (that you respond with) and set «رسالة» as the head noun, glossed by
  «بريدًا أو رسالة نصّية», to avoid the clumsy «بريد إلكتروني أو رسالة».
- Step 5: "catch it" is idiomatic and opaque if rendered literally («أمسك به» = catch
  *what*?). Expanded to «أمسِك بنفسك قبل أن تنساق إليه» (catch *yourself* before you're
  drawn into it) to preserve the self-interruption. The biggest deliberate departure
  in the three questions — flagged for exactly that reason.
- Kept the self-directed quoted question in step 4, with Arabic guillemets «».
