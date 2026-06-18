// Canonical location: dsh/frontend/shared/checkout/checkout.contract.ts
// Authority: dsh/frontend/shared/checkout — checkout types and constants.

import type { DshClientState } from '../orders/orders.client-state';
import type { DshFulfillmentDeliveryMode, DshClientCartSnapshot } from '../cart';

type DshClientId = string;

export type DshClientServiceabilityState = Extract<DshClientState, 'serviceability' | 'area_unserviceable'>;

export type DshClientCheckoutState = Extract<DshClientState, 'checkout_ready' | 'payment_pending' | 'order_created' | 'order_confirmed'>;

export type DshClientCreateOrderRequest = {
  fulfillmentMode: DshFulfillmentDeliveryMode;
  pickupAddress: string;
  dropoffAddress: string;
  contactName: string;
  contactPhone: string;
  note: string;
  paymentMethod: 'cod' | 'wallet' | 'mixed' | 'official-wallets';
  walletAmountMinorUnits?: number;
  amountDueOnDeliveryMinorUnits?: number;
};

export type DshClientCreateOrderResponse = {
  orderId: DshClientId;
  status: Extract<DshClientCheckoutState, 'order_created' | 'order_confirmed'>;
};

export type DshClientQuoteSnapshot = {
  subtotalMinorUnits: number;
  deliveryMinorUnits: number;
  totalMinorUnits: number;
  etaLabel?: string;
  serviceabilityState: DshClientServiceabilityState;
  serviceabilityNote?: string;
};

export type DshClientServiceabilitySnapshot = {
  state: DshClientServiceabilityState;
  addressLabel: string;
  note?: string;
};

export type DshClientCheckoutSnapshot = {
  orderId?: DshClientId;
  state: DshClientCheckoutState;
  quote: DshClientQuoteSnapshot;
  serviceability: DshClientServiceabilitySnapshot;
  cart: DshClientCartSnapshot;
  paymentMethod: DshClientCreateOrderRequest['paymentMethod'];
  walletAmountMinorUnits?: number;
  amountDueOnDeliveryMinorUnits?: number;
  note?: string;
};

export type DshClientOrderSuccessPayload = {
  orderId: DshClientId;
  status: Extract<DshClientCheckoutState, 'order_created' | 'order_confirmed'>;
  successTitle?: string;
  successNote?: string;
};

export type DshClientOrderSuccessSnapshot = DshClientOrderSuccessPayload & {
  nextState?: Extract<DshClientState, 'tracking_active' | 'delivered' | 'support_required'>;
  nextAction?: 'tracking' | 'orders-list' | 'support';
};

export type CreateOrderValues = Pick<
  DshClientCreateOrderRequest,
  'fulfillmentMode' | 'pickupAddress' | 'dropoffAddress' | 'contactName' | 'contactPhone' | 'note'
>;

export const initialCreateOrderValues: CreateOrderValues = {
  fulfillmentMode: 'bthwani_delivery',
  pickupAddress: '',
  dropoffAddress: '',
  contactName: '',
  contactPhone: '',
  note: '',
};
