import { describe, it, expect } from 'vitest';
import { request, createUser, createTemplate, createInvitation } from '../helpers.js';
import { signPreviewToken, signJwt } from '../../src/lib/jwt.js';

describe('GET /i/:id', () => {
  it('200 when active + visible', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      status: 'active',
      activeUntil: new Date(Date.now() + 60_000),
    });
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.template).toBeDefined();
    expect(body.invitation.id).toBe(inv.id);
  });

  it('410 when draft', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(410);
  });

  it('410 when expired', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      status: 'active',
      activeUntil: new Date(Date.now() - 60_000),
    });
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(410);
  });

  it('410 when hidden', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      status: 'active',
      activeUntil: new Date(Date.now() + 60_000),
      visible: false,
    });
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(410);
  });

  it('404 when soft-deleted', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, {
      status: 'active',
      activeUntil: new Date(Date.now() + 60_000),
      deletedAt: new Date(),
    });
    const res = await request(`/i/${inv.id}`);
    expect(res.status).toBe(404);
  });

  it('404 when unknown id', async () => {
    const res = await request('/i/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});

describe('GET /preview/:token', () => {
  it('200 with valid token (even on draft)', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);
    const token = await signPreviewToken({ invitationId: inv.id, ownerId: u.id });
    const res = await request(`/preview/${token}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.invitation.id).toBe(inv.id);
  });

  it('401 on bad signature', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id);
    const token = await signPreviewToken({ invitationId: inv.id, ownerId: u.id });
    const tampered = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A');
    const res = await request(`/preview/${tampered}`);
    expect(res.status).toBe(401);
  });

  it('401 on session token (wrong kind)', async () => {
    const u = await createUser();
    const sessionToken = await signJwt({ sub: u.id, email: u.email });
    const res = await request(`/preview/${sessionToken}`);
    expect(res.status).toBe(401);
  });

  it('404 when invitation deleted after minting', async () => {
    const u = await createUser();
    const t = await createTemplate();
    const inv = await createInvitation(u.id, t.id, { deletedAt: new Date() });
    const token = await signPreviewToken({ invitationId: inv.id, ownerId: u.id });
    const res = await request(`/preview/${token}`);
    expect(res.status).toBe(404);
  });
});
