import app from '../src/app.js';
import { signJwt } from '../src/lib/jwt.js';
import { hashPassword } from '../src/lib/password.js';
import { db } from '../src/db/index.js';
import { users, templates, invitations, payments } from '../src/db/schema.js';
import type { InvitationData, TemplateDefinition } from '@bespoke-vows/shared';

let seq = 0;

const blankConfig = (): InvitationData => ({
  hisName: '',
  herName: '',
  weddingDate: '',
  weddingPlace: '',
  venue: { label: '', mapsUrl: '' },
  loveStory: { moments: [] },
  events: [],
  weddingColors: [],
  templateColors: { primary: '#000000', text: '#000000', accent: '#000000' },
});

const fakeDefinition = (slug: string): TemplateDefinition => ({
  id: slug,
  name: `Template ${slug}`,
  description: `desc ${slug}`,
  defaultColors: { primary: '#000', text: '#000', accent: '#000' },
  thumbnail: { bg: '#fff', text: '#000', accent: '#000', swatch1: '#1', swatch2: '#2', swatch3: '#3', fontClass: 'f', headerText: 'h', fontFaces: '' },
  theme: { fontImports: '', background: '#fff', surface: '#eee', displayFont: 'serif', bodyFont: 'sans' },
  sections: [],
});

export async function createUser(overrides: Partial<typeof users.$inferInsert> & { password?: string } = {}) {
  seq++;
  const password = overrides.password ?? 'password123';
  const passwordHash = overrides.passwordHash ?? (await hashPassword(password));
  const [u] = await db
    .insert(users)
    .values({
      email: overrides.email ?? `user-${Date.now()}-${seq}@test.com`,
      passwordHash,
    })
    .returning();
  return u;
}

export async function createTemplate(overrides: Partial<typeof templates.$inferInsert> = {}) {
  seq++;
  const slug = (overrides.slug as string | undefined) ?? `tpl-${seq}`;
  const [t] = await db
    .insert(templates)
    .values({
      slug,
      name: (overrides.name as string | undefined) ?? `Template ${slug}`,
      description: (overrides.description as string | undefined) ?? `desc`,
      definition: overrides.definition ?? fakeDefinition(slug),
      defaultData: overrides.defaultData ?? blankConfig(),
    })
    .returning();
  return t;
}

export async function sessionFor(userId: string, email = 'a@test.com') {
  const token = await signJwt({ sub: userId, email });
  return `session=${token}`;
}

export async function createInvitation(
  userId: string,
  templateId: string,
  overrides: Partial<typeof invitations.$inferInsert> = {}
) {
  const [inv] = await db
    .insert(invitations)
    .values({
      userId,
      templateId,
      config: overrides.config ?? blankConfig(),
      ...overrides,
    })
    .returning();
  return inv;
}

export async function createPayment(
  userId: string,
  invitationId: string,
  overrides: Partial<typeof payments.$inferInsert> = {}
) {
  const [p] = await db
    .insert(payments)
    .values({
      userId,
      invitationId,
      amount: 999,
      currency: 'USD',
      provider: 'plata_mock',
      status: 'succeeded',
      ...overrides,
    })
    .returning();
  return p;
}

export type ReqInit = RequestInit & { cookie?: string };

export async function request(path: string, init: ReqInit = {}) {
  const headers = new Headers(init.headers);
  if (init.cookie) headers.set('Cookie', init.cookie);
  return app.request(path, { ...init, headers });
}

export const INVALID_COOKIE = 'session=not.a.valid.jwt';
export { blankConfig };
