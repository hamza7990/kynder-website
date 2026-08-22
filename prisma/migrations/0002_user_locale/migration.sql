-- Per-admin interface language. Default 'en' so existing admins are unaffected.
ALTER TABLE "User" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';
