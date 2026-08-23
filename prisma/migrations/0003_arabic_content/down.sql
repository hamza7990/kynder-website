-- Rollback for 0003_arabic_content (A2 Slice 6).
--
-- Prisma migrations are forward-only; this file is NOT run automatically. It is
-- the explicit, reviewed reverse of migration.sql. See migration.sql for the
-- two-step rollback procedure (db execute this file, then migrate resolve
-- --rolled-back 0003_arabic_content).
--
-- Dropping these columns discards ONLY Arabic content (all NULL in A2). The
-- English columns are never touched, so the English site is unaffected.

ALTER TABLE "Question" DROP COLUMN "questionAr";
ALTER TABLE "Question" DROP COLUMN "stepsAr";

ALTER TABLE "Topic" DROP COLUMN "titleAr";
ALTER TABLE "Topic" DROP COLUMN "blurbAr";

ALTER TABLE "User" DROP COLUMN "titleAr";
ALTER TABLE "User" DROP COLUMN "bioAr";
