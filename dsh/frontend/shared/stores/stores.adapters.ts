import { dshCategoryMeasurementPolicies } from '../catalog';
import type { DshFulfillmentDeliveryMode } from '../delivery';
import type { DshProductRecord } from '../products/dsh-product-api.client';
import type { DshDiscoveryStore, DshCanonicalStoreCard } from './stores.presentation';
import type { DshStoreOperationalState } from './stores.contract';
import type { components } from '../contracts/openapi/dsh-openapi.types';
import type { DshHomeGetStore } from '../discovery/dsh-home-types';
import type { DshListDiscoveryStoresResponse, DshGetDiscoveryStoreResponse } from './stores.api';
import type { DshStoreMenuItem } from '../products';

// ─── store-profile.ts consolidations ──────────────────────────────────────────

export function formatDshStoreFollowerCount(value?: number | null) {
  const count = Number(value ?? 0);

  if (!Number.isFinite(count) || count <= 0) {
    return '0';
  }

  if (count >= 1_000_000) {
    return `${Math.round(count / 1_000_000)} مليون`;
  }

  if (count >= 1_000) {
    const compactValue = count / 1_000;
    return Number.isInteger(compactValue)
      ? `${compactValue} ألف`
      : `${compactValue.toFixed(1).replace(/\.0$/, '')} ألف`;
  }

  return `${count}`;
}

export function formatDshStoreFollowersLabel(value?: number | null, suffix = 'متابع') {
  const countLabel = formatDshStoreFollowerCount(value);
  return suffix ? `${countLabel} ${suffix}` : countLabel;
}

// ─── dsh-store-builders.ts consolidations ─────────────────────────────────────

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

export function buildStoreDeliveryModes(
  store: Pick<DshDiscoveryStore, 'meta' | 'supportsPickup' | 'supportsPartnerDelivery'> | undefined | null
): StoreDeliveryModeEntry[] {
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

// ─── dshClientStoreAdapters.ts consolidations ─────────────────────────────────

export function mapProductRecordToItem(p: DshProductRecord) {
  const isAvailable = p.available_override !== false;
  let clientVisibilityStatus: 'visible' | 'unavailable' | 'hidden' | 'removed' = 'hidden';
  if (p.approval_status === 'catalog_adopted' || p.approval_status === 'client_visible') {
    clientVisibilityStatus = isAvailable ? 'visible' : 'unavailable';
  } else if (p.approval_status === 'rejected') {
    clientVisibilityStatus = 'removed';
  } else {
    clientVisibilityStatus = 'hidden';
  }
  return {
    id: p.id,
    name: p.name,
    subtitle: p.description || '',
    priceLabel: p.price_override || p.base_price_label,
    categoryId: p.category_id || 'general',
    categoryLabel: p.category_id === 'grocery' || p.category_id === 'fresh' ? 'بقالة' : p.category_id === 'bakery' ? 'مخبوزات' : 'عام',
    isAvailable,
    clientVisibilityStatus,
    publishStage: (p.approval_status || '').replace(/_/g, '-') as any,
  };
}

export function mapStoreDetailToScreenStore(
  activeStoreDetail: DshGetDiscoveryStoreResponse | null,
  activeStore: DshDiscoveryStore | undefined | null,
  activeStoreTags: ReturnType<typeof buildStoreTags>,
  activeStoreDeliveryModes: ReturnType<typeof buildStoreDeliveryModes>,
  activeStoreCategories: any,
) {
  const s = (activeStoreDetail ?? activeStore) as Record<string, unknown> | undefined | null;
  const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);
  const tags = activeStoreDetail ? buildStoreTags({
    id: str(s?.['id']),
    name: str(s?.['name']),
    subtitle: str(s?.['address']),
    statusLabel: str(s?.['status_label']),
    meta: str(s?.['delivery_label']),
    etaMinutes: 0,
    distanceKm: Number.parseFloat(str(s?.['distance_label'])) || 0,
    rating: typeof s?.['rating'] === 'number' ? s['rating'] : 0,
    isOffer: s?.['has_offer'] === true,
    isFavorite: false,
    isFollowing: false,
    imageUri: str(s?.['image_url']),
    deliveryLabel: str(s?.['delivery_label']),
    serviceLabel: str(s?.['service_label']),
    followerCount: 0,
    multiplierLabel: 'x1',
    subscriptionPackageChips: [],
    offerLabel: str(s?.['offer_label']),
    hasBthwaniPro: false,
    hasNewProducts: false,
    hasCouponAvailable: false,
    supportsPickup: s?.['supports_pickup'] === true,
    supportsPartnerDelivery: s?.['supports_partner_delivery'] === true,
    publishStage: str(s?.['publish_stage']),
    logoImageUri: str(s?.['logo_image_url']),
  } as Parameters<typeof buildStoreTags>[0]) : activeStoreTags;

  const deliveryModes = activeStoreDetail ? buildStoreDeliveryModes({
    meta: str(s?.['delivery_label']),
    supportsPickup: s?.['supports_pickup'] === true,
    supportsPartnerDelivery: s?.['supports_partner_delivery'] === true,
  }) : activeStoreDeliveryModes;

  return {
    id: str(s?.['id']),
    name: str(s?.['name']),
    subtitle: str(s?.['address']) || str(s?.['subtitle']),
    statusLabel: str(s?.['status_label']) || str(s?.['statusLabel']),
    etaLabel: str(s?.['delivery_label']) || str(s?.['meta']) || str(s?.['etaLabel']),
    deliveryFeeLabel: str(s?.['deliveryFeeLabel']) || 'رسوم التوصيل 12 ر.ي',
    followersCount: (typeof s?.['followerCount'] === 'number' ? s['followerCount'] : 0),
    followersLabel: formatDshStoreFollowersLabel(typeof s?.['followerCount'] === 'number' ? s['followerCount'] : 0),
    priceMatchLabel: str(s?.['priceMatchLabel']) || 'الأسعار مطابقة للمطعم',
    imageUri: str(s?.['image_url']) || str(s?.['imageUri']),
    deliveryLabel: str(s?.['delivery_label']) || str(s?.['deliveryLabel']),
    serviceLabel: str(s?.['service_label']) || str(s?.['serviceLabel']),
    subscriptionPackageChips: (Array.isArray(s?.['subscriptionPackageChips']) ? s['subscriptionPackageChips'] : []) as string[],
    hasBthwaniPro: Boolean(s?.['hasBthwaniPro']),
    tags,
    categories: activeStoreCategories,
    deliveryModes,
    contactNumber: str(s?.['contact_number']) || str(s?.['contactNumber']),
    openingHours: str(s?.['opening_hours']) || str(s?.['openingHours']),
    catalogSummary: str(s?.['catalog_summary']) || str(s?.['catalogSummary']),
  };
}

