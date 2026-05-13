import { Hono } from 'hono';
import { eq, and, isNull, lt } from 'drizzle-orm';
import { db } from '../db/index.js';
import { invitations, templates, consumedPreviewTokens } from '../db/schema.js';
import { derivedStatus } from '../lib/status.js';
import { verifyPreviewToken } from '../lib/jwt.js';
import { toTemplateDto } from '../lib/serialize.js';
import type { InvitationData } from '@bespoke-vows/shared';

export const publicRoutes = new Hono();

publicRoutes.get('/i/:id', async (c) => {
  const { id } = c.req.param();
  const [row] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, id), isNull(invitations.deletedAt)));

  if (!row) return c.json({ error: 'not_found' }, 404, { 'Cache-Control': 'no-store' });

  if (derivedStatus(row) !== 'active' || !row.visible) {
    return c.json({ error: 'gone' }, 410, { 'Cache-Control': 'no-store' });
  }

  const [template] = await db.select().from(templates).where(eq(templates.id, row.templateId));
  if (!template) return c.json({ error: 'template_not_found' }, 404);

  return c.json({
    template: toTemplateDto(template),
    invitation: {
      id: row.id,
      config: row.config as InvitationData,
      activeUntil: row.activeUntil ? row.activeUntil.toISOString() : null,
    },
  });
});

publicRoutes.get('/preview/:token', async (c) => {
  const { token } = c.req.param();

  let payload;
  try {
    payload = await verifyPreviewToken(token);
  } catch {
    return c.json({ error: 'invalid_token' }, 401);
  }

  const claimed = await db
    .insert(consumedPreviewTokens)
    .values({
      jti: payload.jti,
      invitationId: payload.inv,
      expiresAt: new Date(payload.exp * 1000),
    })
    .onConflictDoNothing({ target: consumedPreviewTokens.jti })
    .returning();

  if (claimed.length === 0) {
    return c.json({ error: 'not_found' }, 404);
  }

  if (Math.random() < 0.01) {
    db.delete(consumedPreviewTokens)
      .where(lt(consumedPreviewTokens.expiresAt, new Date()))
      .catch(() => {});
  }

  const [row] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, payload.inv), isNull(invitations.deletedAt)));

  if (!row || row.userId !== payload.sub) {
    return c.json({ error: 'not_found' }, 404);
  }

  const [template] = await db.select().from(templates).where(eq(templates.id, row.templateId));
  if (!template) return c.json({ error: 'template_not_found' }, 404);

  return c.json({
    template: toTemplateDto(template),
    invitation: {
      id: row.id,
      config: row.config as InvitationData,
      activeUntil: row.activeUntil ? row.activeUntil.toISOString() : null,
    },
  });
});
