# Database setup (Postgres)

KYNDER uses **Postgres** via Prisma. SQLite was removed because a serverless
host wipes its filesystem on every deploy, so a `file:./dev.db` database does not
persist. The connection string is read from `DATABASE_URL` **only** — there is no
hardcoded fallback.

Any Postgres works. Below are the two free-tier options.

---

## Option A — Neon (recommended, serverless Postgres)

1. Create a free account at <https://neon.tech> and click **New Project**.
2. After it provisions, open **Dashboard → Connection Details**.
3. Copy the **pooled** connection string. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require
   ```
4. Set it as `DATABASE_URL` (locally in `.env`, and in your host's env vars).

> Neon note: use the **pooled** URL (host contains `-pooler`) for the app runtime.
> For running migrations you can use either the pooled or the direct URL.

## Option B — Supabase

1. Create a project at <https://supabase.com> → **New project** (set a DB password).
2. Open **Project Settings → Database → Connection string → URI**.
3. Copy the string and substitute your password:
   ```
   postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
   ```
4. Set it as `DATABASE_URL`.

> Supabase note: for serverless/edge deployments prefer the **Connection Pooler**
> string (port `6543`, `?pgbouncer=true`) for the app runtime.

---

## First-time setup (local)

With `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` set in `.env`:

```bash
npm install                 # runs `prisma generate` via postinstall
npm run db:migrate          # applies prisma/migrations to your database
npm run db:seed             # seeds questions, topics, settings + admin account
npm run dev
```

`db:migrate` runs `prisma migrate deploy`, which applies the committed migration
in `prisma/migrations/`. To create a **new** migration after changing
`schema.prisma`, run `npm run db:migrate:dev -- --name your_change`.

## The seed is idempotent

`npm run db:seed` uses `upsert`/count-guards, so running it repeatedly does not
create duplicates and does **not** overwrite content you have edited in the admin
(site settings are only created if missing). The admin account is created from
`ADMIN_EMAIL` / `ADMIN_PASSWORD` — no default password exists.

## On deploy

Migrations run automatically as part of the deploy build command
(`prisma migrate deploy`) — see `docs/DEPLOY.md`. Seeding is a **one-time**
manual step you run once against the production database (see DEPLOY.md), not on
every deploy.
