import type { CommercialSourceMap } adapters/store-card-commercial-map';
import type { DshPartnerVisibilityBadge } contracts/dsh-partner-activation.model';
import type { HomePromoRecord, MarketingVideoRecord } contracts/dsh-marketing-types';

export type DshServiceId = 'dsh' | 'knz' | 'amn' | 'arb' | 'wlt' | 'esf' | 'kwd' | 'mrf' | 'snd';

export type DshHomeBannerActionType = 'main_category' | 'sub_category' | 'store' | 'external' | 'store_category' | 'product' | 'subscription';

export type DiscoveryFilter = 'all' | 'favorites' | 'nearest' | 'new' | 'offers';

export type DshHomeCategory = {
  id: string;
  label: string;
  subtitle?: string;
  countLabel?: string;
  renderMode?: 'stores' | 'manual-order';
  emojiFallback?: string;
  /** Central media key resolved by runtime media handling or placeholder fallback. */
  mediaKey?: string;
  subcategories?: Array<{
    id: string;
    label: string;
    subtitle: string;
    mediaKey?: string;
  }>;
};

export type DshHomeGetPromo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  actionType?: DshHomeBannerActionType;
  actionTarget?: string;
  actionExtra?: string;
  mediaKey?: string;
  imageUrl?: string;
  accentColor?: string;
  ctaLabel?: string;
  templateId?: string;
  partnerLogoUrl?: string;
  partnerLogoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offerBadgeText?: string;
  offerBadgeColor?: string;
  offerBadgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayImageUrl?: string;
  overlayPosition?: 'center' | 'bottom' | 'top' | 'fill';
  overlayOpacity?: number;
  titlePlacement?: 'top' | 'center' | 'bottom';
  subtitlePlacement?: 'top' | 'center' | 'bottom';
  ctaPlacement?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  imageFit?: 'cover' | 'contain';
  motionStyle?: 'slide' | 'soft-parallax' | 'subtle-fade' | 'snap-focus';
  autoplayEnabled?: boolean;
  autoplayIntervalMs?: number;
  pauseOnInteraction?: boolean;
};

export type DshHomeGetStore = {
  id: string;
  name: string;
  address: string;
  categoryId?: string;
  mediaKey?: string;
  imageUri?: string;
  rating?: number;
  statusLabel: string;
  statusTone: 'open' | 'closed';
  distanceLabel: string;
  deliveryLabel: string;
  serviceLabel: string;
  followerCount: number;
  multiplierLabel: string;
  subscriptionPackageChips?: string[];
  offerLabel?: string;
  isFavorite: boolean;
  isFollowing: boolean;
  hasOffer?: boolean;
  hasBthwaniPro?: boolean;
  hasNewProducts?: boolean;
  hasCouponAvailable?: boolean;
  publishStage?: string;
  commercialSourceMap?: CommercialSourceMap;
  supportsPickup?: boolean;
  supportsPartnerDelivery?: boolean;
  serviceabilityAvailable?: boolean;
  catalogPublished?: boolean;
  /** P0-04: Resolved badge for client-visible stores — display-only.
   *  Derived from DshPartnerActivationStatus via getDshPartnerVisibilityBadge().
   *  app-client never reads raw activation status; it receives only the resolved badge. */
  visibilityBadge?: DshPartnerVisibilityBadge;
  // PREMIUM 2026 ENHANCEMENTS
  locationLabel?: string;
  deliveryTimeLabel?: string;
  isPopular?: boolean;
  logoImageUri?: string;
};

export type DshHomeRecentOrder = {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  meta: string;
  statusLabel: string;
};

export type StorePagerPage = {
  categoryId: string;
  renderMode: 'stores' | 'manual-order';
  stores: DshHomeGetStore[];
};