// ─── store-formatting.ts consolidations ───────────────────────────────────────

export type StoreScreenDeliveryLabels = {
  pickup: string;
  storeDelivery: string;
  platformDelivery: string;
};

export function getAllDeliveryModes(): Array<{ id: DshFulfillmentDeliveryMode; label: string; icon: string }> {
  return (
    ['bthwani_delivery', 'partner_delivery', 'pickup'] as const
  ).map((id) => {
    return { id, label: id === 'pickup' ? 'استلام بنفسك' : id === 'partner_delivery' ? 'توصيل المتجر' : 'توصيل بثواني', icon: id === 'pickup' ? 'walk-outline' : 'car-outline' };
  });
}

export function normalizeDisplayText(value?: string) {
  if (!value) return '';

  return value
    .replace(/Hadda Fresh Market/gi, 'أسواق العليا الطازجة')
    .replace(/Hittin Bakery/gi, 'مخبز حطين')
    .replace(/Malqa Kitchen/gi, 'مطبخ الملقا')
    .replace(/Groceries and daily essentials/gi, 'مقاضي يومية ومنتجات طازجة')
    .replace(/Bread and pastries/gi, 'مخبوزات وخبز يومي')
    .replace(/Prepared meals/gi, 'وجبات جاهزة يومياً')
    .replace(/Royal Gala Apples/gi, 'تفاح رويال غالا')
    .replace(/Organic Milk/gi, 'حليب عضوي')
    .replace(/Whole Wheat Bread/gi, 'خبز قمح كامل')
    .replace(/Butter Croissant/gi, 'كرواسون زبدة')
    .replace(/Chocolate Slice/gi, 'شريحة شوكولاتة')
    .replace(/Creamy Pasta Box/gi, 'باستا كريمية')
    .replace(/Garden Salad/gi, 'سلطة جاردن')
    .replace(/Fresh box, 1 kg/gi, 'صندوق طازج 1 كجم')
    .replace(/1\.5L chilled bottle/gi, 'عبوة مبردة 1.5 لتر')
    .replace(/Daily fresh bakery/gi, 'مخبوز يومي طازج')
    .replace(/Baked every morning/gi, 'يخبز طازجًا كل صباح')
    .replace(/Single serving/gi, 'حصة فردية جاهزة')
    .replace(/Prepared meal ready to dispatch/gi, 'وجبة جاهزة للإرسال')
    .replace(/Light and fresh bowl/gi, 'طبق خفيف وطازج')
    .replace(/Popular/gi, 'الأكثر طلبًا')
    .replace(/Best seller/gi, 'الأكثر مبيعًا')
    .replace(/Chef pick/gi, 'اختيار الشيف')
    .replace(/Fresh/gi, 'طازج')
    .replace(/Dairy/gi, 'ألبان')
    .replace(/Bakery/gi, 'مخبوزات')
    .replace(/Meals/gi, 'وجبات')
    .replace(/Healthy/gi, 'صحي')
    .replace(/Sweets/gi, 'حلويات')
    .replace(/ETA\s*/gi, '')
    .replace(/\bmin\b/gi, 'دقيقة')
    .replace(/\bYER\b/gi, 'ر.ي')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function normalizeTagLabel(tag: string, storeText: StoreScreenDeliveryLabels) {
  const normalized = tag.trim().toLowerCase();

  if (normalized.includes('pro')) return 'بثواني برو';
  if (normalized.includes('pickup')) return storeText.pickup;
  if (normalized.includes('partner delivery') || normalized.includes('store delivery')) return storeText.storeDelivery;
  if (normalized.includes('offer')) return 'عرض مباشر';
  if (normalized.includes('km')) return tag.replace(/km/i, 'كم');

  return tag;
}

export function isDeliveryBenefitLabel(tag: string, storeText: StoreScreenDeliveryLabels) {
  const normalized = normalizeDisplayText(tag).trim().toLowerCase();

  return normalized === normalizeDisplayText(storeText.storeDelivery).toLowerCase()
    || normalized === normalizeDisplayText(storeText.pickup).toLowerCase()
    || normalized === normalizeDisplayText(storeText.platformDelivery).toLowerCase()
    || normalized.includes('توصيل المتجر')
    || normalized.includes('استلم بنفسك')
    || normalized.includes('توصيل بثواني');
}

export function resolveStoreOperationalState(
  statusLabel: string,
  deliveryLabel?: string,
  serviceLabel?: string,
): DshStoreOperationalState {
  const normalized = [statusLabel, deliveryLabel, serviceLabel]
    .filter(Boolean)
    .join(' ')
    .trim()
    .toLowerCase();

  if (
    normalized.includes('area_unserviceable')
    || normalized.includes('unserviceable')
    || normalized.includes('outside coverage')
    || normalized.includes('خارج التغطية')
    || normalized.includes('خارج النطاق')
    || normalized.includes('غير مخدوم')
  ) {
    return 'area_unserviceable';
  }

  if (normalized.includes('closed') || normalized.includes('مغلق')) {
    return 'store_closed';
  }

  return 'store_open';
}

export function resolveMeasurementOptions(item: DshStoreMenuItem) {
  if (item.measurementOptions?.length) {
    return item.measurementOptions;
  }

  return dshCategoryMeasurementPolicies[item.categoryId]?.options ?? ['حبة', '2 حبة'];
}

export function extractPriceValue(priceLabel?: string) {
  const normalized = Number((priceLabel ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(normalized) ? normalized : 0;
}

export function resolveMeasurementMultiplier(option: string) {
  const normalized = option.trim();

  if (normalized.includes('250')) return 0.25;
  if (normalized.includes('500')) return 0.5;
  if (normalized.includes('1 كجم')) return 1;
  if (normalized.includes('2 حبة')) return 2;
  if (normalized.includes('4 حبة')) return 4;
  if (normalized.includes('6 حبة')) return 6;
  if (normalized.includes('ربع')) return 0.25;
  if (normalized.includes('نصف')) return 0.5;
  if (normalized.includes('نفر')) return 1;

  return 1;
}

export function formatCurrencyValue(value: number) {
  const normalized = value % 1 === 0 ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  return `${normalized} ر.ي`;
}

export function resolveMeasurementUnitPrice(item: DshStoreMenuItem, option: string) {
  return extractPriceValue(item.priceLabel) * resolveMeasurementMultiplier(option);
}

export function parseCartItemPrice(priceLabel?: string): number {
  if (!priceLabel) return 10.0;
  const match = priceLabel.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 10.0;
}

// ─── store-search-helpers.ts consolidations ───────────────────────────────────

export type DshStoreSearchCategory = {
  id: string;
  label: string;
  itemCount: number;
  isPopular?: boolean;
};

export function isOfferItem(item: DshStoreMenuItem) {
  if ((item as Record<string, unknown>).isOffer) return true;
  if (item.discountLabel) return true;
  if (item.oldPriceLabel && item.priceLabel) return true;

  const discount = normalizeDisplayText(item.discountLabel ?? '').toLowerCase();
  if (discount.includes('%') || /\d+%/.test(discount)) return true;

  return false;
}

export function isNewItem(item: DshStoreMenuItem) {
  if (item.isNew) return true;

  const status = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
  if (status.includes('وصل') || status.includes('جديد') || status.includes('حديث')) return true;

  return false;
}

export function isFavoriteItem(item: DshStoreMenuItem) {
  if (item.isFavorite || item.isFavorited) return true;

  const status = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
  if (status.includes('مفضل') || status.includes('مفضلة')) return true;

  if (normalizeDisplayText(item.categoryLabel ?? '').toLowerCase().includes('مفضل')) return true;

  return false;
}

type BuildStoreSearchCategoriesInput = {
  storeCategories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
  clientVisibleItems: DshStoreMenuItem[];
  favoriteIds: ReadonlySet<string>;
};

export function buildStoreSearchCategories({
  storeCategories,
  clientVisibleItems,
  favoriteIds,
}: BuildStoreSearchCategoriesInput): DshStoreSearchCategory[] {
  const filteredStoreCategories = (storeCategories ?? []).filter((category) =>
    clientVisibleItems.some((item) => item.categoryId === category.id),
  );
  const popularCount = clientVisibleItems.filter((item) => {
    const status = normalizeDisplayText(item.statusLabel ?? '');
    return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
  }).length;

  const favoritesCount = clientVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id)).length;
  const newCount = clientVisibleItems.filter(isNewItem).length;
  const offersCount = clientVisibleItems.filter(isOfferItem).length;

  return [
    { id: 'all', label: 'جميع الأقسام', itemCount: clientVisibleItems.length, isPopular: true },
    { id: 'popular', label: 'الأكثر طلبًا', itemCount: popularCount || Math.min(clientVisibleItems.length, 4), isPopular: true },
    { id: 'favorites', label: 'المفضلة', itemCount: favoritesCount },
    { id: 'new', label: 'الجديدة', itemCount: newCount },
    { id: 'offers', label: 'العروض', itemCount: offersCount },
    ...filteredStoreCategories,
  ];
}

type ResolveStoreItemsForCategoryInput = {
  categoryId: string;
  clientVisibleItems: DshStoreMenuItem[];
  favoriteIds: ReadonlySet<string>;
  query: string;
};

export function resolveStoreItemsForCategory({
  categoryId,
  clientVisibleItems,
  favoriteIds,
  query,
}: ResolveStoreItemsForCategoryInput) {
  const scopedItems = (() => {
    if (categoryId === 'all') {
      return clientVisibleItems;
    }

    if (categoryId === 'popular') {
      const popularItems = clientVisibleItems.filter((item) => {
        const status = normalizeDisplayText(item.statusLabel ?? '');
        return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
      });

      return popularItems.length ? popularItems : clientVisibleItems.slice(0, Math.min(4, clientVisibleItems.length));
    }

    if (categoryId === 'favorites') {
      return clientVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id));
    }

    if (categoryId === 'new') {
      return clientVisibleItems.filter((item) => isNewItem(item));
    }

    if (categoryId === 'offers') {
      return clientVisibleItems.filter((item) => isOfferItem(item));
    }

    return clientVisibleItems.filter((item) => item.categoryId === categoryId);
  })();

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return scopedItems;
  }

  return scopedItems.filter((item) => {
    const searchableText = [
      normalizeDisplayText(item.name),
      normalizeDisplayText(item.subtitle),
      normalizeDisplayText(item.categoryLabel),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

// ─── dsh-discovery-stores-bridge.ts consolidations ───────────────────────────

export type DshDiscoveryStoresBridgeState = 'ready' | 'empty' | 'error' | 'offline' | 'loading';
export type DshDiscoveryStoresBridgeSource = 'openapi-response' | 'preview-fallback';

export type DshDiscoveryStoresBridgeInput = {
  response?: DshListDiscoveryStoresResponse;
  initialHomeStores: DshHomeGetStore[];
  initialDiscoveryStores: DshDiscoveryStore[];
  state?: DshDiscoveryStoresBridgeState;
};

export type DshDiscoveryStoresBridgeResult = {
  source: DshDiscoveryStoresBridgeSource;
  state: DshDiscoveryStoresBridgeState;
  homeStores: DshHomeGetStore[];
  discoveryStores: DshDiscoveryStore[];
  fallbackReason?: 'NO_RUNTIME_RESPONSE' | 'RUNTIME_NOT_READY';
};

export function resolveDshDiscoveryStoresBridge(
  input: DshDiscoveryStoresBridgeInput,
): DshDiscoveryStoresBridgeResult {
  if (input.response) {
    const homeStores = mapDiscoveryStoresResponseToHomeStores(input.response);
    const discoveryStores = mapDiscoveryStoresResponseToDiscoveryStores(input.response);

    return {
      source: 'openapi-response',
      state: homeStores.length > 0 ? 'ready' : 'empty',
      homeStores,
      discoveryStores,
    };
  }

  const hasPreviewStores = input.initialHomeStores.length > 0 || input.initialDiscoveryStores.length > 0;

  return {
    source: 'preview-fallback',
    state: input.state ?? (hasPreviewStores ? 'ready' : 'empty'),
    homeStores: input.initialHomeStores,
    discoveryStores: input.initialDiscoveryStores,
    fallbackReason: input.state && input.state !== 'ready' ? 'RUNTIME_NOT_READY' : 'NO_RUNTIME_RESPONSE',
  };
}

// ─── dsh-discovery-stores-mappers.ts consolidations ──────────────────────────

export type DshDiscoveryApiStore = components['schemas']['DiscoveryStore'];
export type DshDiscoveryApiStoreDetail = components['schemas']['DiscoveryStoreDetail'];

function parseDistanceKm(distanceLabel: string): number {
  const parsed = Number.parseFloat(distanceLabel.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStatusLabel(store: DshDiscoveryApiStore): string {
  return store.status_label.trim() || (store.status_tone === 'open' ? 'Open' : 'Closed');
}

function mapCommonHomeStoreFields(store: DshDiscoveryApiStore): DshHomeGetStore {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    categoryId: store.category_id,
    imageUri: store.image_url,
    logoImageUri: store.logo_image_url,
    rating: store.rating,
    statusLabel: normalizeStatusLabel(store),
    statusTone: store.status_tone,
    distanceLabel: store.distance_label,
    deliveryLabel: store.delivery_label,
    serviceLabel: store.service_label,
    followerCount: 0,
    multiplierLabel: 'x1',
    offerLabel: store.offer_label,
    isFavorite: false,
    isFollowing: false,
    hasOffer: store.has_offer,
    publishStage: store.publish_stage,
  };
}

export function mapDiscoveryApiStoreToHomeStore(store: DshDiscoveryApiStore): DshHomeGetStore {
  return mapCommonHomeStoreFields(store);
}

export function mapDiscoveryApiStoreToDiscoveryStore(store: DshDiscoveryApiStore): DshDiscoveryStore {
  const homeStore = mapCommonHomeStoreFields(store);

  return {
    id: homeStore.id,
    name: homeStore.name,
    subtitle: homeStore.address,
    statusLabel: homeStore.statusLabel,
    meta: homeStore.deliveryLabel,
    etaMinutes: 0,
    distanceKm: parseDistanceKm(homeStore.distanceLabel),
    rating: homeStore.rating ?? 0,
    isOffer: Boolean(homeStore.hasOffer),
    isFavorite: homeStore.isFavorite,
    isFollowing: homeStore.isFollowing,
    imageUri: homeStore.imageUri ?? '',
    deliveryLabel: homeStore.deliveryLabel,
    serviceLabel: homeStore.serviceLabel,
    followerCount: homeStore.followerCount,
    multiplierLabel: homeStore.multiplierLabel,
    subscriptionPackageChips: [homeStore.deliveryLabel, homeStore.serviceLabel].filter(Boolean),
    offerLabel: homeStore.offerLabel,
    hasBthwaniPro: false,
    hasNewProducts: false,
    hasCouponAvailable: false,
    supportsPickup: true,
    supportsPartnerDelivery: true,
    publishStage: homeStore.publishStage,
    logoImageUri: homeStore.logoImageUri,
  };
}

export function mapDiscoveryStoresResponseToHomeStores(
  response: DshListDiscoveryStoresResponse,
): DshHomeGetStore[] {
  return response.stores.map(mapDiscoveryApiStoreToHomeStore);
}

export function mapDiscoveryStoresResponseToDiscoveryStores(
  response: DshListDiscoveryStoresResponse,
): DshDiscoveryStore[] {
  return response.stores.map(mapDiscoveryApiStoreToDiscoveryStore);
}
