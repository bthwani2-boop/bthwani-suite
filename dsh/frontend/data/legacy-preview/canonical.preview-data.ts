/**
 * CENTRAL DSH CANONICAL PREVIEW DATA
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source.
 *
 * Owns: canonical store + product constants, helpers, and discovery builders.
 * Import direction: this file → ../shared/dshStoreProductCardModel only.
 * Do NOT import from ../data (barrel) here — that would recreate the circular dep.
 */
import {
  type DshCanonicalStoreCard,
  type DshCanonicalProductCard,
  type DshCanonicalPreviewEvidence,
  type DshDiscoveryStore,
  type DshStoreMenuItem,
  type StoreItemsByStoreId,
  mapCanonicalStoreToDiscoveryStore,
  mapCanonicalProductToStoreMenuItem,
} from '../../shared/dshStoreProductCardModel';

// ── Canonical IDs ────────────────────────────────────────────────────────────

export const canonicalStoreId = 'canonical-store-field-lead-5';
export const canonicalProductId = 'canonical-product-field-lead-5-featured';

// ── Canonical Store Card ─────────────────────────────────────────────────────

export const canonicalStoreCard: DshCanonicalStoreCard = {
  id: 'canonical-store-field-lead-5',
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

export const canonicalPreviewStores: ReadonlyArray<DshCanonicalStoreCard> = [canonicalStoreCard];

// ── Canonical Product Card ───────────────────────────────────────────────────

export const canonicalProductCard: DshCanonicalProductCard = {
  id: 'canonical-product-field-lead-5-featured',
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

export const canonicalPreviewProducts: ReadonlyArray<DshCanonicalProductCard> = [canonicalProductCard];

// ── Canonical Helpers ────────────────────────────────────────────────────────

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

// ── Discovery Builders ───────────────────────────────────────────────────────

export function buildCanonicalPreviewDiscoveryStores(): DshDiscoveryStore[] {
  return canonicalPreviewStores.map((store) => mapCanonicalStoreToDiscoveryStore(store));
}

export function buildCanonicalPreviewStoreItemsByStoreId(): StoreItemsByStoreId {
  return canonicalPreviewStores.reduce<Record<string, DshStoreMenuItem[]>>((result, store) => {
    const product = getCanonicalPreviewProductForStore(store.id);
    if (product) {
      result[store.id] = [mapCanonicalProductToStoreMenuItem(product)];
    }
    return result;
  }, {});
}
