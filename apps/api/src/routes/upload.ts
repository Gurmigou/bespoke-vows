import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { storage, isLocalStorage } from '../lib/storage.js';
import type { JwtPayload } from '../lib/jwt.js';

type Variables = { user: JwtPayload };

const MAX_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Detect real image type from leading bytes (magic numbers); ignores the spoofable Content-Type header. */
function sniffImageType(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x45 && // E
    bytes[10] === 0x42 && // B
    bytes[11] === 0x50 // P
  ) {
    return 'image/webp';
  }
  return null;
}

export const uploadRoutes = new Hono<{ Variables: Variables }>();

uploadRoutes.post(
  '/',
  requireAuth,
  rateLimit({ name: 'upload', limit: 30, window: '1 h' }),
  async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) return c.json({ error: 'Missing file field' }, 400);
  if (!ALLOWED_TYPES.has(file.type)) return c.json({ error: 'Only JPEG, PNG, WebP allowed' }, 415);
  if (file.size > MAX_SIZE_BYTES) return c.json({ error: 'File exceeds 3MB limit' }, 413);

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const sniffed = sniffImageType(header);
  if (!sniffed || !ALLOWED_TYPES.has(sniffed)) {
    return c.json({ error: 'File content is not a valid JPEG, PNG, or WebP image' }, 415);
  }

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
