import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { request, sessionFor, createUser, createInvitation, INVALID_COOKIE } from './helpers.js';

const json = { 'Content-Type': 'application/json' };

async function authedUser() {
  const u = await createUser();
  const cookie = await sessionFor(u.id);
  return { user: u, cookie };
}

describe('POST /invitations', () => {
  it('returns 401 with invalid token', async () => {
    const res = await request('/invitations', {
      method: 'POST',
      headers: json,
      cookie: INVALID_COOKIE,
      body: JSON.stringify({ templateId: 'classic' }),
    });
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid templateId', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations', {
      method: 'POST',
      headers: json,
      cookie,
      body: JSON.stringify({ templateId: 'bogus' }),
    });
    expect(res.status).toBe(400);
  });

  it('creates an invitation', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations', {
      method: 'POST',
      headers: json,
      cookie,
      body: JSON.stringify({ templateId: 'modern', config: { hisName: 'A' } }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.templateId).toBe('modern');
    expect(body.derivedStatus).toBe('draft');
  });

  it('returns 403 when free invitation limit reached', async () => {
    const { user, cookie } = await authedUser();
    for (let i = 0; i < 3; i++) await createInvitation(user.id);
    const res = await request('/invitations', {
      method: 'POST',
      headers: json,
      cookie,
      body: JSON.stringify({ templateId: 'classic' }),
    });
    expect(res.status).toBe(403);
  });
});

describe('GET /invitations', () => {
  it('returns own invitations excluding trashed', async () => {
    const { user, cookie } = await authedUser();
    await createInvitation(user.id);
    await createInvitation(user.id, { deletedAt: new Date() });

    const res = await request('/invitations', { cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
  });
});

describe('GET /invitations/trash', () => {
  it('returns only trashed invitations', async () => {
    const { user, cookie } = await authedUser();
    await createInvitation(user.id);
    await createInvitation(user.id, { deletedAt: new Date() });

    const res = await request('/invitations/trash', { cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].deletedAt).not.toBeNull();
  });
});

describe('GET /invitations/:id', () => {
  it('returns 404 for unknown id', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000', { cookie });
    expect(res.status).toBe(404);
  });

  it('returns 403 when not owner', async () => {
    const owner = await createUser();
    const inv = await createInvitation(owner.id);
    const other = await createUser();
    const cookie = await sessionFor(other.id);

    const res = await request(`/invitations/${inv.id}`, { cookie });
    expect(res.status).toBe(403);
  });

  it('returns the invitation when owner', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}`, { cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(inv.id);
  });
});

describe('PATCH /invitations/:id', () => {
  it('returns 400 when config is missing', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}`, {
      method: 'PATCH',
      headers: json,
      cookie,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown id', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000', {
      method: 'PATCH',
      headers: json,
      cookie,
      body: JSON.stringify({ config: {} }),
    });
    expect(res.status).toBe(404);
  });

  it('returns 403 when not owner', async () => {
    const owner = await createUser();
    const inv = await createInvitation(owner.id);
    const other = await createUser();
    const cookie = await sessionFor(other.id);

    const res = await request(`/invitations/${inv.id}`, {
      method: 'PATCH',
      headers: json,
      cookie,
      body: JSON.stringify({ config: {} }),
    });
    expect(res.status).toBe(403);
  });

  it('updates the config', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}`, {
      method: 'PATCH',
      headers: json,
      cookie,
      body: JSON.stringify({ config: { hisName: 'Ivan' } }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.config.hisName).toBe('Ivan');
  });
});

describe('DELETE /invitations/:id', () => {
  it('returns 404 for unknown id', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000', {
      method: 'DELETE',
      cookie,
    });
    expect(res.status).toBe(404);
  });

  it('returns 403 when not owner', async () => {
    const owner = await createUser();
    const inv = await createInvitation(owner.id);
    const other = await createUser();
    const cookie = await sessionFor(other.id);
    const res = await request(`/invitations/${inv.id}`, { method: 'DELETE', cookie });
    expect(res.status).toBe(403);
  });

  it('hard-deletes an unpaid invitation', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}`, { method: 'DELETE', cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it('moves a paid invitation to trash', async () => {
    const { user, cookie } = await authedUser();
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const inv = await createInvitation(user.id, { paidUntil: future });
    const res = await request(`/invitations/${inv.id}`, { method: 'DELETE', cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.moved_to_trash).toBe(true);
    expect(body.invitation.deletedAt).not.toBeNull();
  });

  it('returns 409 when already in trash', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id, { deletedAt: new Date() });
    const res = await request(`/invitations/${inv.id}`, { method: 'DELETE', cookie });
    expect(res.status).toBe(409);
  });
});

