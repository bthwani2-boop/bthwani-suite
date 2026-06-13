/**
 * DSH store builder helpers.
 * Pure builder functions that derive structured data from domain types
 * for use in store-detail and home screens.
 *
 * Owner: dsh/frontend/shared
 * Not a runtime binding — not API/backend source.
 */

import type { DshFulfillmentDeliveryMode } from './dsh-delivery-mode.model';
import type { DshDiscoveryStore, DshStoreMenuItem } from './dshStoreProductCardModel';

export const dshStoreBuildersContractMeta = {
  dataKind: 'SCAFFOLD_PENDING_BINDING',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

export type StoreDeliveryModeEntry = {
  id: DshFulfillmentDeliveryMode;
  name: string;
  isAvailable: boolean;
  estimatedTime?: string;
  fee?: number;
};

export function buildStoreCategories(items: DshStoreMenuItem[]) {
  const uniqueCategories = Array.from(
    new Map(items.map((item) => [item.categoryId, item.categoryLabel])).entries(),
  );

  return uniqueCategories.map(([id, label], index) => ({
    id,
    label,
    itemCount: items.filter((item) => item.categoryId === id).length,
    isPopular: index === 0,
  }));
}

export function buildStoreDeliveryModes(store: Pick<DshDiscoveryStore, 'meta' | 'supportsPickup' | 'supportsPartnerDelivery'> | undefined | null): StoreDeliveryModeEntry[] {
  if (!store) {
    return [
      {
        id: 'bthwani_delivery',
        name: 'توصيل بثواني',
        isAvailable: false,
        estimatedTime: '',
        fee: 12,
      },
      {
        id: 'partner_delivery',
        name: 'توصيل المتجر',
        isAvailable: false,
        estimatedTime: '',
        fee: 0,
      },
      {
        id: 'pickup',
        name: 'استلم بنفسك',
        isAvailable: false,
        estimatedTime: '15 دقيقة',
        fee: 0,
      },
    ];
  }
  return [
    {
      id: 'bthwani_delivery',
      name: 'توصيل بثواني',
      isAvailable: true,
      estimatedTime: store.meta,
      fee: 12,
    },
    {
      id: 'partner_delivery',
      name: 'توصيل المتجر',
      isAvailable: store.supportsPartnerDelivery,
      estimatedTime: store.meta,
      fee: 0,
    },
    {
      id: 'pickup',
      name: 'استلم بنفسك',
      isAvailable: store.supportsPickup,
      estimatedTime: '15 دقيقة',
      fee: 0,
    },
  ];
}

export function buildStoreTags(store: DshDiscoveryStore | undefined | null) {
  if (!store) {
    return [];
  }
  return [
    store.hasBthwaniPro ? 'بثواني برو' : null,
    store.isOffer ? 'عرض مباشر' : null,
    store.distanceKm != null ? `${store.distanceKm} كم` : null,
    store.supportsPickup ? 'استلم بنفسك' : null,
    store.supportsPartnerDelivery ? 'توصيل المتجر' : null,
  ].filter(Boolean) as string[];
}
