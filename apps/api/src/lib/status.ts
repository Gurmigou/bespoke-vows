import type { DerivedStatus } from '@bespoke-vows/shared';
import type { InvitationRow } from '../db/schema.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const FREE_DAYS_LIMIT = 7;

export function deriveStatus(inv: InvitationRow): DerivedStatus {
  const now = new Date();

  if (inv.paidUntil && inv.paidUntil > now) return 'active_paid';
  if (inv.freeActiveDaysUsed >= FREE_DAYS_LIMIT) return 'locked';

  if (inv.lastPublishedAt) {
    const lastPublishWasPaid = inv.paidUntil && inv.paidUntil > inv.lastPublishedAt;
    if (!lastPublishWasPaid) {
      const expiresAt = new Date(inv.lastPublishedAt.getTime() + ONE_DAY_MS);
      if (expiresAt > now) return 'active_free';
    }
    return 'expired';
  }

  return 'draft';
}
