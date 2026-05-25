/**
 * UI_PREVIEW_ONLY: DSH store preview builder helpers.
 * These pure builder functions derive structured data from fixture types
 * for use in store-detail and home preview screens.
 *
 * Moved here from dsh/frontend/app-client/shared/store-builders to correct
 * the dependency direction: dsh/frontend/data must not import from surfaces.
 *
 * Owner: dsh/frontend/shared
 * Not a runtime binding — not API/backend source.
 */

import type { DshFulfillmentDeliveryMode } from './dsh-delivery-mode.model';
import type { DshDiscoveryStore, DshStoreFixtureItem } from './dshStoreProductCardModel';

export const dshStoreBuildersContractMeta = {
  dataKind: 'UI_PREVIEW_ONLY',
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

export function buildStoreCategories(items: DshStoreFixtureItem[]) {
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

export function buildStoreDeliveryModes(store: Pick<DshDiscoveryStore, 'meta' | 'supportsPickup' | 'supportsPartnerDelivery'>): StoreDeliveryModeEntry[] {
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

export function buildStoreTags(store: DshDiscoveryStore) {
  return [
    store.hasBthwaniPro ? 'بثواني برو' : null,
    store.isOffer ? 'عرض مباشر' : null,
    store.distanceKm != null ? `${store.distanceKm} كم` : null,
    store.supportsPickup ? 'استلم بنفسك' : null,
    store.supportsPartnerDelivery ? 'توصيل المتجر' : null,
  ].filter(Boolean) as string[];
}
