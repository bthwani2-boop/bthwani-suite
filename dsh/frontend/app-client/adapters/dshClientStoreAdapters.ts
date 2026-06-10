import { buildStoreTags, buildStoreDeliveryModes } from '../../shared/dsh-store-builders';

export function mapProductRecordToItem(p: any) {
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
  activeStoreDetail: any | null,
  activeStore: any,
  activeStoreTags: any,
  activeStoreDeliveryModes: any,
  activeStoreCategories: any,
) {
  const s = activeStoreDetail || activeStore;
  const tags = activeStoreDetail ? buildStoreTags({
    id: s.id,
    name: s.name,
    subtitle: s.address || '',
    statusLabel: s.status_label || '',
    meta: s.delivery_label || '',
    etaMinutes: 0,
    distanceKm: Number.parseFloat(s.distance_label) || 0,
    rating: s.rating ?? 0,
    isOffer: s.has_offer || false,
    isFavorite: false,
    isFollowing: false,
    imageUri: s.image_url || '',
    deliveryLabel: s.delivery_label || '',
    serviceLabel: s.service_label || '',
    followerCount: 0,
    multiplierLabel: 'x1',
    subscriptionPackageChips: [],
    offerLabel: s.offer_label || '',
    hasBthwaniPro: false,
    hasNewProducts: false,
    hasCouponAvailable: false,
    supportsPickup: s.supports_pickup === true,
    supportsPartnerDelivery: s.supports_partner_delivery === true,
    publishStage: s.publish_stage || '',
    logoImageUri: s.logo_image_url || '',
  } as any) : activeStoreTags;

  const deliveryModes = activeStoreDetail ? buildStoreDeliveryModes({
    meta: s.delivery_label || '',
    supportsPickup: s.supports_pickup === true,
    supportsPartnerDelivery: s.supports_partner_delivery === true,
  }) : activeStoreDeliveryModes;

  return {
    id: s.id,
    name: s.name,
    subtitle: s.address || s.subtitle || '',
    statusLabel: s.status_label || s.statusLabel || '',
    etaLabel: s.delivery_label || s.meta || s.etaLabel || '',
    deliveryFeeLabel: s.deliveryFeeLabel ?? 'رسوم التوصيل 12 ر.ي',
    followersCount: s.followerCount || 0,
    priceMatchLabel: s.priceMatchLabel ?? 'الأسعار مطابقة للمطعم',
    imageUri: s.image_url || s.imageUri || '',
    deliveryLabel: s.delivery_label || s.deliveryLabel || '',
    serviceLabel: s.service_label || s.serviceLabel || '',
    subscriptionPackageChips: s.subscriptionPackageChips || [],
    hasBthwaniPro: s.hasBthwaniPro || false,
    tags: tags,
    categories: activeStoreCategories,
    deliveryModes: deliveryModes,
    contactNumber: s.contact_number || s.contactNumber || '',
    openingHours: s.opening_hours || s.openingHours || '',
    catalogSummary: s.catalog_summary || s.catalogSummary || '',
  };
}
