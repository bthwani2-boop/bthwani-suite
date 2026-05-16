import {
  ApprovalStage,
  isClientVisibleStage,
  isLegacyPublishedPreview,
  canRenderInClientSurface,
} from './workflow';
import type { CommercialSourceMap } from './store-card-commercial-map';

export type DshCanonicalSource =
  | 'app-field'
  | 'app-partner'
  | 'control-panel-partners'
  | 'marketing'
  | 'app-client'
  | 'manual';
export type DshCanonicalPublishStage = ApprovalStage | 'published-preview' | 'field-draft';
type DshCardTone = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type DshDiscoveryStore = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  etaMinutes: number;
  distanceKm: number;
  rating: number;
  isOffer: boolean;
  isFavorite: boolean;
  isFollowing: boolean;
  mediaKey?: string;
  imageUri: string;
  deliveryLabel: string;
  serviceLabel: string;
  followerCount: number;
  multiplierLabel: string;
  deliveryFeeLabel?: string;
  priceMatchLabel?: string;
  subscriptionPackageChips: string[];
  offerLabel?: string;
  hasBthwaniPro: boolean;
  hasNewProducts: boolean;
  hasCouponAvailable: boolean;
  supportsPickup: boolean;
  supportsPartnerDelivery: boolean;
  commercialSourceMap?: CommercialSourceMap;
  sourceRecordId?: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  publishStage?: string;
  mediaPolicy?: string;
  source?: string;
  logoImageUri?: string;
};


export type MeasurementOption = {
  id: string;
  label: string;
  multiplier?: number;
  unit?: string;
};

export type DshStoreFixtureItem = {
  id: string;
  name: string;
  subtitle?: string;
  priceLabel?: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  priceValue?: number;
  oldPriceValue?: number;
  measurementType?: 'piece' | 'weight' | 'portion';
  measurementOptions?: string[];
  measurementOptionObjects?: MeasurementOption[];
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
  mediaKey?: string;
  imageUri?: string;
  sourceRecordId?: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  publishStage?: string;
  source?: string;
  isNew?: boolean;
  isFavorite?: boolean;
  isFavorited?: boolean;
  mediaPolicy?: string;
};

export type StoreItemsByStoreId = Record<string, DshStoreFixtureItem[]>;


export type DshCanonicalStoreCard = {
  id: string;
  sourceRecordId: string;
  source: DshCanonicalSource;
  publishStage: DshCanonicalPublishStage;
  storeName: string;
  branchLabel: string;
  cityLabel: string;
  categoryLabel: string;
  subcategoryLabel?: string;
  addressLabel: string;
  zoneLabel: string;
  ownerName?: string;
  ownerPhone?: string;
  managerName?: string;
  operatingHoursLabel: string;
  deliveryReadinessLabel: string;
  coverageSummary: string;
  latitude?: string;
  longitude?: string;
  landmark?: string;
  storefrontPhotoRef?: string;
  mediaKey?: string;
  imageUri?: string;
  statusLabel: string;
  statusTone: DshCardTone;
  rating?: number;
  distanceLabel?: string;
  etaLabel?: string;
  deliveryLabel?: string;
  serviceLabel?: string;
  deliveryFeeLabel?: string;
  priceMatchLabel?: string;
  offerLabel?: string;
  followerCount: number;
  supportsPickup: boolean;
  supportsPartnerDelivery: boolean;
  hasBthwaniPro: boolean;
  hasNewProducts: boolean;
  hasCouponAvailable: boolean;
  commercialSourceMap?: CommercialSourceMap;
  canonicalProductId?: string;
};

export type DshCanonicalProductCard = {
  id: string;
  sourceRecordId: string;
  storeId: string;
  source: DshCanonicalSource;
  publishStage: DshCanonicalPublishStage;
  name: string;
  subtitle?: string;
  categoryId: string;
  categoryLabel: string;
  priceLabel: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  priceValue?: number;
  oldPriceValue?: number;
  measurementType?: 'piece' | 'weight' | 'portion';
  measurementOptions?: string[];
  sku?: string;
  gtin?: string;
  barcode?: string;
  manufacturerCode?: string;
  stockCount?: number;
  isAvailable: boolean;
  hasOptions: boolean;
  preparationTime?: string;
  mediaKey?: string;
  imageUri?: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
};

export type DshCanonicalPreviewEvidence = {
  storeId: string;
  productId: string;
  sourceRecordId: string;
  publishStage: DshCanonicalPublishStage;
  source: DshCanonicalSource;
  storeName: string;
  productName: string;
  priceLabel: string;
};

