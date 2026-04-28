import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { signJwt, verifyJwt } from '../lib/jwt.js';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [hash, salt] = stored.split('.');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(hash, 'hex'), buf);
}

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export const authRoutes = new Hono();

authRoutes.get('/google', (c) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });
  return c.redirect(`${GOOGLE_AUTH_URL}?${params}`);
});

authRoutes.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.json({ error: 'Missing code' }, 400);

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) return c.json({ error: 'Token exchange failed' }, 400);
  const { access_token } = await tokenRes.json() as { access_token: string };

  const profileRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileRes.ok) return c.json({ error: 'Profile fetch failed' }, 400);

  const profile = await profileRes.json() as {
    id: string; email: string; name: string; picture: string;
  };

  const [user] = await db
    .insert(users)
    .values({
      googleId: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.picture,
    })
    .onConflictDoUpdate({
      target: users.googleId,
      set: { name: profile.name, avatarUrl: profile.picture },
    })
    .returning();

  const token = await signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
  });

  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV !== 'development',
  });

  return c.redirect(process.env.WEB_ORIGIN ?? 'http://localhost:8080');
});

authRoutes.post('/dev-login', async (c) => {
  if (process.env.NODE_ENV !== 'development') {
    return c.json({ error: 'Not found' }, 404);
  }

  const body = await c.req.json<{ email?: string; name?: string }>();
  if (!body.email || !body.name) {
    return c.json({ error: 'email and name are required' }, 400);
  }

  const [user] = await db
    .insert(users)
    .values({
      googleId: `dev:${body.email}`,
      email: body.email,
      name: body.name,
      avatarUrl: null,
    })
    .onConflictDoUpdate({
      target: users.googleId,
      set: { name: body.name },
    })
    .returning();

  const token = await signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
  });

  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: false,
  });

  return c.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
});

authRoutes.post('/logout', (c) => {
  deleteCookie(c, 'session', { path: '/' });
  return c.json({ ok: true });
});

authRoutes.delete('/account', async (c) => {
  const token = getCookie(c, 'session');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const payload = await verifyJwt(token);
    await db.delete(users).where(eq(users.id, payload.sub));
    deleteCookie(c, 'session', { path: '/' });
    return c.json({ ok: true });
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

authRoutes.get('/me', async (c) => {
  const token = getCookie(c, 'session');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const payload = await verifyJwt(token);
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub));
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, createdAt: user.createdAt.toISOString() });
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

authRoutes.post('/register', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string; name?: string }>();
  if (!body.email || !body.password || !body.name) {
    return c.json({ error: 'Email, password and name are required' }, 400);
  }
  if (body.password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  const existing = await db.select().from(users).where(eq(users.email, body.email));
  if (existing.length > 0) {
    return c.json({ error: 'Email already in use' }, 409);
  }

  const passwordHash = await hashPassword(body.password);
  const [user] = await db
    .insert(users)
    .values({ email: body.email, name: body.name, passwordHash })
    .returning();

  const token = await signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
  });

  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV !== 'development',
  });

  return c.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
});

authRoutes.post('/login', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();
  if (!body.email || !body.password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const [user] = await db.select().from(users).where(eq(users.email, body.email));
  if (!user || !user.passwordHash) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = await signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
  });

  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV !== 'development',
  });

  return c.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
});
