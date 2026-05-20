import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, invitations } from '../db/schema.js';
import { LIFETIME_ACTIVE_UNTIL } from './status.js';

export async function userHasLifetime(userId: string, now: Date = new Date()): Promise<boolean> {
  const ent = await getProEntitlement(userId, now);
  return ent.active;
}

export async function getProEntitlement(
  userId: string,
  now: Date = new Date(),
): Promise<{ active: boolean; endDate: Date | null }> {
  const [row] = await db
    .select({ status: users.subscriptionStatus, endDate: users.subscriptionEndDate })
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deletedAt)));
  if (!row) return { active: false, endDate: null };
  if (row.status !== 'pro') return { active: false, endDate: row.endDate ?? null };
  if (row.endDate && row.endDate <= now) return { active: false, endDate: row.endDate };
  return { active: true, endDate: row.endDate ?? null };
}

export async function grantLifetime(userId: string): Promise<void> {
  const now = new Date();
  await db
    .update(users)
    .set({ subscriptionStatus: 'pro', subscriptionEndDate: LIFETIME_ACTIVE_UNTIL, updatedAt: now })
    .where(eq(users.id, userId));
  await db
    .update(invitations)
    .set({ status: 'active', paymentStatus: 'paid', activeUntil: LIFETIME_ACTIVE_UNTIL, visible: true, updatedAt: now })
    .where(and(eq(invitations.userId, userId), isNull(invitations.deletedAt)));
}
