import { describe, it, expect } from 'vitest';
import { derivedStatus, canFreeTrial, canPublish } from '../../src/lib/status.js';

const future = new Date(Date.now() + 60_000);
const past = new Date(Date.now() - 60_000);

describe('derivedStatus', () => {
  it('returns draft when status=draft', () => {
    expect(derivedStatus({ status: 'draft', activeUntil: null })).toBe('draft');
    expect(derivedStatus({ status: 'draft', activeUntil: future })).toBe('draft');
  });
  it('returns active when status=active and activeUntil > now', () => {
    expect(derivedStatus({ status: 'active', activeUntil: future })).toBe('active');
  });
  it('returns expired when status=active and activeUntil < now', () => {
    expect(derivedStatus({ status: 'active', activeUntil: past })).toBe('expired');
  });
  it('returns expired when status=active and activeUntil null', () => {
    expect(derivedStatus({ status: 'active', activeUntil: null })).toBe('expired');
  });
  it('boundary: activeUntil === now is expired (strict >)', () => {
    const now = new Date();
    expect(derivedStatus({ status: 'active', activeUntil: now }, now)).toBe('expired');
  });
});

describe('canFreeTrial', () => {
  it('true when freeTrialUsedAt is null', () => {
    expect(canFreeTrial({ freeTrialUsedAt: null })).toBe(true);
  });
  it('false when freeTrialUsedAt is set', () => {
    expect(canFreeTrial({ freeTrialUsedAt: new Date() })).toBe(false);
  });
});

describe('canPublish', () => {
  it('returns already_active when active', () => {
    expect(canPublish({ status: 'active', activeUntil: future, freeTrialUsedAt: null })).toEqual({
      ok: false,
      reason: 'already_active',
    });
  });
  it('returns free mode when draft + trial available', () => {
    expect(canPublish({ status: 'draft', activeUntil: null, freeTrialUsedAt: null })).toEqual({
      ok: true,
      mode: 'free',
    });
  });
  it('returns payment_required when expired + trial used', () => {
    expect(canPublish({ status: 'active', activeUntil: past, freeTrialUsedAt: past })).toEqual({
      ok: false,
      reason: 'payment_required',
    });
  });
  it('returns free when expired but trial never used', () => {
    expect(canPublish({ status: 'active', activeUntil: past, freeTrialUsedAt: null })).toEqual({
      ok: true,
      mode: 'free',
    });
  });
});
