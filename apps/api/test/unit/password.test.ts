import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/lib/password.js';

describe('password hashing', () => {
  it('produces different hash for same password (random salt)', async () => {
    const a = await hashPassword('hunter2!');
    const b = await hashPassword('hunter2!');
    expect(a).not.toBe(b);
  });

  it('verifies correct password', async () => {
    const h = await hashPassword('hunter2!');
    expect(await verifyPassword('hunter2!', h)).toBe(true);
  });

  it('rejects wrong password', async () => {
    const h = await hashPassword('hunter2!');
    expect(await verifyPassword('wrong', h)).toBe(false);
  });

  it('rejects malformed hash without throwing', async () => {
    expect(await verifyPassword('x', 'not-a-real-hash')).toBe(false);
    expect(await verifyPassword('x', '')).toBe(false);
  });
});
