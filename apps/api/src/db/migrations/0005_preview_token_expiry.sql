ALTER TABLE "consumed_preview_tokens" ADD COLUMN "expires_at" timestamp NOT NULL DEFAULT now();
ALTER TABLE "consumed_preview_tokens" ALTER COLUMN "expires_at" DROP DEFAULT;
CREATE INDEX IF NOT EXISTS "consumed_preview_tokens_expires_at_idx" ON "consumed_preview_tokens" ("expires_at");
