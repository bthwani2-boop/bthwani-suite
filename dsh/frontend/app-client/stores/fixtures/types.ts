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
  // Human-friendly labels (kept for compatibility)
  priceLabel?: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  // Numeric price values (recommended for computation)
  priceValue?: number;
  oldPriceValue?: number;
  measurementType?: 'piece' | 'weight' | 'portion';
  // Backwards-compatible simple options
  measurementOptions?: string[];
  // Structured options for programmatic use
  measurementOptionObjects?: MeasurementOption[];
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
  mediaKey?: string;
  imageUri?: string;
};

export type StoreItemsByStoreId = Record<string, DshStoreFixtureItem[]>;

