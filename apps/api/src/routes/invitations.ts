import { Hono } from 'hono';
import type { Context } from 'hono';
import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../db/index.js';
import { invitations, templates, payments } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { canPublish, derivedStatus, LIFETIME_ACTIVE_UNTIL } from '../lib/status.js';
import { userHasLifetime, getProEntitlement } from '../lib/entitlements.js';
import { PRICE_INVITATION_1Y_CENTS, PRICING_CURRENCY } from '../lib/pricing.js';
import { signPreviewToken } from '../lib/jwt.js';
import { toInvitationDto } from '../lib/serialize.js';
import type { JwtPayload } from '../lib/jwt.js';
import type { InvitationData } from '@bespoke-vows/shared';
import { buildDefaultInvitationData } from '@bespoke-vows/shared';

type Variables = { user: JwtPayload };

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveTemplate(idOrSlug: string) {
  const isUuid = UUID_RE.test(idOrSlug);
  const [template] = await db
    .select()
    .from(templates)
    .where(and(isUuid ? eq(templates.id, idOrSlug) : eq(templates.slug, idOrSlug), isNull(templates.deletedAt)));
  return template ?? null;
}

async function loadOwnedInvitation(
  id: string,
  userId: string,
): Promise<typeof invitations.$inferSelect | null | 'deleted'> {
  const [row] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!row || row.userId !== userId) return null;
  if (row.deletedAt !== null) return 'deleted';
  return row;
}

async function dtoFor(row: typeof invitations.$inferSelect) {
  const [template] = await db.select().from(templates).where(eq(templates.id, row.templateId));
  return toInvitationDto(row, template?.slug ?? '');
}

export const invitationRoutes = new Hono<{ Variables: Variables }>();

invitationRoutes.post('/', requireAuth, async (c) => {
  const user = c.get('user');
  const body = await c.req
    .json<{ templateId?: string; config?: Partial<InvitationData> }>()
    .catch(() => ({} as { templateId?: string; config?: Partial<InvitationData> }));

  if (!body.templateId) {
    return c.json({ error: 'templateId_required' }, 400);
  }

  const template = await resolveTemplate(body.templateId);
  if (!template) {
    return c.json({ error: 'template_not_found' }, 400);
  }

  const config = { ...(template.defaultData as InvitationData), ...(body.config ?? {}) };

  const [invitation] = await db
    .insert(invitations)
    .values({ userId: user.sub, templateId: template.id, config })
    .returning();

  return c.json(toInvitationDto(invitation, template.slug), 201);
});

invitationRoutes.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.userId, user.sub), isNull(invitations.deletedAt)))
    .orderBy(invitations.createdAt);

  const allTemplates = await db.select().from(templates);
  const slugById = new Map(allTemplates.map((t) => [t.id, t.slug]));

  return c.json(rows.map((r) => toInvitationDto(r, slugById.get(r.templateId) ?? '')));
});

invitationRoutes.get('/:id', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const row = await loadOwnedInvitation(id, user.sub);
  if (row === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (row === null) return c.json({ error: 'not_found' }, 404);
  return c.json(await dtoFor(row));
});

async function patchConfig(c: Context<{ Variables: Variables }>) {
  const user = c.get('user');
  const id = c.req.param('id');
  const body = await c.req
    .json<{ config?: Partial<InvitationData> }>()
    .catch(() => ({} as { config?: Partial<InvitationData> }));

  if (!body.config || typeof body.config !== 'object') {
    return c.json({ error: 'config_required' }, 400);
  }

  const existing = await loadOwnedInvitation(id, user.sub);
  if (existing === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (existing === null) return c.json({ error: 'not_found' }, 404);

  const merged = { ...(existing.config as InvitationData), ...body.config };

  const [updated] = await db
    .update(invitations)
    .set({ config: merged, updatedAt: new Date() })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(await dtoFor(updated));
}

invitationRoutes.post('/:id/sync', requireAuth, patchConfig);
invitationRoutes.patch('/:id', requireAuth, patchConfig);

invitationRoutes.post('/:id/reset', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const existing = await loadOwnedInvitation(id, user.sub);
  if (existing === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (existing === null) return c.json({ error: 'not_found' }, 404);

  const [template] = await db.select().from(templates).where(eq(templates.id, existing.templateId));
  if (!template) return c.json({ error: 'template_not_found' }, 404);

  const defaultConfig = buildDefaultInvitationData(
    (template.definition as { defaultColors: InvitationData['templateColors'] }).defaultColors,
  );
  const [updated] = await db
    .update(invitations)
    .set({ config: defaultConfig, updatedAt: new Date() })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(toInvitationDto(updated, template.slug));
});

invitationRoutes.delete('/:id', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const existing = await loadOwnedInvitation(id, user.sub);
  if (existing === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (existing === null) return c.json({ error: 'not_found' }, 404);

  const now = new Date();
  await db
    .update(invitations)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(invitations.id, id));

  return c.json({ ok: true });
});

