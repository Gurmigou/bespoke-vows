ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "kind" text NOT NULL DEFAULT 'invitation_1y';
ALTER TABLE "payments" ALTER COLUMN "invitation_id" DROP NOT NULL;
