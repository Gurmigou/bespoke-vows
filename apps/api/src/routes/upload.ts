import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import { storage, isLocalStorage } from '../lib/storage.js';
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

  const { url } = await storage.put(file);
  return c.json({ url }, 201);
});

export const uploadsServeRoutes = new Hono();

if (isLocalStorage) {
  uploadsServeRoutes.get('/:key', async (c) => {
    if (!storage.serve) return c.notFound();
    const result = await storage.serve(c.req.param('key'));
    if (!result) return c.notFound();
    return new Response(new Uint8Array(result.body), {
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  });
}
