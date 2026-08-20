# Deploying KYNDER

This is a **server-rendered** Next.js App Router app (Server Actions + Prisma +
Postgres). It is **not** a static export.

## Recommended host: Vercel

Vercel is the simpler fit here and is recommended over the existing Netlify setup:

- First-party support for Next.js App Router, Server Actions and middleware —
  zero adapter/plugin needed (Netlify needs `@netlify/plugin-nextjs`).
- Server Actions (booking, contact, CMS saves) and per-request rendering "just
  work"; the old Netlify config assumed a static `out/` export, which this app
  can no longer produce.
- Env vars, preview deploys and running `prisma migrate deploy` in the build step
  are straightforward.

A working Netlify SSR config is still provided in `netlify.toml` if you prefer it.

---

## Deploy steps (from nothing)

1. **Create the database.** Follow `docs/DATABASE.md` to make a free Neon (or
   Supabase) Postgres and copy its `DATABASE_URL`.

2. **Push this repo to GitHub** (or GitLab/Bitbucket).

3. **Import the project into Vercel** (New Project → pick the repo). Framework
   preset is auto-detected as Next.js.

4. **Set Environment Variables** in Vercel (Project → Settings → Environment
   Variables), for the Production (and Preview) environments:

   | Variable | Required | Notes |
   |---|---|---|
   | `DATABASE_URL` | ✅ | Postgres connection string from step 1 |
   | `JWT_SECRET` | ✅ | `openssl rand -base64 48` |
   | `ADMIN_EMAIL` | ✅ (for seed) | founder admin login |
   | `ADMIN_PASSWORD` | ✅ (for seed) | founder admin password |
   | `NEXT_PUBLIC_SITE_URL` | ✅ | real domain, e.g. `https://www.kynder.coach` |
   | `NEXT_PUBLIC_SITE_NAME` | optional | defaults to `KYNDER` |
   | `NEXT_PUBLIC_SCHEDULER_URL` | optional | leave unset to use the built-in booking form |
   | `NEWSLETTER_ENDPOINT` | optional | footer newsletter target |
   | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | optional | analytics |

5. **Deploy.** The build command (see `vercel.json`) runs:
   ```
   prisma generate && prisma migrate deploy && next build
   ```
   so **migrations are applied automatically on every deploy**.

6. **Seed the database once.** After the first successful deploy, run the seed a
   single time against the production database. Easiest from your machine:
   ```bash
   # with the PRODUCTION DATABASE_URL + ADMIN_EMAIL + ADMIN_PASSWORD in your shell/.env
   npm run db:seed
   ```
   This loads the 10 questions, 15 topics, the site settings, and creates the
   admin account. It is idempotent — safe to re-run, and it will not overwrite
   content you later edit in the admin.

7. **Log in** at `/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` and verify the
   admin, then visit the public pages.

## Build & start commands (reference)

- Build (SSR): `next build` (deploy wraps it with `prisma migrate deploy`).
- Start (self-hosting): `next start`.
- Local clean build check:
  ```bash
  rm -rf node_modules .next && npm ci && npm run build
  ```
  `next build` needs `DATABASE_URL` and `JWT_SECRET` in the environment (the app
  refuses to start without them). If the DB is unreachable at build time, public
  pages fall back to their static copy rather than failing the build.
