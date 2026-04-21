import { Hono } from 'hono';
import { eq, and, or, isNull, lt, count } from 'drizzle-orm';
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
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
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
    .where(eq(invitations.userId, user.sub))
    .orderBy(invitations.createdAt);

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

  const cfg = existing.config as { loveStory?: { image1Url?: string; image2Url?: string } };
  const blobUrls = [cfg.loveStory?.image1Url, cfg.loveStory?.image2Url]
    .filter((u): u is string => Boolean(u));
  if (blobUrls.length > 0) {
    await del(blobUrls).catch(() => {});
  }

  await db.delete(invitations).where(eq(invitations.id, id));
  return c.json({ ok: true });
});

invitationRoutes.post('/:id/publish', requireAuth, async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const [existing] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.userId !== user.sub) return c.json({ error: 'Forbidden' }, 403);

  const isPaidActive = existing.paidUntil && existing.paidUntil > new Date();
  if (!isPaidActive && existing.freeActiveDaysUsed >= FREE_DAYS_LIMIT) {
    return c.json({ error: 'Free period exhausted. Pay to republish.' }, 403);
  }

  const now = new Date();
  const [updated] = await db
    .update(invitations)
    .set({
      lastPublishedAt: now,
      publishedAt: existing.publishedAt ?? now,
      freeActiveDaysUsed: existing.freeActiveDaysUsed + 1,
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

  const status = deriveStatus(row);
  if (status === 'locked' || status === 'expired' || status === 'draft') {
    return c.json({ error: 'This invitation is no longer active', status }, 410);
  }

  return c.json(formatInvitation(row));
});
