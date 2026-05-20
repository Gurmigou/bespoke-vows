export {
  PRICE_INVITATION_1Y_CENTS,
  PRICE_LIFETIME_CENTS,
  PRICING_CURRENCY,
} from '@bespoke-vows/shared';
import type { PaymentKind } from '@bespoke-vows/shared';
import {
  PRICE_INVITATION_1Y_CENTS,
  PRICE_LIFETIME_CENTS,
} from '@bespoke-vows/shared';

export function expectedAmountFor(kind: PaymentKind): number {
  return kind === 'lifetime' ? PRICE_LIFETIME_CENTS : PRICE_INVITATION_1Y_CENTS;
}
