/**
 * Shorts feed fixture (Scope E — dev/test/story-only).
 * Use from fixtures for preview/Storybook; production uses real API.
 */

import type {
  DshServiceShortItem,
  ArbServiceShortItem,
  ServiceShortItem,
} from '@bthwani/domain-types';

const DSH_HOME_BELOW_HERO = 'dsh_home_below_hero';
const DSH_HOME_AFTER_CATEGORIES = 'dsh_home_after_categories';
const ARB_HOME_BELOW_HERO = 'arb_home_below_hero';
const ARB_HOME_AFTER_FEATURED = 'arb_home_after_featured';

function createDshItem(
  id: string,
  title: string,
  posterPath: string,
  routeKey: string,
  params?: Record<string, unknown>,
  labelAr?: string,
  labelEn?: string,
  subjectType: 'store' | 'product' | 'main_category' | 'sub_category' | 'categories' = 'store'
): DshServiceShortItem {
  const subjectRef =
    subjectType === 'product' && params?.productId
      ? { type: 'product', id: String(params.productId), extra: String(params.storeId ?? '') }
      : { type: 'store', id: String(params?.storeId ?? id) };
  return {
    id,
    service: 'DSH',
    mode: 'shoppable',
    subject_type: subjectType,
    subject_refs: [subjectRef],
    title,
    short_caption: undefined,
    poster_url: posterPath,
    video_url: posterPath.replace(/\.(jpg|jpeg|png|webp)$/i, '.mp4'),
    duration_sec: 15,
    aspect_ratio: '9:16',
    objective: 'discovery',
    placement_ids: [DSH_HOME_BELOW_HERO],
    cta: { type: 'navigate', route_key: routeKey, params, label_ar: labelAr ?? 'انتقل', label_en: labelEn ?? 'Go' },
    lifecycle_state: 'published',
    campaign_id: undefined,
    campaign_badge: undefined,
  };
}

function createArbItem(
  id: string,
  title: string,
  posterPath: string,
  routeKey: string,
  params?: Record<string, unknown>
): ArbServiceShortItem {
  return {
    id,
    service: 'ARB',
    mode: 'shoppable',
    subject_type: 'offer',
    subject_refs: [{ type: 'offer', id }],
    title,
    short_caption: undefined,
    poster_url: posterPath,
    video_url: posterPath.replace(/\.(jpg|jpeg|png|webp)$/i, '.mp4'),
    duration_sec: 15,
    aspect_ratio: '9:16',
    objective: 'discovery',
    placement_ids: [ARB_HOME_BELOW_HERO],
    cta: { type: 'navigate', route_key: routeKey, params, label_ar: 'احجز', label_en: 'Book' },
    lifecycle_state: 'published',
    campaign_id: undefined,
    campaign_badge: undefined,
  };
}

function getDshHomeFixture(): DshServiceShortItem[] {
  return [
    createDshItem('dsh_short_1', 'عروض المتجر', 'dsh/short_001.jpg', 'DshStoreGet', { storeId: '1' }, 'انتقل للمتجر', 'Go to store'),
    createDshItem('dsh_short_2', 'تسوق حسب الفئة', 'dsh/short_002.jpg', 'DshCategoryGet', { categoryId: 'grocery' }, 'تصفح الفئة', 'Browse category'),
    createDshItem('dsh_short_3', 'طلباتك', 'dsh/short_003.jpg', 'DshOrdersList', undefined, 'عرض الطلبات', 'View orders'),
    createDshItem('dsh_short_4', 'منتج مميز', 'dsh/short_001.jpg', 'DshStoreItemsList', { storeId: '1', productId: 'item_1' }, 'شاهد المنتج', 'View product', 'product'),
    createDshItem('dsh_short_5', 'باقة بثواني برو', 'dsh/short_002.jpg', 'DshSubscriptionProCatalog', undefined, 'اشترك الآن', 'Subscribe now', 'store'),
  ];
}

function getArbHomeFixture(): ArbServiceShortItem[] {
  return [
    createArbItem('arb_short_1', 'Explore offers', 'arb/short_001.jpg', 'ArbOffersSearch'),
    createArbItem('arb_short_2', 'My bookings', 'arb/short_002.jpg', 'ArbBookingsList'),
  ];
}

export type ShortsFeedService = 'DSH' | 'ARB';

export function getShortsFeed(
  service: ShortsFeedService,
  placementId: string
): ServiceShortItem[] {
  if (service === 'DSH' && (placementId === DSH_HOME_BELOW_HERO || placementId === DSH_HOME_AFTER_CATEGORIES)) {
    return getDshHomeFixture();
  }
  if (service === 'ARB' && (placementId === ARB_HOME_BELOW_HERO || placementId === ARB_HOME_AFTER_FEATURED)) {
    return getArbHomeFixture();
  }
  return [];
}
