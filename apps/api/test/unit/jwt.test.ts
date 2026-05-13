import { describe, it, expect } from 'vitest';
import { signJwt, verifyJwt, signPreviewToken, verifyPreviewToken } from '../../src/lib/jwt.js';

describe('session JWT', () => {
  it('round-trips sub and email', async () => {
    const t = await signJwt({ sub: 'u1', email: 'a@b.c' });
    const p = await verifyJwt(t);
    expect(p.sub).toBe('u1');
    expect(p.email).toBe('a@b.c');
  });

  it('rejects tampered token', async () => {
    const t = await signJwt({ sub: 'u1', email: 'a@b.c' });
    const parts = t.split('.');
    parts[1] = parts[1].slice(0, -1) + (parts[1].endsWith('A') ? 'B' : 'A');
    await expect(verifyJwt(parts.join('.'))).rejects.toBeTruthy();
  });

  it('rejects preview token passed to verifyJwt', async () => {
    const t = await signPreviewToken({ invitationId: 'i1', ownerId: 'u1' });
    await expect(verifyJwt(t)).rejects.toBeTruthy();
  });
});

describe('preview JWT', () => {
  it('round-trips inv, sub, kind=preview', async () => {
    const t = await signPreviewToken({ invitationId: 'i1', ownerId: 'u1' });
    const p = await verifyPreviewToken(t);
    expect(p.inv).toBe('i1');
    expect(p.sub).toBe('u1');
    expect(p.kind).toBe('preview');
  });

  it('rejects session token passed to verifyPreviewToken', async () => {
    const t = await signJwt({ sub: 'u1', email: 'a@b.c' });
    await expect(verifyPreviewToken(t)).rejects.toBeTruthy();
  });

  it('rejects tampered preview token', async () => {
    const t = await signPreviewToken({ invitationId: 'i1', ownerId: 'u1' });
    const parts = t.split('.');
    parts[2] = parts[2].slice(0, -1) + (parts[2].endsWith('A') ? 'B' : 'A');
    await expect(verifyPreviewToken(parts.join('.'))).rejects.toBeTruthy();
  });
});
