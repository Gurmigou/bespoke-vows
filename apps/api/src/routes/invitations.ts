import { Hono } from 'hono';
import { eq, and, or, isNull, isNotNull, lt, count } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { db } from '../db/index.js';
import { invitations } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { deriveStatus } from '../lib/status.js';
import { verifyPlataSignature } from '../lib/payment.js';
import type { JwtPayload } from '../lib/jwt.js';

type Variables = { user: JwtPayload };

const FREE_INVITATION_LIMIT = 3;
const FREE_DAYS_LIMIT = 7;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const VALID_TEMPLATE_IDS = new Set(['classic', 'modern', 'floral']);

function formatInvitation(row: typeof invitations.$inferSelect) {
  return {
    ...row,
    derivedStatus: deriveStatus(row),
    publishedAt: row.publishedAt?.toISOString() ?? null,
    lastPublishedAt: row.lastPublishedAt?.toISOString() ?? null,
    paidUntil: row.paidUntil?.toISOString() ?? null,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function deleteBlobs(cfg: unknown) {
  const c = cfg as { loveStory?: { image1Url?: string; image2Url?: string } };
  const urls = [c.loveStory?.image1Url, c.loveStory?.image2Url].filter((u): u is string => Boolean(u));
  if (urls.length > 0) await del(urls).catch(() => {});
}

export const invitationRoutes = new Hono<{ Variables: Variables }>();

invitationRoutes.post('/', requireAuth, async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{ templateId?: string; config?: unknown }>();

  if (!body.templateId || !VALID_TEMPLATE_IDS.has(body.templateId)) {
    return c.json({ error: 'templateId must be classic, modern, or floral' }, 400);
  }

  const now = new Date();
  const [{ value: unpaidCount }] = await db
    .select({ value: count() })
    .from(invitations)
    .where(
      and(
        eq(invitations.userId, user.sub),
        isNull(invitations.deletedAt),
        or(isNull(invitations.paidUntil), lt(invitations.paidUntil, now))
      )
    );

  if (Number(unpaidCount) >= FREE_INVITATION_LIMIT) {
    return c.json({ error: 'Maximum 3 free invitations allowed. Pay for one to create more free slots.' }, 403);
  }

  const [invitation] = await db
    .insert(invitations)
    .values({ userId: user.sub, templateId: body.templateId, config: body.config ?? {} })
    .returning();

  return c.json(formatInvitation(invitation), 201);
});

invitationRoutes.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.userId, user.sub), isNull(invitations.deletedAt)))
    .orderBy(invitations.createdAt);

  return c.json(rows.map(formatInvitation));
});

invitationRoutes.get('/trash', requireAuth, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.userId, user.sub), isNotNull(invitations.deletedAt)))
    .orderBy(invitations.deletedAt);

  return c.json(rows.map(formatInvitation));
});

invitationRoutes.get('/:id', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const [row] = await db.select().from(invitations).where(eq(invitations.id, id));

  if (!row) return c.json({ error: 'Not found' }, 404);
  if (row.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);

  return c.json(formatInvitation(row));
});

invitationRoutes.patch('/:id', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const body = await c.req.json<{ config?: unknown }>();

  if (!body.config || typeof body.config !== 'object') {
    return c.json({ error: 'config is required' }, 400);
  }

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);

  const [updated] = await db
    .update(invitations)
    .set({ config: body.config, updatedAt: new Date() })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(formatInvitation(updated));
});

invitationRoutes.delete('/:id', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);
  if (existing.deletedAt) return c.json({ error: 'Already in trash' }, 409);

  const status = deriveStatus(existing);
  const isPaid = status === 'active_paid' || (existing.paidUntil !== null);

  if (isPaid) {
    const [updated] = await db
      .update(invitations)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();
    return c.json({ moved_to_trash: true, invitation: formatInvitation(updated) });
  }

  await deleteBlobs(existing.config);
  await db.delete(invitations).where(eq(invitations.id, id));
  return c.json({ ok: true });
});

invitationRoutes.delete('/:id/permanent', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);
  if (!existing.deletedAt) return c.json({ error: 'Not in trash' }, 409);

  await deleteBlobs(existing.config);
  await db.delete(invitations).where(eq(invitations.id, id));
  return c.json({ ok: true });
});

invitationRoutes.post('/:id/restore', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);
  if (!existing.deletedAt) return c.json({ error: 'Not in trash' }, 409);

  const [updated] = await db
    .update(invitations)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(formatInvitation(updated));
});

invitationRoutes.post('/:id/hide', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);

  const [updated] = await db
    .update(invitations)
    .set({ hidden: !existing.hidden, updatedAt: new Date() })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(formatInvitation(updated));
});

invitationRoutes.post('/:id/publish', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);

  const currentStatus = deriveStatus(existing);

  if (currentStatus === 'active_free') {
    return c.json({ error: 'Invitation is already active. Wait for it to expire before republishing.' }, 409);
  }

  const isPaidActive = currentStatus === 'active_paid';
  if (!isPaidActive && existing.freeActiveDaysUsed >= FREE_DAYS_LIMIT) {
    return c.json({ error: 'Free period exhausted. Pay to republish.' }, 403);
  }

  const now = new Date();
  const [updated] = await db
    .update(invitations)
    .set({
      lastPublishedAt: now,
      publishedAt: existing.publishedAt ?? now,
      freeActiveDaysUsed: isPaidActive ? existing.freeActiveDaysUsed : existing.freeActiveDaysUsed + 1,
      updatedAt: now,
    })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(formatInvitation(updated));
});

invitationRoutes.post('/:id/pay', async (c) => {
  const { id } = c.req.param();
  const rawBody = await c.req.text();
  const signature = c.req.header('x-sign') ?? '';

  if (!verifyPlataSignature(rawBody, signature)) {
    return c.json({ error: 'Invalid signature' }, 401);
  }

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const paidUntil = new Date(Date.now() + ONE_YEAR_MS);
  const [updated] = await db
    .update(invitations)
    .set({ paidUntil, updatedAt: new Date() })
    .where(eq(invitations.id, id))
    .returning();

  return c.json(formatInvitation(updated));
});

export const publicInvitationRoutes = new Hono();

publicInvitationRoutes.get('/:id', async (c) => {
  const { id } = c.req.param();
  const [row] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!row) return c.json({ error: 'Not found' }, 404);

  if (row.deletedAt || row.hidden) {
    return c.json({ error: 'This invitation is no longer active', status: 'hidden' }, 410);
  }

  const status = deriveStatus(row);
  if (status === 'locked' || status === 'expired' || status === 'draft') {
    return c.json({ error: 'This invitation is no longer active', status }, 410);
  }

  return c.json(formatInvitation(row));
});
