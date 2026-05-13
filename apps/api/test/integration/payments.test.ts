import { describe, it, expect } from 'vitest';
import { request, createUser, sessionFor, createTemplate, createInvitation, createPayment } from '../helpers.js';

describe('GET /payments', () => {
  it('401 without auth', async () => {
    const res = await request('/payments');
    expect(res.status).toBe(401);
  });

  it('returns only own payments with joined fields', async () => {
    const u1 = await createUser();
    const u2 = await createUser();
    const t = await createTemplate({ slug: 'classic' });
    const inv1 = await createInvitation(u1.id, t.id, {
      config: {
        hisName: 'Іван',
        herName: 'Марія',
        weddingDate: '',
        weddingPlace: '',
        venue: { label: '', mapsUrl: '' },
        loveStory: { moments: [] },
        events: [],
        weddingColors: [],
        templateColors: { primary: '#000', text: '#000', accent: '#000' },
      } as never,
      activeUntil: new Date('2027-01-01'),
    });
    const inv2 = await createInvitation(u2.id, t.id);
    await createPayment(u1.id, inv1.id);
    await createPayment(u2.id, inv2.id);

    const res = await request('/payments', { cookie: await sessionFor(u1.id, u1.email) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].invitationId).toBe(inv1.id);
    expect(body[0].couple).toBe('Іван & Марія');
    expect(body[0].templateSlug).toBe('classic');
    expect(body[0].activeUntil).toBe('2027-01-01T00:00:00.000Z');
    expect(body[0]).not.toHaveProperty('providerRef');
  });
});
