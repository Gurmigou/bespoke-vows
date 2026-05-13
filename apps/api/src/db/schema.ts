import { pgTable, uuid, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  definition: jsonb('definition').notNull(),
  defaultData: jsonb('default_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  templateId: uuid('template_id').notNull(),
  status: text('status').notNull().default('draft'),
  paymentStatus: text('payment_status').notNull().default('free'),
  activeUntil: timestamp('active_until'),
  visible: boolean('visible').notNull().default(true),
  visibleStatusChangedAt: timestamp('visible_status_changed_at'),
  paymentId: uuid('payment_id'),
  freeTrialUsedAt: timestamp('free_trial_used_at'),
  config: jsonb('config').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  invitationId: uuid('invitation_id').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  provider: text('provider').notNull(),
  providerRef: text('provider_ref'),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const consumedPreviewTokens = pgTable('consumed_preview_tokens', {
  jti: uuid('jti').primaryKey(),
  invitationId: uuid('invitation_id').notNull(),
  consumedAt: timestamp('consumed_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type TemplateRow = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type InvitationRow = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type PaymentRow = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
