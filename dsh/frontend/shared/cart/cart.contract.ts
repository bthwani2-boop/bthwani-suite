// Canonical location: dsh/frontend/shared/cart/cart.contract.ts
// Authority: dsh/frontend/shared/cart — cart types and metadata contracts.
// DshFulfillmentDeliveryMode is canonical in shared/delivery — re-exported here for backward compat.

import type { DshFulfillmentDeliveryMode } from '../delivery/delivery.contract';
import { isDshFulfillmentDeliveryMode } from '../delivery/delivery.contract';

export type { DshFulfillmentDeliveryMode };
export { isDshFulfillmentDeliveryMode };

type DshClientId = string;

export type HostCartItem = {
  id: string;
  title: string;
  priceLabel?: string;
  qty: number;
  storeId: string;
  storeName: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  sourceRecordId?: string;
  publishStage?: string;
};

export type HostCanonicalMetadata = {
  canonicalStoreId?: string;
  canonicalProductId?: string;
  sourceRecordId?: string;
  publishStage?: string;
};

export type DshClientCartLine = {
  id: DshClientId;
  itemId: DshClientId;
  title: string;
  qty: number;
  priceValue: number;
};

export type DshClientCartSnapshot = {
  lines: DshClientCartLine[];
  subtotalMinorUnits: number;
  deliveryMinorUnits: number;
  totalMinorUnits: number;
};


export type DshFulfillmentDeliveryModeMeta = {
  readonly mode: DshFulfillmentDeliveryMode;
  readonly label: string;
  readonly icon: string;
  readonly operationalOwner: string;
  readonly financialOwner: 'WLT';
  readonly requiresCaptain: boolean;
  readonly requiresPartnerCourier: boolean;
  readonly requiresCustomerPickup: boolean;
};

export const DSH_FULFILLMENT_DELIVERY_MODE_META: Readonly<Record<DshFulfillmentDeliveryMode, DshFulfillmentDeliveryModeMeta>> = {
  bthwani_delivery: {
    mode: 'bthwani_delivery',
    label: 'توصيل بثواني',
    icon: 'bicycle-outline',
    operationalOwner: 'DSH Operations + Captain',
    financialOwner: 'WLT',
    requiresCaptain: true,
    requiresPartnerCourier: false,
    requiresCustomerPickup: false,
  },
  partner_delivery: {
    mode: 'partner_delivery',
    label: 'توصيل المتجر',
    icon: 'storefront-outline',
    operationalOwner: 'Partner / Store Courier',
    financialOwner: 'WLT',
    requiresCaptain: false,
    requiresPartnerCourier: true,
    requiresCustomerPickup: false,
  },
  pickup: {
    mode: 'pickup',
    label: 'استلم بنفسك',
    icon: 'bag-handle-outline',
    operationalOwner: 'Client + Store',
    financialOwner: 'WLT',
    requiresCaptain: false,
    requiresPartnerCourier: false,
    requiresCustomerPickup: true,
  },
} as const;

export function getDshFulfillmentDeliveryModeMeta(mode: DshFulfillmentDeliveryMode): DshFulfillmentDeliveryModeMeta {
  return DSH_FULFILLMENT_DELIVERY_MODE_META[mode];
}
