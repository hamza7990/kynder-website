-- A2 Slice 6 — bilingual content plumbing.
--
-- ADDITIVE and NULLABLE only. No existing column is altered, renamed or dropped:
-- the English columns (question, steps, title, blurb, User.title, User.bio) are
-- contractually verbatim and are left byte-identical by this migration. Each new
-- *Ar column starts NULL and falls back to its English sibling at read time.
--
-- No Arabic values are written here (that is A3). Schema + plumbing only.
--
-- ── ROLLBACK ────────────────────────────────────────────────────────────────
-- This migration is reversible. To roll back, run the statements in the sibling
-- down.sql (drops the six added columns), then mark the migration rolled back:
--   npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/0003_arabic_content/down.sql
--   npx prisma migrate resolve --rolled-back 0003_arabic_content
-- Because every added column is nullable and additive, the drop is clean and the
-- English content is untouched.

ALTER TABLE "Question" ADD COLUMN "questionAr" TEXT;
ALTER TABLE "Question" ADD COLUMN "stepsAr" TEXT;

ALTER TABLE "Topic" ADD COLUMN "titleAr" TEXT;
ALTER TABLE "Topic" ADD COLUMN "blurbAr" TEXT;

ALTER TABLE "User" ADD COLUMN "titleAr" TEXT;
ALTER TABLE "User" ADD COLUMN "bioAr" TEXT;
