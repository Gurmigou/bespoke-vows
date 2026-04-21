import { Hono } from 'hono';
import { put } from '@vercel/blob';
import { requireAuth } from '../middleware/auth.js';
import type { JwtPayload } from '../lib/jwt.js';

type Variables = { user: JwtPayload };

const MAX_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const uploadRoutes = new Hono<{ Variables: Variables }>();

uploadRoutes.post('/', requireAuth, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) return c.json({ error: 'Missing file field' }, 400);
  if (!ALLOWED_TYPES.has(file.type)) return c.json({ error: 'Only JPEG, PNG, WebP allowed' }, 415);
  if (file.size > MAX_SIZE_BYTES) return c.json({ error: 'File exceeds 3MB limit' }, 413);

  const blob = await put(file.name, file, { access: 'public' });
  return c.json({ url: blob.url }, 201);
});
