import { Hono } from 'hono';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { payments, invitations, templates, users } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { toPaymentDto } from '../lib/serialize.js';
import type { JwtPayload } from '../lib/jwt.js';
import type { InvitationData } from '@bespoke-vows/shared';
import { PRICE_LIFETIME_CENTS, PRICING_CURRENCY } from '../lib/pricing.js';
import { grantLifetime, userHasLifetime } from '../lib/entitlements.js';
import { sendPurchaseConfirmationEmail } from '../lib/email.js';

type Variables = { user: JwtPayload };

export const paymentRoutes = new Hono<{ Variables: Variables }>();

paymentRoutes.post('/lifetime', requireAuth, async (c) => {
  const user = c.get('user');
  const body = await c.req
    .json<{ amount?: number; currency?: string }>()
    .catch(() => ({} as { amount?: number; currency?: string }));

  if (await userHasLifetime(user.sub)) {
    return c.json({ error: 'already_lifetime' }, 409);
  }

  const amount = body.amount ?? PRICE_LIFETIME_CENTS;
  const currency = body.currency ?? PRICING_CURRENCY;

  const [payment] = await db
    .insert(payments)
    .values({
      userId: user.sub,
      invitationId: null,
      amount,
      currency,
      provider: 'plata_mock',
      status: 'succeeded',
      kind: 'lifetime',
    })
    .returning();

  await grantLifetime(user.sub);

  try {
    const [dbUser] = await db.select().from(users).where(eq(users.id, user.sub));
    const emailTo = dbUser?.email ?? user.email;
    await sendPurchaseConfirmationEmail(emailTo);
  } catch (err) {
    console.error('[email] purchase confirmation failed:', err);
  }

  return c.json({ ok: true, paymentId: payment.id }, 201);
});

paymentRoutes.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(payments)
    .where(and(eq(payments.userId, user.sub), isNull(payments.deletedAt)))
    .orderBy(desc(payments.createdAt));

  if (rows.length === 0) return c.json([]);

  const invIds = Array.from(new Set(rows.map((r) => r.invitationId).filter((id): id is string => id !== null)));
  const invs = await db.select().from(invitations).where(eq(invitations.userId, user.sub));
  const byId = new Map(invs.filter((i) => invIds.includes(i.id)).map((i) => [i.id, i]));

  const allTemplates = await db.select().from(templates);
  const templateById = new Map(allTemplates.map((t) => [t.id, t]));

  return c.json(
    rows.map((p) => {
      const inv = p.invitationId ? byId.get(p.invitationId) : undefined;
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
