import { describe, it, expect } from 'vitest';
import { request, createUser, sessionFor } from '../helpers.js';

function makeForm(file: File) {
  const form = new FormData();
  form.append('file', file);
  return form;
}

describe('POST /upload', () => {
  it('401 without auth', async () => {
    const res = await request('/upload', { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('400 when file missing', async () => {
    const u = await createUser();
    const form = new FormData();
    const res = await request('/upload', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      body: form,
    });
    expect(res.status).toBe(400);
  });

  it('415 on disallowed mime', async () => {
    const u = await createUser();
    const file = new File(['x'], 'a.txt', { type: 'text/plain' });
    const res = await request('/upload', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      body: makeForm(file),
    });
    expect(res.status).toBe(415);
  });

  it('413 on oversize file', async () => {
    const u = await createUser();
    const big = new Uint8Array(3 * 1024 * 1024 + 1);
    const file = new File([big], 'big.jpg', { type: 'image/jpeg' });
    const res = await request('/upload', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      body: makeForm(file),
    });
    expect(res.status).toBe(413);
  });

  it('201 on valid jpeg', async () => {
    const u = await createUser();
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'a.jpg', { type: 'image/jpeg' });
    const res = await request('/upload', {
      method: 'POST',
      cookie: await sessionFor(u.id, u.email),
      body: makeForm(file),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.url).toMatch(/^https:\/\/blob\.test\//);
  });
});
