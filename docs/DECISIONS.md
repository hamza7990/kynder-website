# KYNDER — Decisions log

Every approval and every kill decision, dated. The reference for what has been
settled so a new session does not re-litigate or forget. See `docs/BUILD-PLAN.md`
for the phases these decisions gate.

Format: one row per decision. Status is OPEN (awaiting the owner) or the dated
resolution.

---

## Blocking decisions (from the plan's "Decisions before anything starts")

| # | Decision | Owner | Blocks | Status |
|---|----------|-------|--------|--------|
| 1 | Two founders — brief is built on Shereen alone and forbids profiles. Need written confirmation. | Client | B | **OPEN** — still with client |
| 2 | Arabic — does the client want it, and who signs off on the translation? | Client | A (all) | **RESOLVED 2026-08-23** — see below |
| 3 | Hisham's real bio, title, credentials | Client | B | **OPEN** — still with client |
| 4 | Is bilingual + two founders inside the current fee, or a new line item? | You | All | **RESOLVED 2026-08-23** — owner-handled, not a build blocker |
| 5 | Do the illustrations exist for all six pillars, or only some? | You | C1 | **OPEN** |

---

## Gate approvals & kill decisions

### 2026-08-23 — Decision 2: Arabic IS in scope
Confirmed by owner. The whole public site goes bilingual (AR + EN, full RTL).
**Critical constraint:** the owner reviews the Arabic himself; there is **no
downstream human translator**. The A1 translation sample is therefore the **only
quality gate** the Arabic gets — it sets the voice for all 47 remaining steps and
every other client-facing string. Treat the sample accordingly.

### 2026-08-23 — Decision 4: Fee is owner-handled
The commercial question (is bilingual + two founders in-scope of the current fee)
is the owner's to manage. **Not a blocker for build work.**

### 2026-08-23 — Decisions 1 & 3 remain OPEN (block Workstream B only)
Two-founder confirmation and Hisham's real content are still with the client. They
block **B**, not **A**. A1/A2/A3 proceed without them.

### 2026-08-23 — GATE A1: sample APPROVED → proceed to A2
Owner reviewed the A1 spike and said "proceed". Treated as go-ahead to begin **A2
(infrastructure)**. Note: A2 contains **no client-facing translation** (interface
labels only; questions/topics/page copy stay English until A3), so starting A2 does
**not** finalise the sample voice. Two decisions remain OPEN and block **A3**, not A2:
- **Gender of address** (masculine-generic placeholder used in the sample; owner to
  choose before A3). See [[GLOSSARY-AR]] gender note.
- **Register calls:** «التدريب» vs «الكوتشينغ» (coaching/coach); «الملاحظة» vs
  «التغذية الراجعة» (feedback). Owner yes/no before A3.
These will be surfaced again for explicit sign-off at the A2→A3 boundary.

### 2026-08-23 — Nav labels deferred to A3 (owner decision)
Owner: the public nav labels ("Leadership Questions", "Coaching Topics", "About",
"Contact") are **NOT translated in A2** — they stay English and are handled in **A3**
with the page copy, for voice consistency. Held behind the interface/client boundary.
Consistent with A2 (all `/ar` content is English until A3). See [[GLOSSARY-AR]].

### 2026-08-23 — Standing guidance from owner (recorded so it isn't lost)
- **Reuse the admin i18n plumbing, but do not let the dashboard set the public
  site's shape.** The dashboard is a tool; the public site is the brand. Different
  requirements. (See [[kynder-deploy-state]].)
- **IBM Plex Sans Arabic stays for the admin only.** The public type decision is
  fully open; do not default to Plex for convenience. If A1 recommends it anyway,
  it must be justified against the editorial brief, not installation convenience.
- **Steps-as-JSON:** A1 must present both options (parallel `stepsAr` column vs.
  normalised step table) with a recommendation and the migration cost of each.
  Owner picks.

### 2026-08-23 — Content schema: Option A APPROVED (additive nullable `*Ar` columns)
Owner approved the parallel-nullable-column model for bilingual content: each
translatable field gains a sibling `*Ar` column (`questionAr`, `stepsAr`,
`titleAr`, `blurbAr`, coach `bioAr`/`titleAr`). **Additive and nullable only** —
no existing (English) column is altered, renamed or dropped; the English copy is
contractually verbatim and must be byte-identical after the migration. NULL falls
back to English at read time. Implemented in A2 Slice 6 (schema + plumbing only;
no Arabic values — that's A3). See [[kynder-deploy-state]].

### 2026-08-23 — Steps-as-JSON: Option 1 APPROVED (parallel `stepsAr` JSON column)
Owner approved a parallel nullable `stepsAr` JSON column (mirroring the existing
`steps` JSON), NOT a normalised step table. Rationale (owner): simpler migration,
and the five steps are always read as an ordered set of five, never queried
individually, so normalising buys nothing here. A length-5 shape is enforced at
the app/admin layer, same as `steps`.

<!--
Append entries as they happen, most recent last, e.g.:

### 2026-08-23 — A1 sample
APPROVED / REJECTED (reason). Decided by: <user>.
-->