invitationRoutes.post('/:id/hide', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const body = await c.req
    .json<{ visible?: boolean }>()
    .catch(() => ({} as { visible?: boolean }));

  if (typeof body.visible !== 'boolean') {
    return c.json({ error: 'visible_required' }, 400);
  }

  const existing = await loadOwnedInvitation(id, user.sub);
  if (existing === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (existing === null) return c.json({ error: 'not_found' }, 404);

  if (derivedStatus(existing) !== 'active') {
    return c.json({ error: 'not_active' }, 409);
  }

  const now = new Date();
  const [updated] = await db
    .update(invitations)
    .set({ visible: body.visible, visibleStatusChangedAt: now, updatedAt: now })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(await dtoFor(updated));
});

invitationRoutes.post('/:id/publish', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const existing = await loadOwnedInvitation(id, user.sub);
  if (existing === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (existing === null) return c.json({ error: 'not_found' }, 404);

  const hasLifetime = await userHasLifetime(user.sub);
  const decision = canPublish(existing, hasLifetime);
  if (decision.ok === false) {
    if (decision.reason === 'already_active') return c.json({ error: 'already_active' }, 409);
    return c.json({ error: 'payment_required' }, 402);
  }

  const now = new Date();
  const isLifetime = decision.mode === 'lifetime';
  const [updated] = await db
    .update(invitations)
    .set({
      status: 'active',
      paymentStatus: isLifetime ? 'paid' : 'free',
      activeUntil: isLifetime ? LIFETIME_ACTIVE_UNTIL : new Date(now.getTime() + THREE_DAYS_MS),
      freeTrialUsedAt: isLifetime ? existing.freeTrialUsedAt : now,
      visible: true,
      updatedAt: now,
    })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(await dtoFor(updated));
});

invitationRoutes.post('/:id/pay', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const body = await c.req
    .json<{ amount?: number; currency?: string }>()
    .catch(() => ({} as { amount?: number; currency?: string }));

  const existing = await loadOwnedInvitation(id, user.sub);
  if (existing === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (existing === null) return c.json({ error: 'not_found' }, 404);

  const now = new Date();
  const pro = await getProEntitlement(user.sub, now);
  const amount = body.amount ?? PRICE_INVITATION_1Y_CENTS;
  const currency = body.currency ?? PRICING_CURRENCY;

  const oneYearFromNow = new Date(now.getTime() + ONE_YEAR_MS);
  const proActiveUntil =
    pro.endDate && pro.endDate.getTime() < oneYearFromNow.getTime() ? pro.endDate : oneYearFromNow;

  const [payment] = await db
    .insert(payments)
    .values({
      userId: user.sub,
      invitationId: id,
      amount: pro.active ? 0 : amount,
      currency,
      provider: pro.active ? 'pro_subscription' : 'plata_mock',
      status: 'succeeded',
      kind: pro.active ? 'lifetime' : 'invitation_1y',
    })
    .returning();

  const [updated] = await db
    .update(invitations)
    .set({
      status: 'active',
      paymentStatus: 'paid',
      activeUntil: pro.active ? proActiveUntil : oneYearFromNow,
      paymentId: payment.id,
      visible: true,
      updatedAt: now,
    })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(await dtoFor(updated));
});

invitationRoutes.post('/:id/preview-token', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const existing = await loadOwnedInvitation(id, user.sub);
  if (existing === 'deleted') return c.json({ error: 'invitation_deleted' }, 410);
  if (existing === null) return c.json({ error: 'not_found' }, 404);

  const token = await signPreviewToken({ invitationId: id, ownerId: user.sub });
  return c.json({ token });
});
