import type { DerivedStatus } from '@bespoke-vows/shared';
import type { InvitationRow } from '../db/schema.js';

export const LIFETIME_ACTIVE_UNTIL = new Date('9999-12-31T00:00:00Z');

export function derivedStatus(
  inv: Pick<InvitationRow, 'status' | 'activeUntil'>,
  now: Date = new Date(),
): DerivedStatus {
  if (inv.status === 'draft') return 'draft';
  if (inv.activeUntil && inv.activeUntil > now) return 'active';
  return 'expired';
}

export function canFreeTrial(inv: Pick<InvitationRow, 'freeTrialUsedAt'>): boolean {
  return inv.freeTrialUsedAt == null;
}

export type CanPublishResult =
  | { ok: true; mode: 'free' | 'lifetime' }
  | { ok: false; reason: 'already_active' | 'payment_required' };

export function canPublish(
  inv: Pick<InvitationRow, 'status' | 'activeUntil' | 'freeTrialUsedAt'>,
  userHasLifetime: boolean,
  now: Date = new Date(),
): CanPublishResult {
  if (derivedStatus(inv, now) === 'active') return { ok: false, reason: 'already_active' };
  if (userHasLifetime) return { ok: true, mode: 'lifetime' };
  if (canFreeTrial(inv)) return { ok: true, mode: 'free' };
  return { ok: false, reason: 'payment_required' };
}
