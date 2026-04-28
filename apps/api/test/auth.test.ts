import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { request, sessionFor, createUser, INVALID_COOKIE } from './helpers.js';
import { db } from '../src/db/index.js';
import { users } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

describe('GET /auth/google', () => {
  it('redirects to Google OAuth', async () => {
    const res = await request('/auth/google', { redirect: 'manual' });
    expect(res.status).toBe(302);
    const loc = res.headers.get('location') ?? '';
    expect(loc).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(loc).toContain('client_id=test-google-client-id');
  });
});

describe('GET /auth/google/callback', () => {
  const realFetch = global.fetch;
  afterEach(() => {
    global.fetch = realFetch;
    vi.restoreAllMocks();
  });

  it('returns 400 when code is missing', async () => {
    const res = await request('/auth/google/callback');
    expect(res.status).toBe(400);
  });

  it('returns 400 when token exchange fails', async () => {
    global.fetch = vi.fn(async () => new Response('bad', { status: 400 })) as typeof fetch;
    const res = await request('/auth/google/callback?code=abc');
    expect(res.status).toBe(400);
  });

  it('creates user, sets cookie, and redirects on success', async () => {
    const calls: string[] = [];
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      calls.push(url);
      if (url.includes('token')) {
        return new Response(JSON.stringify({ access_token: 'token123' }), { status: 200 });
      }
      return new Response(
        JSON.stringify({ id: 'g-1', email: 'g@test.com', name: 'G User', picture: 'http://pic' }),
        { status: 200 }
      );
    }) as typeof fetch;

    const res = await request('/auth/google/callback?code=abc', { redirect: 'manual' });
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('http://localhost:8080');
    expect(res.headers.get('set-cookie')).toMatch(/session=/);

    const [u] = await db.select().from(users).where(eq(users.email, 'g@test.com'));
    expect(u).toBeDefined();
    expect(u.googleId).toBe('g-1');
  });
});

describe('POST /auth/dev-login', () => {
  it('returns 400 when email/name missing', async () => {
    const res = await request('/auth/dev-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('creates a user and sets a session cookie', async () => {
    const res = await request('/auth/dev-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dev1@test.com', name: 'Dev1' }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toMatch(/session=/);
    const body = await res.json();
    expect(body.email).toBe('dev1@test.com');
  });

  it('returns 404 when NODE_ENV is not development', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const res = await request('/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'x@test.com', name: 'X' }),
      });
      expect(res.status).toBe(404);
    } finally {
      process.env.NODE_ENV = original;
    }
  });
});

describe('POST /auth/logout', () => {
  it('clears the session cookie', async () => {
    const res = await request('/auth/logout', { method: 'POST' });
    expect(res.status).toBe(200);
    const cookie = res.headers.get('set-cookie') ?? '';
    expect(cookie).toMatch(/session=/);
    expect(cookie.toLowerCase()).toMatch(/max-age=0|expires=/);
  });
});

describe('DELETE /auth/account', () => {
  it('returns 401 without a session cookie', async () => {
    const res = await request('/auth/account', { method: 'DELETE' });
    expect(res.status).toBe(401);
  });

  it('returns 401 with an invalid token', async () => {
    const res = await request('/auth/account', { method: 'DELETE', cookie: INVALID_COOKIE });
    expect(res.status).toBe(401);
  });

  it('deletes the user with a valid session', async () => {
    const u = await createUser();
    const cookie = await sessionFor(u.id);
    const res = await request('/auth/account', { method: 'DELETE', cookie });
    expect(res.status).toBe(200);
    const remaining = await db.select().from(users).where(eq(users.id, u.id));
    expect(remaining).toHaveLength(0);
  });
});

describe('GET /auth/me', () => {
  it('returns 401 without a session', async () => {
    const res = await request('/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    const res = await request('/auth/me', { cookie: INVALID_COOKIE });
    expect(res.status).toBe(401);
  });

  it('returns 404 when user no longer exists', async () => {
    const cookie = await sessionFor('00000000-0000-0000-0000-000000000000');
    const res = await request('/auth/me', { cookie });
    expect(res.status).toBe(404);
  });

  it('returns the current user with valid session', async () => {
    const u = await createUser({ email: 'me@test.com', name: 'Me' });
    const cookie = await sessionFor(u.id, 'me@test.com', 'Me');
    const res = await request('/auth/me', { cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(u.id);
    expect(body.email).toBe('me@test.com');
  });
});

describe('POST /auth/register', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'x@test.com' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'x@test.com', name: 'X', password: 'short' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 409 when email already exists', async () => {
    await createUser({ email: 'dup@test.com' });
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dup@test.com', name: 'X', password: 'longenough1' }),
    });
    expect(res.status).toBe(409);
  });

  it('creates a new user and sets a session cookie', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'new@test.com', name: 'New', password: 'longenough1' }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toMatch(/session=/);
    const body = await res.json();
    expect(body.email).toBe('new@test.com');
  });
});

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'log@test.com', name: 'Log', password: 'longenough1' }),
    });
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'log@test.com' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unknown@test.com', password: 'longenough1' }),
    });
    expect(res.status).toBe(401);
  });

  it('returns 401 for wrong password', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'log@test.com', password: 'wrongpassword' }),
    });
    expect(res.status).toBe(401);
  });

  it('logs in successfully with valid credentials', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'log@test.com', password: 'longenough1' }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toMatch(/session=/);
  });
});
