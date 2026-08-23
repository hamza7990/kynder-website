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

- [x] **Slice 2 — Routing restructure to `[locale]`** (commit `89b03b8`)
  - **CORRECTION to A1:** the app is **SSR** (`next build`/`next start`, no
    `output:'export'`, `force-dynamic` pages), NOT static export. So middleware DOES
    run and the "static-hosting redirect wrinkle" from A1 does not apply — the root
    `/` redirect is handled in middleware. (`out/` + lighthouse `./out` are stale
    artifacts from an earlier static phase; unrelated to A2.)
  - Moved under `src/app/[locale]/`: home, about, book(+confirmed), contact,
    questions, topics, styleguide. **Not moved:** admin, coach, login, api,
    sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx, layout.tsx.
  - `src/middleware.ts`: redirects unprefixed public paths → `/en|/ar`
    (cookie `NEXT_LOCALE` → Accept-Language → en); sets `x-locale` request header;
    keeps existing auth protection. Matcher excludes `api`, `_next`,
    `opengraph-image`, and dotted files.
  - **`<html lang/dir>` is set by the ROOT layout from the `x-locale` header**
    (App Router can't set `<html>` from a nested layout). Absent header → en, so the
    public site never inherits an admin's Arabic session. `[locale]/layout.tsx` only
    validates the locale (`notFound` otherwise).
  - Slugs: **shared English** across locales (switch = prefix swap).
  - Verified: typecheck ✓, 24 unit tests ✓ (incl. isolation), production build ✓
    (both locales, admin intact, middleware 39.4 kB), force-dynamic NOT frozen ✓.
    Runtime probe (`next start`): `/about`→307→`/en/about`; `/en`→`<html lang=en
    dir=ltr>`; `/ar`→`<html lang=ar dir=rtl>` with real content. ✓
  - **Deferred to later slices (known, intentional):** internal `<Link href>` still
    point at unprefixed paths (middleware redirects them to the cookie locale — works,
    but Slice 3 makes links locale-explicit); page `metadata` is still static English
    on both locales (Slice 3 adds `generateMetadata` + hreflang); `sitemap.ts` still
    emits unprefixed URLs (Slice 3). Playwright e2e specs hit `/about` etc. and will
    need `/en` paths — update at the A2 gate.

- [x] **Slice 3 — Language switcher + SEO** (commits `8d01a3b` SEO, `c10d2a4` switcher)
  - **SEO:** `buildPageMetadata(seo, title, locale)` → localized canonical +
    `alternates.languages` (en/ar/x-default) + OG locale; the 6 public pages use
    `generateMetadata({params})`. `sitemap.ts` emits `/en` + `/ar` for every route
    with hreflang alternates.
  - **Switcher:** `src/components/layout/locale-switcher.tsx` — links to the SAME
    page in the other locale (segment swap), active locale marked, autonyms +
    sr-only names. Placed in the header (desktop) and the mobile drawer.
  - **Locale-aware global nav:** `src/lib/i18n/locale-path.ts`
    (`localeFromPathname`/`localeHref`/`switchLocalePath`); `AppShell` threads the URL
    locale to `Header` + `Footer`; wordmark, primary nav, booking CTA, footer links
    are locale-prefixed (no redirect hop). Optional `locale` prop defaults to `en`
    so isolated component renders/tests are unaffected.
  - Verified: typecheck ✓, 13 layout tests ✓, production build ✓ (36 pages), runtime
    probe ✓ — `/en/questions` switcher → `/ar/questions`; hreflang en/ar/x-default in
    `<head>`; header nav prefixed; localized canonical; bilingual sitemap.
  - **Deferred (small, intentional):** (1) **Structured-data `inLanguage`** not yet
    localized — Organization/Person JSON-LD is currently locale-neutral; threading
    locale into `OrganizationJsonLd`/`PersonJsonLd` touches home/about pages + their
    tests, so folded into the A2 gate. (2) **In-page CTA links** (topic→book,
    home preview→questions, book→topics) still unprefixed — middleware preserves
    locale via cookie (query + hash carry through); explicit prefixing + test updates
    happen in the **Slice 5** RTL sweep, which edits those same components.
  - **Switcher hash note:** `usePathname()` excludes the hash, so switching language
    on `/en/questions#q-03` lands on `/ar/questions` (page-level, not anchor-level).
    Acceptable; enhance with a client hash-carry in Slice 5 if wanted.

- [~] **Slice 4 — Public interface-label dictionary** (IN PROGRESS — commit 1/2 done: `74280f4`)
  - **DONE (commit 1):** built the separate public i18n — `src/i18n/public/`
    (`en.json`/`ar.json` + `config.ts` translator + `client.tsx` English-defaulting
    provider + `server.ts`). URL-locale, not session. Root layout resolves the dict
    and provides it via `AppShell`. Translated GLOBAL CHROME: skip link, footer
    headings + portal link, mobile-nav aria labels, header/mobile CTA button. Arabic
    is DRAFT, glossary-consistent; English preserved verbatim. **Nav labels left
    English** (owner boundary call — see below). Verified: typecheck, full suite
    (288), build (36 pages), runtime probe (/ar chrome Arabic, /en English).
  - **Also fixed two latent regressions** the full suite surfaced (Slice 2/3 misses
    from running targeted tests only): `layout.i18n-isolation` now asserts lang/dir on
    the `<html>` tag not whole markup (switcher legitimately renders `<a lang="ar">`);
    `pages-copy.test` + `home.test` now read pages from `src/app/[locale]/`.
    **Lesson for the gate: run the FULL `npm test`, not targeted subsets.**
  - **REMAINING (commit 2 — start here next):**
    - **Newsletter** strings live in `src/data/newsletter.ts` (emailLabel,
      placeholder, submitLabel, submittingLabel, invalidEmail, notConnected, success,
      error) — move into the public dict + `usePublicT` in `newsletter-form.tsx`.
      Test asserts `getByLabelText('Email address')` → keep that English value exact.
    - **404 chrome** in `src/app/not-found.tsx`.
    - **Public FORMS** — book + contact form field labels, placeholders, validation
      messages, submit/success/error microcopy. Read those components first; check
      their tests (contact/book have suites) before changing.
  - **OWNER DECISION PENDING — nav labels.** "Leadership Questions", "Coaching
    Topics", "About", "Contact" are held ENGLISH for now (boundary: no client copy
    without approval). Consistent with A2 (all /ar content is English until A3). Owner
    to decide: translate now as interface, or defer to A3 with the page copy. If now,
    it's a tiny add (author ~4 AR labels using GLOSSARY-AR terms).
  - **Original goal + scope reference below (unchanged):**
  - **Goal:** extract public UI *chrome* strings into a public dictionary
    (English + Arabic interface labels; interface labels ARE allowed in A2).
  - **SCOPE BOUNDARY — read before extracting.** A2 = interface only. So:
    - **Extract (interface chrome):** buttons ("Book a 1-on-1 Session"), footer
      column headings ("Explore"/"Connect"/"Stay in touch"), menu aria labels
      ("Open menu"/"Close menu"), skip link ("Skip to…"), newsletter form
      labels/placeholder/button, public FORM field labels + validation messages
      (book form, contact form), empty/error/success microcopy, 404 chrome.
    - **DO NOT extract (client marketing copy — stays English until A3):** hero &
      positioning prose, about bio, the 10 questions + steps, topic titles/blurbs,
      closing lines, page `<h1>`s that are verbatim brief copy.
    - **Judgment call to make deliberately:** the NAV labels ("Leadership
      Questions", "Coaching Topics", "About", "Contact") sit on the fence — nav
      chrome vs. brand phrasing. Decide with the owner whether to translate them in
      A2 (interface) or defer to A3 with the page copy for voice consistency. If
      translated, the Arabic MUST use docs/GLOSSARY-AR.md terms.
  - **Where the strings live (from a scan):** `src/data/nav.ts` (nav labels +
    bookingCta), `src/components/layout/{footer,mobile-nav,skip-link,newsletter-form}.tsx`,
    the public book/contact form components, `src/app/not-found.tsx`. The switcher is
    already done.
  - **Architecture:** a SEPARATE public dictionary (do NOT reuse the admin en/ar.json
    — different audience, different register). Public locale comes from the **URL
    param / `x-locale`**, NOT the session (that's the admin's mechanism). Mirror the
    admin split (`src/i18n/client.tsx` + `server.ts` + `config.ts` translator) but
    with a public dictionary and a URL-locale resolver. Provide the dictionary from
    `[locale]/layout.tsx` via a public `I18nProvider` so client components
    (Header/MobileNav) get a `useT`, and expose a server translator for server
    components (Nav/Footer are server, though currently rendered inside the client
    AppShell). Keep `src/lib/format.ts` for Western-digit numbers/dates.
  - **Watch the tests:** header/footer/mobile-nav tests assert by visible label text
    (e.g. `getByRole('link', { name: item.label })`). If nav labels move behind a
    translator, those tests need the provider or a default-English fallback so
    isolated renders still show English. Keep them green.

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