describe('DELETE /invitations/:id/permanent', () => {
  it('returns 409 when not in trash', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}/permanent`, { method: 'DELETE', cookie });
    expect(res.status).toBe(409);
  });

  it('returns 403 when not owner', async () => {
    const owner = await createUser();
    const inv = await createInvitation(owner.id, { deletedAt: new Date() });
    const other = await createUser();
    const cookie = await sessionFor(other.id);
    const res = await request(`/invitations/${inv.id}/permanent`, { method: 'DELETE', cookie });
    expect(res.status).toBe(403);
  });

  it('returns 404 for unknown id', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000/permanent', {
      method: 'DELETE',
      cookie,
    });
    expect(res.status).toBe(404);
  });

  it('hard-deletes a trashed invitation', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id, { deletedAt: new Date() });
    const res = await request(`/invitations/${inv.id}/permanent`, { method: 'DELETE', cookie });
    expect(res.status).toBe(200);
  });
});

describe('POST /invitations/:id/restore', () => {
  it('returns 409 when not in trash', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}/restore`, { method: 'POST', cookie });
    expect(res.status).toBe(409);
  });

  it('returns 403 when not owner', async () => {
    const owner = await createUser();
    const inv = await createInvitation(owner.id, { deletedAt: new Date() });
    const other = await createUser();
    const cookie = await sessionFor(other.id);
    const res = await request(`/invitations/${inv.id}/restore`, { method: 'POST', cookie });
    expect(res.status).toBe(403);
  });

  it('returns 404 for unknown id', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000/restore', {
      method: 'POST',
      cookie,
    });
    expect(res.status).toBe(404);
  });

  it('restores a trashed invitation', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id, { deletedAt: new Date() });
    const res = await request(`/invitations/${inv.id}/restore`, { method: 'POST', cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.deletedAt).toBeNull();
  });
});

describe('POST /invitations/:id/hide', () => {
  it('returns 404 for unknown id', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000/hide', {
      method: 'POST',
      cookie,
    });
    expect(res.status).toBe(404);
  });

  it('returns 403 when not owner', async () => {
    const owner = await createUser();
    const inv = await createInvitation(owner.id);
    const other = await createUser();
    const cookie = await sessionFor(other.id);
    const res = await request(`/invitations/${inv.id}/hide`, { method: 'POST', cookie });
    expect(res.status).toBe(403);
  });

  it('toggles the hidden flag', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);

    const res1 = await request(`/invitations/${inv.id}/hide`, { method: 'POST', cookie });
    expect(res1.status).toBe(200);
    expect((await res1.json()).hidden).toBe(true);

    const res2 = await request(`/invitations/${inv.id}/hide`, { method: 'POST', cookie });
    expect((await res2.json()).hidden).toBe(false);
  });
});

describe('POST /invitations/:id/publish', () => {
  it('returns 404 for unknown id', async () => {
    const { cookie } = await authedUser();
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000/publish', {
      method: 'POST',
      cookie,
    });
    expect(res.status).toBe(404);
  });

  it('returns 403 when not owner', async () => {
    const owner = await createUser();
    const inv = await createInvitation(owner.id);
    const other = await createUser();
    const cookie = await sessionFor(other.id);
    const res = await request(`/invitations/${inv.id}/publish`, { method: 'POST', cookie });
    expect(res.status).toBe(403);
  });

  it('publishes a draft invitation', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}/publish`, { method: 'POST', cookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.derivedStatus).toBe('active_free');
    expect(body.freeActiveDaysUsed).toBe(1);
  });

  it('returns 409 when already active_free', async () => {
    const { user, cookie } = await authedUser();
    const now = new Date();
    const inv = await createInvitation(user.id, {
      lastPublishedAt: now,
      publishedAt: now,
      freeActiveDaysUsed: 1,
    });
    const res = await request(`/invitations/${inv.id}/publish`, { method: 'POST', cookie });
    expect(res.status).toBe(409);
  });

  it('returns 403 when free days are exhausted', async () => {
    const { user, cookie } = await authedUser();
    const inv = await createInvitation(user.id, { freeActiveDaysUsed: 7 });
    const res = await request(`/invitations/${inv.id}/publish`, { method: 'POST', cookie });
    expect(res.status).toBe(403);
  });
});

describe('POST /invitations/:id/pay', () => {
  function sign(body: string) {
    return createHmac('sha512', process.env.MONO_WEBHOOK_SECRET!).update(body).digest('hex');
  }

  it('returns 401 with invalid signature', async () => {
    const user = await createUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/invitations/${inv.id}/pay`, {
      method: 'POST',
      headers: { 'x-sign': 'bad' },
      body: '{}',
    });
    expect(res.status).toBe(401);
  });

  it('returns 404 for unknown id with valid signature', async () => {
    const body = '{"foo":"bar"}';
    const res = await request('/invitations/00000000-0000-0000-0000-000000000000/pay', {
      method: 'POST',
      headers: { 'x-sign': sign(body) },
      body,
    });
    expect(res.status).toBe(404);
  });

  it('marks the invitation as paid', async () => {
    const user = await createUser();
    const inv = await createInvitation(user.id);
    const body = '{"event":"paid"}';
    const res = await request(`/invitations/${inv.id}/pay`, {
      method: 'POST',
      headers: { 'x-sign': sign(body) },
      body,
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.paidUntil).not.toBeNull();
    expect(data.derivedStatus).toBe('active_paid');
  });
});

describe('GET /i/:id (public)', () => {
  it('returns 404 for unknown id', async () => {
    const res = await request('/i/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });

  it('returns 410 for draft invitations', async () => {
    const user = await createUser();
    const inv = await createInvitation(user.id);
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(410);
  });

  it('returns 410 when hidden', async () => {
    const user = await createUser();
    const inv = await createInvitation(user.id, { hidden: true });
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(410);
  });

  it('returns 410 when deleted', async () => {
    const user = await createUser();
    const inv = await createInvitation(user.id, { deletedAt: new Date() });
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(410);
  });

  it('returns the invitation when active', async () => {
    const user = await createUser();
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const inv = await createInvitation(user.id, { paidUntil: future });
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(inv.id);
    expect(body.derivedStatus).toBe('active_paid');
  });
});
