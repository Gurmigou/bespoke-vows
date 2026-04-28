ALTER TABLE "invitations" ADD COLUMN "hidden" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "deleted_at" timestamp;
