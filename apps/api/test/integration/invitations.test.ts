import { describe, it, expect } from 'vitest';
import {
  request,
  createUser,
  sessionFor,
  createTemplate,
  createInvitation,
} from '../helpers.js';
import { db } from '../../src/db/index.js';
import { invitations, payments } from '../../src/db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyPreviewToken } from '../../src/lib/jwt.js';

describe('POST /invitations', () => {
  it('401 without auth', async () => {
    const res = await request('/invitations', { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('400 when templateId missing', async () => {
    const u = await createUser();
    const res = await request('/invitations', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('400 when template not found', async () => {
    const u = await createUser();
    const res = await request('/invitations', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'unknown' }),
    });
    expect(res.status).toBe(400);
  });

  it('creates a draft invitation by slug', async () => {
    const u = await createUser();
    const t = await createTemplate({ slug: 'classic' });
    const res = await request('/invitations', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'classic' }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.status).toBe('draft');
    expect(body.paymentStatus).toBe('free');
    expect(body.derivedStatus).toBe('draft');
    expect(body.visible).toBe(true);
    expect(body.freeTrialUsedAt).toBeNull();
    expect(body.templateId).toBe(t.id);
    expect(body.templateSlug).toBe('classic');
  });

  it('creates by uuid', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const res = await request('/invitations', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: t.id }),
    });
    expect(res.status).toBe(201);
  });
});

describe('GET /invitations', () => {
  it('returns only own invitations', async () => {
    const u1 = await createUser();
    const u2 = await createUser();
    const t = await createTemplate();
    await createInvitation(u1.id, t.id);
    await createInvitation(u2.id, t.id);

    const res = await request('/invitations', { cookie: await sessionFor(u1.id, u1.email) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].userId).toBe(u1.id);
  });
});

describe('GET /invitations/:id', () => {
  it('404 on unknown id', async () => {
    const u = await createUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000', {
      cookie: await sessionFor(u.id, u.email),
    });
    expect(res.status).toBe(404);
  });

  it('404 on someone else’s invitation (no leak)', async () => {
    const u1 = await createUser();
    const u2 = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u2.id, t.id);
    const res = await request(`/invitations/${inv.id}`, {
      cookie: await sessionFor(u1.id, u1.email),
    });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /invitations/:id', () => {
  it('merges config partially', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, { config: { hisName: 'A', herName: 'B' } as never });

    const res = await request(`/invitations/${inv.id}`, {
      method: 'PATCH',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { hisName: 'X' } }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.config.hisName).toBe('X');
    expect(body.config.herName).toBe('B');
  });

  it('400 when config missing', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);
    const res = await request(`/invitations/${inv.id}`, {
      method: 'PATCH',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /invitations/:id/reset', () => {
  it('replaces config with template defaultData', async () => {
    const u = await createUser();
    const t = await createTemplate({
      defaultData: {
        hisName: 'DEFAULT_HIS',
        herName: '',
        weddingDate: '',
        weddingPlace: '',
        venue: { label: '', mapsUrl: '' },
        loveStory: { moments: [] },
        events: [],
        weddingColors: [],
        templateColors: { primary: '#000', text: '#000', accent: '#000' },
      } as never,
    });
    const inv = await createInvitation(u.id, t.id, { config: { hisName: 'CHANGED' } as never });

    const res = await request(`/invitations/${inv.id}/reset`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.config.hisName).toBe('DEFAULT_HIS');
  });
});

describe('POST /invitations/:id/publish', () => {
  it('first time activates with free trial (3 days)', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);

    const res = await request(`/invitations/${inv.id}/publish`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('active');
    expect(body.paymentStatus).toBe('free');
    expect(body.derivedStatus).toBe('active');
    expect(body.freeTrialUsedAt).not.toBeNull();
    const activeUntil = new Date(body.activeUntil).getTime();
    const expected = Date.now() + 3 * 24 * 60 * 60 * 1000;
    expect(Math.abs(activeUntil - expected)).toBeLessThan(5000);
  });

  it('409 when already active', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      status: 'active',
      activeUntil: new Date(Date.now() + 60_000),
      freeTrialUsedAt: new Date(),
    });
    const res = await request(`/invitations/${inv.id}/publish`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
    });
    expect(res.status).toBe(409);
  });

  it('402 payment_required when trial used and expired', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      status: 'active',
      activeUntil: new Date(Date.now() - 60_000),
      freeTrialUsedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });
    const res = await request(`/invitations/${inv.id}/publish`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
    });
    expect(res.status).toBe(402);
  });
});

describe('POST /invitations/:id/pay', () => {
  it('inserts payment, activates for 1 year, sets payment_id', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      freeTrialUsedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    const res = await request(`/invitations/${inv.id}/pay`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('active');
    expect(body.paymentStatus).toBe('paid');
    expect(body.paymentId).toBeTruthy();
    const activeUntil = new Date(body.activeUntil).getTime();
    const expected = Date.now() + 365 * 24 * 60 * 60 * 1000;
    expect(Math.abs(activeUntil - expected)).toBeLessThan(5000);

    const rows = await db.select().from(payments).where(eq(payments.invitationId, inv.id));
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(body.paymentId);
  });

  it('401 without auth', async () => {
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000/pay', { method: 'POST' });
    expect(res.status).toBe(401);
  });
});

describe('POST /invitations/:id/hide', () => {
  it('409 when not active', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);
    const res = await request(`/invitations/${inv.id}/hide`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: false }),
    });
    expect(res.status).toBe(409);
  });

  it('flips visible and stamps timestamp when active', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      status: 'active',
      activeUntil: new Date(Date.now() + 60_000),
    });
    const res = await request(`/invitations/${inv.id}/hide`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: false }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.visible).toBe(false);
    expect(body.visibleStatusChangedAt).not.toBeNull();
  });
});

describe('DELETE /invitations/:id', () => {
  it('soft-deletes; subsequent GET 404', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);
    const cookie = await sessionFor(u.id, u.email);

    const del = await request(`/invitations/${inv.id}`, { method: 'DELETE', cookie });
    expect(del.status).toBe(200);

    const get = await request(`/invitations/${inv.id}`, { cookie });
    expect(get.status).toBe(404);

    const [row] = await db.select().from(invitations).where(eq(invitations.id, inv.id));
    expect(row.deletedAt).not.toBeNull();
  });
});

describe('POST /invitations/:id/preview-token', () => {
  it('mints a 15-min preview JWT', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);

    const res = await request(`/invitations/${inv.id}/preview-token`, {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
    });
    expect(res.status).toBe(200);
    const { token } = await res.json();

    const payload = await verifyPreviewToken(token);
    expect(payload.kind).toBe('preview');
    expect(payload.inv).toBe(inv.id);
    expect(payload.sub).toBe(u.id);
  });
});
