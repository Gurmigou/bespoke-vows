import type { User, Template, Invitation, Payment } from '@bespoke-vows/shared';
import type { User as UserRow, TemplateRow, InvitationRow, PaymentRow } from '../db/schema.js';
import { derivedStatus } from './status.js';

export function toUserDto(user: UserRow): User {
  return {
    id: user.id,
    email: user.email,
    subscriptionStatus: user.subscriptionStatus as User['subscriptionStatus'],
    subscriptionEndDate: user.subscriptionEndDate ? user.subscriptionEndDate.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toTemplateDto(t: TemplateRow): Template {
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    definition: t.definition as Template['definition'],
    defaultData: t.defaultData as Template['defaultData'],
  };
}

export function toInvitationDto(inv: InvitationRow, templateSlug: string): Invitation {
  return {
    id: inv.id,
    userId: inv.userId,
    templateId: inv.templateId,
    templateSlug,
    status: inv.status as Invitation['status'],
    paymentStatus: inv.paymentStatus as Invitation['paymentStatus'],
    derivedStatus: derivedStatus(inv),
    activeUntil: inv.activeUntil ? inv.activeUntil.toISOString() : null,
    visible: inv.visible,
    visibleStatusChangedAt: inv.visibleStatusChangedAt ? inv.visibleStatusChangedAt.toISOString() : null,
    paymentId: inv.paymentId,
    freeTrialUsedAt: inv.freeTrialUsedAt ? inv.freeTrialUsedAt.toISOString() : null,
    config: inv.config as Invitation['config'],
    createdAt: inv.createdAt.toISOString(),
    updatedAt: inv.updatedAt.toISOString(),
  };
}

export interface PaymentDtoJoin {
  hisName: string;
  herName: string;
  templateSlug: string;
  activeUntil: Date | null;
}

export function toPaymentDto(p: PaymentRow, join: PaymentDtoJoin): Payment {
  return {
    id: p.id,
    invitationId: p.invitationId,
    amount: p.amount,
    currency: p.currency,
    status: p.status as Payment['status'],
    kind: p.kind as Payment['kind'],
    createdAt: p.createdAt.toISOString(),
    couple: `${join.hisName} & ${join.herName}`.trim(),
    templateSlug: join.templateSlug,
    activeUntil: join.activeUntil ? join.activeUntil.toISOString() : null,
  };
}
