import { describe, it, expect } from 'vitest';
import { request, createTemplate } from '../helpers.js';

describe('GET /templates', () => {
  it('returns list, no auth required', async () => {
    await createTemplate({ slug: 'classic' });
    await createTemplate({ slug: 'modern' });
    const res = await request('/templates');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body.map((t: { slug: string }) => t.slug).sort()).toEqual(['classic', 'modern']);
  });
});

describe('GET /templates/:slug', () => {
  it('returns template by slug', async () => {
    await createTemplate({ slug: 'floral' });
    const res = await request('/templates/floral');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe('floral');
    expect(body.definition).toBeDefined();
    expect(body.defaultData).toBeDefined();
  });

  it('404 on unknown slug', async () => {
    const res = await request('/templates/zzz');
    expect(res.status).toBe(404);
  });
});
