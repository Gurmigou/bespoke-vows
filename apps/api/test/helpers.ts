import app from '../src/app.js';
import { signJwt } from '../src/lib/jwt.js';
import { db } from '../src/db/index.js';
import { users, invitations } from '../src/db/schema.js';

let seq = 0;

export async function createUser(overrides: Partial<typeof users.$inferInsert> = {}) {
  seq++;
  const [u] = await db
    .insert(users)
    .values({
      email: overrides.email ?? `user-${Date.now()}-${seq}@test.com`,
      name: overrides.name ?? 'Test User',
      googleId: overrides.googleId ?? `google-${Date.now()}-${seq}`,
      ...overrides,
    })
    .returning();
  return u;
}

export async function sessionFor(userId: string, email = 'a@test.com', name = 'A') {
  const token = await signJwt({ sub: userId, email, name, avatarUrl: null });
  return `session=${token}`;
}

export async function createInvitation(
  userId: string,
  overrides: Partial<typeof invitations.$inferInsert> = {}
) {
  const [inv] = await db
    .insert(invitations)
    .values({
      userId,
      templateId: 'classic',
      config: {},
      ...overrides,
    })
    .returning();
  return inv;
}

export type ReqInit = RequestInit & { cookie?: string };

export async function request(path: string, init: ReqInit = {}) {
  const headers = new Headers(init.headers);
  if (init.cookie) headers.set('Cookie', init.cookie);
  return app.request(path, { ...init, headers });
}

export const INVALID_COOKIE = 'session=not.a.valid.jwt';
