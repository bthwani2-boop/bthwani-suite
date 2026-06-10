import { buildStoreTags, buildStoreDeliveryModes } from '../../shared/dsh-store-builders';
import type { DshGetDiscoveryStoreResponse } from '../shared/dsh-discovery-stores-client';
import type { DshDiscoveryStore } from '../../shared/dshStoreProductCardModel';
import type { DshProductRecord } from '../../shared/dsh-product-api.client';

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
  activeStore: DshDiscoveryStore,
  activeStoreTags: ReturnType<typeof buildStoreTags>,
  activeStoreDeliveryModes: ReturnType<typeof buildStoreDeliveryModes>,
  activeStoreCategories: unknown,
) {
  const s = (activeStoreDetail ?? activeStore) as Record<string, unknown>;
  const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);
  const tags = activeStoreDetail ? buildStoreTags({
    id: str(s['id']),
    name: str(s['name']),
    subtitle: str(s['address']),
    statusLabel: str(s['status_label']),
    meta: str(s['delivery_label']),
    etaMinutes: 0,
    distanceKm: Number.parseFloat(str(s['distance_label'])) || 0,
    rating: typeof s['rating'] === 'number' ? s['rating'] : 0,
    isOffer: Boolean(s['has_offer']),
    isFavorite: false,
    isFollowing: false,
    imageUri: str(s['image_url']),
    deliveryLabel: str(s['delivery_label']),
    serviceLabel: str(s['service_label']),
    followerCount: 0,
    multiplierLabel: 'x1',
    subscriptionPackageChips: [],
    offerLabel: str(s['offer_label']),
    hasBthwaniPro: false,
    hasNewProducts: false,
    hasCouponAvailable: false,
    supportsPickup: s['supports_pickup'] === true,
    supportsPartnerDelivery: s['supports_partner_delivery'] === true,
    publishStage: str(s['publish_stage']),
    logoImageUri: str(s['logo_image_url']),
  } as Parameters<typeof buildStoreTags>[0]) : activeStoreTags;

  const deliveryModes = activeStoreDetail ? buildStoreDeliveryModes({
    meta: str(s['delivery_label']),
    supportsPickup: s['supports_pickup'] === true,
    supportsPartnerDelivery: s['supports_partner_delivery'] === true,
  }) : activeStoreDeliveryModes;

  return {
    id: str(s['id']),
    name: str(s['name']),
    subtitle: str(s['address']) || str(s['subtitle']),
    statusLabel: str(s['status_label']) || str(s['statusLabel']),
    etaLabel: str(s['delivery_label']) || str(s['meta']) || str(s['etaLabel']),
    deliveryFeeLabel: str(s['deliveryFeeLabel']) || 'رسوم التوصيل 12 ر.ي',
    followersCount: (typeof s['followerCount'] === 'number' ? s['followerCount'] : 0),
    priceMatchLabel: str(s['priceMatchLabel']) || 'الأسعار مطابقة للمطعم',
    imageUri: str(s['image_url']) || str(s['imageUri']),
    deliveryLabel: str(s['delivery_label']) || str(s['deliveryLabel']),
    serviceLabel: str(s['service_label']) || str(s['serviceLabel']),
    subscriptionPackageChips: (Array.isArray(s['subscriptionPackageChips']) ? s['subscriptionPackageChips'] : []) as string[],
    hasBthwaniPro: Boolean(s['hasBthwaniPro']),
    tags,
    categories: activeStoreCategories,
    deliveryModes,
    contactNumber: str(s['contact_number']) || str(s['contactNumber']),
    openingHours: str(s['opening_hours']) || str(s['openingHours']),
    catalogSummary: str(s['catalog_summary']) || str(s['catalogSummary']),
  };
}
