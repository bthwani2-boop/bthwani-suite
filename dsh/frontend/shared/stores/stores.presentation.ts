import type { CommercialSourceMap } from '../marketing/store-card-commercial-map';
import type { DshCanonicalSource, DshCanonicalPublishStage, DshCardTone } from '../products';

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
    imageUri: store.imageUri ?? store.mediaKey ?? '',
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
  };
}
