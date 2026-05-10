import { DshStoreFixtureItem, StoreItemsByStoreId, DshDiscoveryStore } from './types';

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const buildersDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

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

export function buildStoreDeliveryModes(meta: string) {
  return [
    {
      id: 'delivery' as const,
      name: 'توصيل بثواني',
      isAvailable: true,
      estimatedTime: meta,
      fee: 12,
    },
    {
      id: 'pickup' as const,
      name: 'استلم بنفسك',
      isAvailable: true,
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
