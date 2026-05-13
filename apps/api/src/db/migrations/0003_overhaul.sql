-- Drop old invitations table (will be re-created with new shape, no FK)
DROP TABLE IF EXISTS "invitations";
--> statement-breakpoint

-- Strip Google + name + avatar_url from users; require password_hash; add updated_at/deleted_at
DELETE FROM "users" WHERE "password_hash" IS NULL;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "google_id";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar_url";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;
--> statement-breakpoint

-- New templates table
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"definition" jsonb NOT NULL,
	"default_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint

-- Re-create invitations with new shape (no FK)
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"payment_status" text DEFAULT 'free' NOT NULL,
	"active_until" timestamp,
	"visible" boolean DEFAULT true NOT NULL,
	"visible_status_changed_at" timestamp,
	"payment_id" uuid,
	"free_trial_used_at" timestamp,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint

-- New payments table (no FK)
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"invitation_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"provider" text NOT NULL,
	"provider_ref" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
