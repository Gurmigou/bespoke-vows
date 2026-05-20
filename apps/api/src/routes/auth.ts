import { Hono } from 'hono';
import type { Context } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, invitations, payments, passwordResetTokens } from '../db/schema.js';
import { signJwt } from '../lib/jwt.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { toUserDto } from '../lib/serialize.js';
import { requireAuth } from '../middleware/auth.js';
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from '../lib/passwordReset.js';

export const authRoutes = new Hono();

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function setSession(c: Context, token: string) {
  const isProd = process.env.NODE_ENV !== 'development';
  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: isProd ? 'None' : 'Lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
    secure: isProd,
  });
}

authRoutes.post('/register', async (c) => {
  const body = await c.req
    .json<{ email?: string; password?: string }>()
    .catch(() => ({} as { email?: string; password?: string }));
  if (!body.email || !body.password) {
    return c.json({ error: 'email_and_password_required' }, 400);
  }
  if (body.password.length < 8) {
    return c.json({ error: 'password_too_short' }, 400);
  }

  const existing = await db.select().from(users).where(eq(users.email, body.email));
  if (existing.length > 0) {
    return c.json({ error: 'email_in_use' }, 409);
  }

  const passwordHash = await hashPassword(body.password);
  const [user] = await db
    .insert(users)
    .values({ email: body.email, passwordHash })
    .returning();

  const token = await signJwt({ sub: user.id, email: user.email });
  setSession(c, token);

  return c.json(toUserDto(user), 201);
});

authRoutes.post('/login', async (c) => {
  const body = await c.req
    .json<{ email?: string; password?: string }>()
    .catch(() => ({} as { email?: string; password?: string }));
  if (!body.email || !body.password) {
    return c.json({ error: 'email_and_password_required' }, 400);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, body.email), isNull(users.deletedAt)));
  if (!user) {
    return c.json({ error: 'invalid_credentials' }, 401);
  }

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) {
    return c.json({ error: 'invalid_credentials' }, 401);
  }

  const token = await signJwt({ sub: user.id, email: user.email });
  setSession(c, token);

  return c.json(toUserDto(user));
});

authRoutes.post('/logout', (c) => {
  deleteCookie(c, 'session', { path: '/' });
  return c.json({ ok: true });
});

authRoutes.get('/me', requireAuth, async (c) => {
  const payload = c.get('user');
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, payload.sub), isNull(users.deletedAt)));
  if (!user) return c.json({ error: 'user_not_found' }, 404);
  return c.json(toUserDto(user));
});

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

authRoutes.post('/forgot-password', async (c) => {
  const body = await c.req
    .json<{ email?: string }>()
    .catch(() => ({} as { email?: string }));
  if (!body.email || !isValidEmail(body.email)) {
    return c.json({ error: 'email_required' }, 400);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, body.email), isNull(users.deletedAt)));

  if (user) {
    const { raw, hash } = generateResetToken();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash: hash,
      expiresAt,
    });
    const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:8080';
    const link = `${webOrigin}/reset-password?token=${raw}`;
    console.log('[password-reset] link change password that have to be sent to email to console temporary:', link);
  }

  return c.json({ ok: true });
});

authRoutes.post('/reset-password', async (c) => {
  const body = await c.req
    .json<{ token?: string; password?: string }>()
    .catch(() => ({} as { token?: string; password?: string }));
  if (!body.token || !body.password) {
    return c.json({ error: 'token_and_password_required' }, 400);
  }
  if (body.password.length < 8) {
    return c.json({ error: 'password_too_short' }, 400);
  }

  const tokenHash = hashResetToken(body.token);
  const [tokenRow] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.tokenHash, tokenHash));

  if (!tokenRow || tokenRow.usedAt || tokenRow.expiresAt.getTime() < Date.now()) {
    return c.json({ error: 'invalid_or_expired_token' }, 400);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, tokenRow.userId), isNull(users.deletedAt)));
  if (!user) {
    return c.json({ error: 'invalid_or_expired_token' }, 400);
  }

  const newHash = await hashPassword(body.password);
  const now = new Date();
  await db
    .update(users)
    .set({ passwordHash: newHash, updatedAt: now })
    .where(eq(users.id, user.id));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: now })
    .where(and(eq(passwordResetTokens.userId, user.id), isNull(passwordResetTokens.usedAt)));

  return c.json({ ok: true });
});

authRoutes.delete('/account', requireAuth, async (c) => {
  const payload = c.get('user');
  await db.delete(payments).where(eq(payments.userId, payload.sub));
  await db.delete(invitations).where(eq(invitations.userId, payload.sub));
  await db.delete(users).where(eq(users.id, payload.sub));
  deleteCookie(c, 'session', { path: '/' });
  return c.json({ ok: true });
});
