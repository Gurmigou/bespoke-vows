import { Hono } from 'hono';
import type { Context } from 'hono';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { eq, and, isNull } from 'drizzle-orm';
import { Google, decodeIdToken } from 'arctic';
import { db } from '../db/index.js';
import { users, invitations, payments, passwordResetTokens } from '../db/schema.js';
import { signJwt } from '../lib/jwt.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { toUserDto } from '../lib/serialize.js';
import { requireAuth } from '../middleware/auth.js';
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from '../lib/passwordReset.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../lib/email.js';

export const authRoutes = new Hono();

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!,
);

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
  if (!user || !user.passwordHash) {
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
    try {
      await sendPasswordResetEmail(user.email, link);
    } catch (err) {
      console.error('[email] password reset failed:', err);
    }
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

authRoutes.get('/google', async (c) => {
  const state = crypto.randomUUID();
  const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
  const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile']);

  const isProd = process.env.NODE_ENV !== 'development';
  const cookieOpts = {
    httpOnly: true,
    sameSite: isProd ? ('None' as const) : ('Lax' as const),
    secure: isProd,
    path: '/',
    maxAge: 600,
  };
  setCookie(c, 'google_oauth_state', state, cookieOpts);
  setCookie(c, 'google_code_verifier', codeVerifier, cookieOpts);

  return c.redirect(url.toString());
});

authRoutes.get('/google/callback', async (c) => {
  const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:8080';
  const { code, state } = c.req.query();
  const storedState = getCookie(c, 'google_oauth_state');
  const codeVerifier = getCookie(c, 'google_code_verifier');

  if (!code || !state || state !== storedState || !codeVerifier) {
    return c.redirect(`${webOrigin}/login?error=oauth_invalid`);
  }

  let email: string;
  let googleId: string;

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const idToken = tokens.idToken();
    const claims = decodeIdToken(idToken) as Record<string, string>;
    googleId = claims['sub'];
    email = claims['email'];
  } catch {
    return c.redirect(`${webOrigin}/login?error=oauth_failed`);
  }

  if (!email || !googleId) {
    return c.redirect(`${webOrigin}/login?error=oauth_no_email`);
  }

  let [user] = await db.select().from(users).where(eq(users.googleId, googleId));

  if (!user) {
    const [byEmail] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)));

    if (byEmail) {
      [user] = await db
        .update(users)
        .set({ googleId, updatedAt: new Date() })
        .where(eq(users.id, byEmail.id))
        .returning();
    } else {
      [user] = await db
        .insert(users)
        .values({ email, googleId, passwordHash: null })
        .returning();
      try {
        await sendWelcomeEmail(user.email);
      } catch (err) {
        console.error('[email] welcome failed:', err);
      }
    }
  }

  if (user.deletedAt) {
    return c.redirect(`${webOrigin}/login?error=account_deleted`);
  }

  const token = await signJwt({ sub: user.id, email: user.email });
  setSession(c, token);

  return c.redirect(webOrigin);
});

authRoutes.delete('/account', requireAuth, async (c) => {
  const payload = c.get('user');
  await db.delete(payments).where(eq(payments.userId, payload.sub));
  await db.delete(invitations).where(eq(invitations.userId, payload.sub));
  await db.delete(users).where(eq(users.id, payload.sub));
  deleteCookie(c, 'session', { path: '/' });
  return c.json({ ok: true });
});