const canonicalStoreId = 'canonical-store-field-lead-5';
const canonicalProductId = 'canonical-product-field-lead-5-featured';

export function normalizeCanonicalPublishStage(stage: DshCanonicalPublishStage | 'draft' | 'review' | 'published' | string | undefined): DshCanonicalPublishStage {
  switch (stage) {
    case 'partner-submitted':
    case 'field-submitted':
    case 'partner-review':
    case 'partner-approved':
    case 'marketing-review':
    case 'marketing-approved':
    case 'catalog-adopted':
    case 'client-visible':
    case 'rejected':
    case 'needs-fix':
    case 'published-preview':
    case 'field-draft':
      return stage;
    case 'published':
      return 'published-preview';
    case 'review':
      return 'partner-review';
    case 'draft':
    default:
      return 'field-draft';
  }
}

/** @deprecated Use canRenderInClientSurface instead */
export function isClientVisible(stage: string | undefined, entityType?: string, mediaPolicy?: string): boolean {
  return canRenderInClientSurface(stage, entityType as any, { mediaPolicy });
}

const canonicalStoreCard: DshCanonicalStoreCard = {
  id: canonicalStoreId,
  sourceRecordId: 'lead-5',
  source: 'app-field',
  publishStage: 'marketing-review',
  storeName: 'تمور النخبة',
  branchLabel: 'اليرموك • الرياض',
  cityLabel: 'الرياض',
  categoryLabel: 'مواد غذائية',
  subcategoryLabel: 'تمور وهدايا',
  addressLabel: 'شارع النجاح',
  zoneLabel: 'اليرموك',
  ownerName: 'خالد المطيري',
  ownerPhone: '0500000005',
  managerName: 'عبدالعزيز',
  operatingHoursLabel: '9 ص - 11 م',
  deliveryReadinessLabel: 'جاهز',
  coverageSummary: 'شرق الرياض',
  latitude: '24.7881',
  longitude: '46.7441',
  landmark: 'مقابل الحديقة',
  storefrontPhotoRef: 'الواجهة مكتملة',
  mediaKey: 'dsh.store.lead-5.cover.v1',
  imageUri: 'dsh.store.lead-5.cover.v1',
  statusLabel: 'مفتوح',
  statusTone: 'success',
  rating: 4.9,
  distanceLabel: '2.4 كم',
  etaLabel: '18 دقيقة',
  deliveryLabel: 'توصيل سريع',
  serviceLabel: 'بثواني برو',
  deliveryFeeLabel: 'رسوم التوصيل 10 ر.ي',
  priceMatchLabel: 'الأسعار مطابقة للكتالوج',
  offerLabel: 'منتج افتتاحي موثق',
  followerCount: 4200,
  supportsPickup: true,
  supportsPartnerDelivery: true,
  hasBthwaniPro: true,
  hasNewProducts: true,
  hasCouponAvailable: true,
  canonicalProductId,
};

const canonicalProductCard: DshCanonicalProductCard = {
  id: canonicalProductId,
  sourceRecordId: 'lead-5',
  storeId: canonicalStoreId,
  source: 'app-field',
  publishStage: 'marketing-review',
  name: 'علبة تمر فاخر',
  subtitle: 'المنتج الافتتاحي موثق.',
  categoryId: 'field:مواد غذائية:تمور وهدايا',
  categoryLabel: 'تمور وهدايا',
  priceLabel: '55 ر.ي',
  priceValue: 55,
  measurementType: 'piece',
  measurementOptions: ['حبة', '2 حبة', '4 حبات'],
  sku: 'LEAD5-DATES-BOX',
  gtin: '6280001055001',
  barcode: '6280001055001',
  manufacturerCode: 'FIELD-LEAD5-01',
  stockCount: 12,
  isAvailable: true,
  hasOptions: false,
  preparationTime: 'جاهز الآن',
  mediaKey: 'dsh.product.lead-5.dates-box.v1',
  imageUri: 'dsh.product.lead-5.dates-box.v1',
  canonicalStoreId,
  canonicalProductId,
};

export const canonicalPreviewStores: ReadonlyArray<DshCanonicalStoreCard> = [canonicalStoreCard];
export const canonicalPreviewProducts: ReadonlyArray<DshCanonicalProductCard> = [canonicalProductCard];

export function getCanonicalPreviewStoreCard(id: string) {
  return canonicalPreviewStores.find((store) => store.id === id);
}

