import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { verifyJwt, type JwtPayload } from '../lib/jwt.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';

type Variables = { user: JwtPayload };

const DEV_EMAIL = 'dev@test.com';

async function getOrCreateDevUser(): Promise<JwtPayload> {
  const [user] = await db
    .insert(users)
    .values({ googleId: `dev:${DEV_EMAIL}`, email: DEV_EMAIL, name: 'Dev User', avatarUrl: null })
    .onConflictDoUpdate({ target: users.googleId, set: { name: 'Dev User' } })
    .returning();
  return { sub: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl ?? null };
}

export const requireAuth = createMiddleware<{ Variables: Variables }>(async (c, next) => {
  const token = getCookie(c, 'session');

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      c.set('user', await getOrCreateDevUser());
      return next();
    }
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
