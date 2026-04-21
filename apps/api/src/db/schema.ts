import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: text('google_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  templateId: text('template_id').notNull(),
  publishedAt: timestamp('published_at'),
  lastPublishedAt: timestamp('last_published_at'),
  freeActiveDaysUsed: integer('free_active_days_used').notNull().default(0),
  paidUntil: timestamp('paid_until'),
  config: jsonb('config').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type InvitationRow = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
