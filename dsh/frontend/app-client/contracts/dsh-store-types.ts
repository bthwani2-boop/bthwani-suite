import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';
import type { DshFulfillmentDeliveryMode } from './dsh-client-binding.contracts';
import type { CommercialSourceMap } from '../../shared/store-card-commercial-map';

export type DshStoreOperationalState = 'area_unserviceable' | 'store_closed' | 'store_open';

export type DshStoreGetScreenProps = {
  appearanceMode?: BThwaniAppearanceMode;
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  store?: {
    id: string;
    name: string;
    subtitle: string;
    statusLabel: string;
    etaLabel: string;
    deliveryFeeLabel: string;
    followersCount?: number;
    followersLabel?: string;
    priceMatchLabel?: string;
    imageUri?: string;
    deliveryLabel?: string;
    serviceLabel?: string;
    subscriptionPackageChips?: string[];
    hasBthwaniPro?: boolean;
    publishStage?: string;
    commercialSourceMap?: CommercialSourceMap;
    tags?: string[];
    categories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
    deliveryModes?: Array<{ id: DshFulfillmentDeliveryMode; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
    // PREMIUM 2026 ENHANCEMENTS (Synced from DshHomeGetStore)
    rating?: number;
    distanceLabel?: string;
    multiplierLabel?: string;
    offerLabel?: string;
    hasOffer?: boolean;
    hasNewProducts?: boolean;
    hasCouponAvailable?: boolean;
    locationLabel?: string;
    deliveryTimeLabel?: string;
    isPopular?: boolean;
    logoImageUri?: string;
  };
  menuItems?: DshStoreGetMenuItem[];
  onOpenItems?: () => void;
  onOpenCart?: (mode?: DshFulfillmentDeliveryMode) => void;
  onAddItemToCart?: (
    item: DshStoreGetMenuItem,
    payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string }
  ) => void;
  onOpenBenefits?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export type DshStoreGetScreenContentProps = DshStoreGetScreenProps & {
  appearanceMode: BThwaniAppearanceMode;
};
