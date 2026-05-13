import { describe, it, expect } from 'vitest';
import { toUserDto, toInvitationDto, toPaymentDto, toTemplateDto } from '../../src/lib/serialize.js';

describe('toUserDto', () => {
  it('strips password_hash, deleted_at, updated_at', () => {
    const dto = toUserDto({
      id: 'u1',
      email: 'a@b.c',
      passwordHash: 'secret',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-02'),
      deletedAt: new Date('2026-01-03'),
    });
    expect(dto).toEqual({ id: 'u1', email: 'a@b.c', createdAt: '2026-01-01T00:00:00.000Z' });
    expect(dto).not.toHaveProperty('passwordHash');
    expect(dto).not.toHaveProperty('deletedAt');
    expect(dto).not.toHaveProperty('updatedAt');
  });
});

describe('toInvitationDto', () => {
  const baseRow = {
    id: 'i1',
    userId: 'u1',
    templateId: 't1',
    status: 'draft',
    paymentStatus: 'free',
    activeUntil: null,
    visible: true,
    visibleStatusChangedAt: null,
    paymentId: null,
    freeTrialUsedAt: null,
    config: {} as never,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-02'),
    deletedAt: null,
  };

  it('adds derivedStatus, drops deletedAt', () => {
    const dto = toInvitationDto(baseRow, 'classic');
    expect(dto.derivedStatus).toBe('draft');
    expect(dto.templateSlug).toBe('classic');
    expect(dto).not.toHaveProperty('deletedAt');
  });

  it('serializes timestamps as ISO', () => {
    const dto = toInvitationDto(baseRow, 'classic');
    expect(dto.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(dto.updatedAt).toBe('2026-01-02T00:00:00.000Z');
    expect(dto.activeUntil).toBeNull();
  });
});

describe('toPaymentDto', () => {
  it('strips provider_ref + deleted_at; adds joined fields', () => {
    const dto = toPaymentDto(
      {
        id: 'p1',
        userId: 'u1',
        invitationId: 'i1',
        amount: 999,
        currency: 'USD',
        provider: 'plata_mock',
        providerRef: 'secret-ref',
        status: 'succeeded',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        deletedAt: null,
      },
      { hisName: 'Іван', herName: 'Марія', templateSlug: 'classic', activeUntil: new Date('2027-01-01') }
    );
    expect(dto).not.toHaveProperty('providerRef');
    expect(dto).not.toHaveProperty('deletedAt');
    expect(dto.couple).toBe('Іван & Марія');
    expect(dto.templateSlug).toBe('classic');
    expect(dto.activeUntil).toBe('2027-01-01T00:00:00.000Z');
  });
});

describe('toTemplateDto', () => {
  it('returns the row stripped of internal columns', () => {
    const dto = toTemplateDto({
      id: 't1',
      slug: 'classic',
      name: 'Classic',
      description: 'd',
      definition: { id: 'classic' } as never,
      defaultData: {} as never,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    expect(dto.id).toBe('t1');
    expect(dto.slug).toBe('classic');
    expect(dto).not.toHaveProperty('createdAt');
    expect(dto).not.toHaveProperty('deletedAt');
  });
});
