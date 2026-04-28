import { describe, it, expect } from 'vitest';
import { request, sessionFor, createUser, INVALID_COOKIE } from './helpers.js';

async function multipart(file?: File) {
  const fd = new FormData();
  if (file) fd.append('file', file);
  return fd;
}

describe('POST /upload', () => {
  it('returns 401 with invalid token', async () => {
    const res = await request('/upload', {
      method: 'POST',
      cookie: INVALID_COOKIE,
      body: await multipart(new File(['x'], 'a.png', { type: 'image/png' })),
    });
    expect(res.status).toBe(401);
  });

  it('returns 400 when file field is missing', async () => {
    const u = await createUser();
    const cookie = await sessionFor(u.id);
    const res = await request('/upload', { method: 'POST', cookie, body: await multipart() });
    expect(res.status).toBe(400);
  });

  it('returns 415 for disallowed mime type', async () => {
    const u = await createUser();
    const cookie = await sessionFor(u.id);
    const file = new File(['x'], 'a.txt', { type: 'text/plain' });
    const res = await request('/upload', { method: 'POST', cookie, body: await multipart(file) });
    expect(res.status).toBe(415);
  });

  it('returns 413 when file exceeds 3MB', async () => {
    const u = await createUser();
    const cookie = await sessionFor(u.id);
    const big = new Uint8Array(3 * 1024 * 1024 + 1);
    const file = new File([big], 'big.png', { type: 'image/png' });
    const res = await request('/upload', { method: 'POST', cookie, body: await multipart(file) });
    expect(res.status).toBe(413);
  });

  it('uploads a valid file and returns its url', async () => {
    const u = await createUser();
    const cookie = await sessionFor(u.id);
    const file = new File([new Uint8Array(10)], 'photo.png', { type: 'image/png' });
    const res = await request('/upload', { method: 'POST', cookie, body: await multipart(file) });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.url).toMatch(/^https:\/\/blob\.test\/photo\.png$/);
  });
});
