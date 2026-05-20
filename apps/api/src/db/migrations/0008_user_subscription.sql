ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_status" text NOT NULL DEFAULT 'none';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_end_date" timestamp;
