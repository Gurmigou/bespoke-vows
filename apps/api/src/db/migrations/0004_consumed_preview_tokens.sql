CREATE TABLE IF NOT EXISTS "consumed_preview_tokens" (
	"jti" uuid PRIMARY KEY NOT NULL,
	"invitation_id" uuid NOT NULL,
	"consumed_at" timestamp DEFAULT now() NOT NULL
);
