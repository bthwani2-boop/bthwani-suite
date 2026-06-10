import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';

import type { DshFulfillmentDeliveryMode } from './dsh-client-binding.contracts';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';
import type { useStoreState } from '../hooks/useStoreState';
import type { useStoreDerivedItems } from '../hooks/useStoreDerivedItems';

export type DshStoreGetScreenProps = {
  appearanceMode?: BThwaniAppearanceMode;
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'not-found';
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
    commercialSourceMap?: import('../../shared/store-card-commercial-map').CommercialSourceMap;
    tags?: string[];
    categories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
    deliveryModes?: Array<{ id: DshFulfillmentDeliveryMode; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
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
    contactNumber?: string;
    openingHours?: string;
    catalogSummary?: string;
  };
  menuItems?: DshStoreGetMenuItem[];
  onOpenItems?: () => void;
  onOpenCart?: (mode?: DshFulfillmentDeliveryMode) => void;
  onAddItemToCart?: (
    item: DshStoreGetMenuItem,
    payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string },
  ) => void;
  onOpenBenefits?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export type DshStoreGetScreenShellProps = DshStoreGetScreenProps & {
  appearanceMode: BThwaniAppearanceMode;
  isRTL: boolean;
  storeState: ReturnType<typeof useStoreState>;
  derivedItems: ReturnType<typeof useStoreDerivedItems>;
  visibleItems: DshStoreGetMenuItem[];
  previewItems: DshStoreGetMenuItem[];
};
