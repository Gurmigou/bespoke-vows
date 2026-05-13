import { describe, it, expect } from 'vitest';
import { request, createUser, sessionFor, createTemplate, createInvitation, createPayment } from '../helpers.js';
import { db } from '../../src/db/index.js';
import { users, invitations, payments } from '../../src/db/schema.js';
import { eq } from 'drizzle-orm';

describe('POST /auth/register', () => {
  it('creates a user, sets cookie, returns DTO', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'new@test.com', password: 'password123' }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.email).toBe('new@test.com');
    expect(body).not.toHaveProperty('passwordHash');
    expect(res.headers.get('set-cookie')).toMatch(/session=/);
  });

  it('400 when password too short', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'new@test.com', password: 'short' }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('password_too_short');
  });

  it('400 when missing fields', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('409 on duplicate email', async () => {
    await createUser({ email: 'dup@test.com' });
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dup@test.com', password: 'password123' }),
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /auth/login', () => {
  it('logs in with valid credentials', async () => {
    await createUser({ email: 'l@test.com', password: 'password123' });
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'l@test.com', password: 'password123' }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toMatch(/session=/);
  });

  it('401 on wrong password', async () => {
    await createUser({ email: 'l@test.com', password: 'password123' });
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'l@test.com', password: 'wrong' }),
    });
    expect(res.status).toBe(401);
  });

  it('401 on unknown email', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@test.com', password: 'password123' }),
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /auth/me', () => {
  it('401 without cookie', async () => {
    const res = await request('/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns DTO with cookie', async () => {
    const u = await createUser({ email: 'me@test.com' });
    const res = await request('/auth/me', { cookie: await sessionFor(u.id, u.email) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.email).toBe('me@test.com');
    expect(body).not.toHaveProperty('passwordHash');
  });
});

describe('POST /auth/logout', () => {
  it('clears the cookie', async () => {
    const res = await request('/auth/logout', { method: 'POST' });
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toMatch(/session=;/);
  });
});

describe('DELETE /auth/account', () => {
  it('hard-deletes user, invitations, and payments', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);
    await createPayment(u.id, inv.id);

    const res = await request('/auth/account', {
      method: 'DELETE',
      cookie: await sessionFor(u.id, u.email),
    });
    expect(res.status).toBe(200);

    expect(await db.select().from(users).where(eq(users.id, u.id))).toHaveLength(0);
    expect(await db.select().from(invitations).where(eq(invitations.userId, u.id))).toHaveLength(0);
    expect(await db.select().from(payments).where(eq(payments.userId, u.id))).toHaveLength(0);
  });

  it('401 without cookie', async () => {
    const res = await request('/auth/account', { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('removed Google routes', () => {
  it('GET /auth/google → 404', async () => {
    const res = await request('/auth/google');
    expect(res.status).toBe(404);
  });
});
