import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { verifyJwt, type JwtPayload } from '../lib/jwt.js';

type Variables = { user: JwtPayload };

export const requireAuth = createMiddleware<{ Variables: Variables }>(async (c, next) => {
  const token = getCookie(c, 'session');

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const user = await verifyJwt(token);
    c.set('user', user);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});