export function getCanonicalPreviewProductCard(id: string) {
  return canonicalPreviewProducts.find((product) => product.id === id);
}

export function getCanonicalPreviewProductForStore(storeId: string) {
  return canonicalPreviewProducts.find((product) => product.storeId === storeId);
}

export function getCanonicalPreviewEvidence(): DshCanonicalPreviewEvidence {
  return {
    storeId: canonicalStoreCard.id,
    productId: canonicalProductCard.id,
    sourceRecordId: canonicalStoreCard.sourceRecordId,
    publishStage: canonicalProductCard.publishStage,
    source: canonicalProductCard.source,
    storeName: canonicalStoreCard.storeName,
    productName: canonicalProductCard.name,
    priceLabel: canonicalProductCard.priceLabel,
  };
}

function cloneStringList(values: ReadonlyArray<string> | undefined) {
  return values ? [...values] : undefined;
}

export function mapCanonicalStoreToDiscoveryStore(store: DshCanonicalStoreCard): DshDiscoveryStore {
  return {
    id: store.id,
    name: store.storeName,
    subtitle: store.branchLabel,
    statusLabel: store.statusLabel,
    meta: store.etaLabel ?? store.operatingHoursLabel,
    etaMinutes: 18,
    distanceKm: 2.4,
    rating: store.rating ?? 4.8,
    isOffer: Boolean(store.offerLabel),
    isFavorite: false,
    isFollowing: false,
    mediaKey: store.mediaKey,
    imageUri: store.imageUri ?? store.mediaKey ?? 'dsh.store.lead-5.cover.v1',
    deliveryLabel: store.deliveryLabel ?? 'توصيل سريع',
    serviceLabel: store.serviceLabel ?? 'بثواني برو',
    followerCount: store.followerCount,
    multiplierLabel: 'x1',
    deliveryFeeLabel: store.deliveryFeeLabel,
    priceMatchLabel: store.priceMatchLabel,
    subscriptionPackageChips: [store.deliveryLabel ?? 'توصيل سريع', store.supportsPickup ? 'استلم بنفسك' : 'توصيل المتجر'],
    offerLabel: store.offerLabel,
    hasBthwaniPro: store.hasBthwaniPro,
    hasNewProducts: store.hasNewProducts,
    hasCouponAvailable: store.hasCouponAvailable,
    supportsPickup: store.supportsPickup,
    supportsPartnerDelivery: store.supportsPartnerDelivery,
    commercialSourceMap: store.commercialSourceMap,
    sourceRecordId: store.sourceRecordId,
    canonicalStoreId: store.id,
    canonicalProductId: store.canonicalProductId,
    publishStage: store.publishStage,
    source: store.source,
    logoImageUri: store.imageUri?.replace('cover', 'logo'),
  };
}

export function mapCanonicalProductToStoreFixtureItem(product: DshCanonicalProductCard): DshStoreFixtureItem {
  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    priceLabel: product.priceLabel,
    oldPriceLabel: product.oldPriceLabel,
    discountLabel: product.discountLabel,
    priceValue: product.priceValue,
    oldPriceValue: product.oldPriceValue,
    measurementType: product.measurementType,
    measurementOptions: cloneStringList(product.measurementOptions),
    categoryId: product.categoryId,
    categoryLabel: product.categoryLabel,
    statusLabel: product.isAvailable ? 'متاح الآن' : 'غير متاح',
    isAvailable: product.isAvailable,
    hasOptions: product.hasOptions,
    preparationTime: product.preparationTime,
    mediaKey: product.mediaKey,
    imageUri: product.imageUri,
    sourceRecordId: product.sourceRecordId,
    canonicalStoreId: product.canonicalStoreId,
    canonicalProductId: product.canonicalProductId,
    publishStage: product.publishStage,
    source: product.source,
  };
}

export function buildCanonicalPreviewDiscoveryStores() {
  return canonicalPreviewStores.map((store) => mapCanonicalStoreToDiscoveryStore(store));
}

export function buildCanonicalPreviewStoreItemsByStoreId() {
  return canonicalPreviewStores.reduce<Record<string, DshStoreFixtureItem[]>>((result, store) => {
    const product = getCanonicalPreviewProductForStore(store.id);

    if (product) {
      result[store.id] = [mapCanonicalProductToStoreFixtureItem(product)];
    }

    return result;
  }, {});
}

// --- DSH Approval Pipeline SSOT v1 Bridge ---
export type DshStoreProductCardApprovalState = {
  stage: ApprovalStage;
};
