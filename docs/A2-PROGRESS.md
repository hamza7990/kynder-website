# A2 — Infrastructure: progress & handover

A2 is the big infrastructure phase (plan est. ~2 days). Built in **green,
committable slices** so the build is never left half-broken. Re-read
`docs/BUILD-PLAN.md` (A2 section) and `docs/A1-BILINGUAL-SPIKE.md` before continuing.

**A2 rule reminder:** interface labels only — **no client-facing translation** in
A2. Questions/topics/page copy stay English until A3. So no Arabic *content* is
authored here; we build the plumbing + English/Arabic interface labels + fallback.

## Decisions carried in (see docs/DECISIONS.md)
- Content schema → **Option A** (parallel nullable `*Ar` columns). Owner to confirm.
- Steps-as-JSON → **Option 1** (parallel `stepsAr` JSON column + length-5 guard).
  Owner to confirm at the point of migration.
- Type pairing → **Markazi Text (headings) + Noto Sans Arabic (body)**; Plex stays
  admin-only.
- Gender-of-address + «التدريب/الكوتشينغ» + «الملاحظة/التغذية الراجعة» → OPEN, block
  **A3** not A2.

## Slice status

- [x] **Slice 1 — Arabic type foundation** (commit `5315c68`)
  - `src/app/layout.tsx`: added `Markazi_Text` + `Noto_Sans_Arabic` via next/font,
    `preload:false` (so `/en` never fetches them), variables on `<html>`.
  - `src/styles/tokens.css`: `--font-arabic-display`, `--font-arabic-body`,
    `--lh-body-ar` (1.8), `--lh-heading-ar` (1.4). Note: Arabic must never be
    letter-spaced.
  - `tailwind.config.ts`: `font-arabic-display`, `font-arabic-body`,
    `leading-body-ar`, `leading-heading-ar`.
  - `vitest.setup.ts`: mocked the two new loaders.
  - Verified: typecheck ✓, `layout.test.tsx` + `layout.i18n-isolation.test.tsx` ✓
    (public root stays `lang=en`/`dir=ltr`). Full prod build NOT yet run (A2 gate).

- [ ] **Slice 2 — Routing restructure to `[locale]` (the backbone, do next).**
  - Move public routes under `src/app/[locale]/` with
    `generateStaticParams()` → `['en','ar']`. Public pages today (to move):
    `page.tsx` (home), `about`, `book`, `book/confirmed`, `contact`, `questions`,
    `topics`, `styleguide`. **Do NOT move** `admin`, `coach`, `login`, `api`,
    `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `not-found.tsx` (decide 404).
  - Public `[locale]/layout.tsx` sets `lang`/`dir` per locale and applies
    `font-arabic-display`/`font-arabic-body` under `ar`. Root `layout.tsx` keeps
    `lang=en dir=ltr` on `<html>` (isolation test depends on this — keep it green).
  - Static-export wrinkle (from A1): root `/` language redirect needs a Netlify edge
    rule or a client detect — `src/middleware.ts` exists but middleware does NOT run
    on pure static export. Decide the mechanism explicitly.
  - Keep **shared English slugs** across locales (switch = prefix swap).
  - **Commit only when the whole tree compiles and both `/en` and `/ar` render.**

- [ ] **Slice 3 — Header language switcher + SEO**: switcher on every page (prefix
  swap, preserves path + hash); `hreflang` alternates; both locales in
  `sitemap.ts`; locale-correct metadata + JSON-LD.

- [ ] **Slice 4 — Public interface-label dictionary**: extract public UI strings
  (~80–120: nav/header/footer/buttons/form labels/validation/empty/error) into a
  public dictionary (English + Arabic *interface labels* — these ARE allowed in A2;
  they're interface, not client marketing copy). Reuse the admin i18n translator
  pattern (`src/i18n/`), but a SEPARATE public dictionary — don't let the dashboard
  shape the public site.

- [ ] **Slice 5 — RTL logical-CSS sweep + guard test**: convert public components to
  logical properties (`ms/me`, `ps/pe`, `text-start/end`, `inset-inline`); add a
  guard test that fails on new physical `ml-/mr-/pl-/pr-/left-/right-` in public
  components. Mirror: nav order, chevrons/arrows, accordion rail, card alignment,
  mobile drawer slide direction, footer columns. Do NOT mirror: KYNDER wordmark,
  decorative ripples, phone numbers. (Admin already did this pattern — reuse it.)

- [ ] **Slice 6 — Content model migration**: additive nullable `*Ar` columns
  (`questionAr`, `stepsAr`, `titleAr`, `blurbAr`, coach `bioAr`/`titleAr`) +
  Prisma migration + seed update (no Arabic values yet) + app-layer fallback
  (`ar ?? en`) + admin side-by-side EN/AR fields flagged "untranslated". Static
  `src/data/*.ts` copy gets parallel Arabic fields (empty in A2).

- [ ] **A2 GATE** (report each with real output): both locales render every page;
  switcher preserves page both directions; zero horizontal overflow in Arabic at
  320/375/768/1024/1440; axe zero violations in Arabic incl. accordion-open +
  mobile-drawer-open; no physical L/R spacing left in public components; Lighthouse
  not regressed either locale; typecheck+lint+tests+build pass; screenshot every
  page at 375 & 1440 in Arabic. Then stop for owner.

## Cross-session loose ends (not A2, but don't lose them)
- **`ci.yml` not on `origin/main`** — web-UI add didn't land (verified 404). Open.
- **local/remote `main` divergence** — `origin/main` tip is `e2a7179` (drop-CI
  backup commit); local `main` has real `ci.yml` and is ahead in content but
  diverged. Normal push will be non-fast-forward. Clean fix needs the `workflow`
  scope, then reconcile. Deferred.
