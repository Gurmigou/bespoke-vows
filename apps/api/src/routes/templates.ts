import { Hono } from 'hono';
import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../db/index.js';
import { templates } from '../db/schema.js';
import { toTemplateDto } from '../lib/serialize.js';

export const templateRoutes = new Hono();

templateRoutes.get('/', async (c) => {
  const rows = await db.select().from(templates).where(isNull(templates.deletedAt));
  return c.json(rows.map(toTemplateDto));
});

templateRoutes.get('/:slug', async (c) => {
  const { slug } = c.req.param();
  const [row] = await db
    .select()
    .from(templates)
    .where(and(eq(templates.slug, slug), isNull(templates.deletedAt)));
  if (!row) return c.json({ error: 'not_found' }, 404);
  return c.json(toTemplateDto(row));
});
