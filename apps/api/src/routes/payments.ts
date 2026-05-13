import { Hono } from 'hono';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { payments, invitations, templates } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { toPaymentDto } from '../lib/serialize.js';
import type { JwtPayload } from '../lib/jwt.js';
import type { InvitationData } from '@bespoke-vows/shared';

type Variables = { user: JwtPayload };

export const paymentRoutes = new Hono<{ Variables: Variables }>();

paymentRoutes.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(payments)
    .where(and(eq(payments.userId, user.sub), isNull(payments.deletedAt)))
    .orderBy(desc(payments.createdAt));

  if (rows.length === 0) return c.json([]);

  const invIds = Array.from(new Set(rows.map((r) => r.invitationId)));
  const invs = await db.select().from(invitations).where(eq(invitations.userId, user.sub));
  const byId = new Map(invs.filter((i) => invIds.includes(i.id)).map((i) => [i.id, i]));

  const allTemplates = await db.select().from(templates);
  const templateById = new Map(allTemplates.map((t) => [t.id, t]));

  return c.json(
    rows.map((p) => {
      const inv = byId.get(p.invitationId);
      const tpl = inv ? templateById.get(inv.templateId) : undefined;
      const cfg = (inv?.config ?? {}) as Partial<InvitationData>;
      return toPaymentDto(p, {
        hisName: cfg.hisName ?? '',
        herName: cfg.herName ?? '',
        templateSlug: tpl?.slug ?? '',
        activeUntil: inv?.activeUntil ?? null,
      });
    })
  );
});
