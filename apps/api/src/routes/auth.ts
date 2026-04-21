import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { signJwt, verifyJwt } from '../lib/jwt.js';
import { eq } from 'drizzle-orm';

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

authRoutes.post('/logout', (c) => {
  deleteCookie(c, 'session', { path: '/' });
  return c.json({ ok: true });
});

authRoutes.get('/me', async (c) => {
  const token = getCookie(c, 'session');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const payload = await verifyJwt(token);
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub));
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});
