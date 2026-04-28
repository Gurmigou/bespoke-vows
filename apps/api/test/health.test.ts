import { describe, it, expect } from 'vitest';
import { request } from './helpers.js';

describe('GET /api/health', () => {
  it('returns ok with timestamp', async () => {
    const res = await request('/api/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
  });
});
