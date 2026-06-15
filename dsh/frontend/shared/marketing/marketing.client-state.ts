import React from 'react';
import { publishedPromoCategoryIds } from '../checkout/dsh-client-binding.contracts';
import type { DshHomeGetPromo } from '../discovery/dsh-home-types';
import type { HomePromoRecord, MarketingGrowthRecord, MarketingVideoRecord, MarketingBannerRecord } from './marketing.types';

const bannerPalette = {
  white: 'white',
  black: 'black',
  brand: 'brand',
  brandStrong: 'brandStrong',
  accentOrange: 'accentOrange',
  accentBlue: 'accentBlue',
  ink: 'ink',
  danger: 'danger',
  success: 'success',
  info: 'info',
  warning: 'warning',
} as const;

const buildImageUrl = (photoPath: string) => 'https' + '://' + 'images.unsplash.com/' + photoPath;

const marketingBanners: (Omit<MarketingBannerRecord, 'motionStyle'> & { motionStyle: string; actionType: string })[] = [
  {
    id: 'banner-restaurant-premium',
    title: 'وجبات عائلية',
    subtitle: 'وفر 40% على منيو العائلة اليوم من أفضل المطاعم المختارة',
    imageUrl: buildImageUrl('photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'),
    accentColor: bannerPalette.accentOrange,
    audience: 'all',
    status: 'published',
    actionType: 'main_category',
    actionTarget: 'restaurants',
    ctaLabel: 'اكتشف المطاعم',
    partnerName: 'مطاعم مختارة',
    position: 1,
    clicks: 452,
    impressions: 3200,
    updatedAt: new Date().toISOString(),
    templateId: 'restaurant_promo',
    offerBadgeText: 'خصم 40%',
    offerBadgeColor: bannerPalette.danger,
    offerBadgePosition: 'top-right',
    partnerLogoUrl: buildImageUrl('photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=120&q=80'),
    partnerLogoPosition: 'top-left',
    titlePlacement: 'bottom',
    imageFit: 'cover',
    motionStyle: 'snap-focus',
    autoplayEnabled: true,
    autoplayIntervalMs: 4200,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-grocery-express',
    title: 'مقاضي بلمح البصر',
    subtitle: 'توصيل خلال 20 دقيقة من أقرب فرع إليك بجودة عالية',
    imageUrl: buildImageUrl('photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'),
    accentColor: bannerPalette.success,
    audience: 'all',
    status: 'published',
    actionType: 'store',
    actionTarget: 'store-1001',
    ctaLabel: 'اطلب الآن',
    partnerName: 'أسواق النور',
    position: 2,
    clicks: 210,
    impressions: 1500,
    updatedAt: new Date().toISOString(),
    templateId: 'grocery_express',
    offerBadgeText: 'توصيل سريع',
    offerBadgeColor: bannerPalette.info,
    offerBadgePosition: 'top-right',
    partnerLogoUrl: buildImageUrl('photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&q=80'),
    partnerLogoPosition: 'top-left',
    titlePlacement: 'bottom',
    imageFit: 'cover',
    motionStyle: 'slide',
    autoplayEnabled: true,
    autoplayIntervalMs: 4000,
    pauseOnInteraction: true,
  },
  {
    id: 'banner-subscription-pro',
    title: 'بثواني برو',
    subtitle: 'توصيل مجاني غير محدود لجميع طلباتك واستمتع بمزايا حصرية',
    imageUrl: buildImageUrl('photo-1526367790999-0150786486a9?auto=format&fit=crop&w=800&q=80'),
    accentColor: bannerPalette.accentBlue,
    audience: 'all',
    status: 'published',
    actionType: 'subscription',
    actionTarget: 'entitlements-get',
    ctaLabel: 'اشترك الآن',
    partnerName: 'بثواني برو',
    position: 3,
    clicks: 850,
    impressions: 5400,
    updatedAt: new Date().toISOString(),
    templateId: 'subscription_premium',
    offerBadgeText: 'أسبوع مجاني',
    offerBadgeColor: bannerPalette.accentBlue,
    offerBadgePosition: 'top-right',
    partnerLogoUrl: buildImageUrl('photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=120&q=80'),
    partnerLogoPosition: 'top-left',
    titlePlacement: 'center',
    imageFit: 'cover',
    motionStyle: 'subtle-fade',
    autoplayEnabled: true,
    autoplayIntervalMs: 5200,
    pauseOnInteraction: true,
  },
];

const marketingPromos: HomePromoRecord[] = [
  {
    id: 'promo-pro-subs',
    title: 'توصيل برو',
    subtitle: 'توصيل شبه مجاني لكل طلباتك!',
    badgeText: '',
    ctaText: 'اشترك الآن!',
    accentColor: 'white',
    imageUrl: buildImageUrl('photo-1526367790999-0150786486a9?auto=format&fit=crop&w=800&q=80'),
    thumbnail: '',
    targetType: 'subscription',
    targetId: 'entitlements-get',
    targetLabel: 'اشتراك برو',
    status: 'published',
    order: 1,
    audienceScope: 'all',
    placement: 'home-promo',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-organic-fresh',
    title: 'أسواق العليا الطازجة',
    subtitle: 'منتجات عضوية طازجة يومياً',
    badgeText: '',
    ctaText: 'تسوق الآن',
    accentColor: 'white',
    imageUrl: buildImageUrl('photo-1573244514212-2b3efc4d402b?auto=format&fit=crop&w=800&q=80'),
    thumbnail: '',
    targetType: 'store',
    targetId: 'store-1002',
    targetLabel: 'أسواق العليا',
    status: 'published',
    order: 2,
    audienceScope: 'all',
    placement: 'home-promo',
    updatedAt: new Date().toISOString(),
  },
];

type UseDshClientMarketingStateOptions = {
  hasStoreTarget: (storeId?: string) => boolean;
  hasStoreCategoryTarget: (storeId?: string, categoryId?: string) => boolean;
  hasProductTarget: (storeId?: string, productId?: string) => boolean;
};

export function useDshClientMarketingState({
  hasStoreTarget,
  hasStoreCategoryTarget,
  hasProductTarget,
}: UseDshClientMarketingStateOptions) {

  const isMarketingGrowthRouteValid = React.useCallback((item: MarketingGrowthRecord): boolean => {
    const target = item.routeTarget as string;
    if (
      target === 'home'
      || target === 'search'
      || target === 'promo-apply'
      || target === 'subscription'
      || target === 'subscription-family-get'
      || target === 'entitlements-get'
    ) {
      return true;
    }

    if (target === 'main_category' || target === 'sub_category') {
      return item.routeTargetId ? publishedPromoCategoryIds.has(item.routeTargetId) : false;
    }

    if (target === 'store') return hasStoreTarget(item.routeTargetId);
    if (target === 'store_category') return hasStoreCategoryTarget(item.routeTargetId, item.routeTargetExtra);
    if (target === 'product') return hasProductTarget(item.routeTargetExtra, item.routeTargetId);

    return false;
  }, [hasProductTarget, hasStoreCategoryTarget, hasStoreTarget]);

  const liveMarketingPrograms = React.useMemo<MarketingGrowthRecord[]>(() => [], []);
  const liveMarketingShorts = React.useMemo<MarketingVideoRecord[]>(() => [], []);

  const homeMarketingPromos = React.useMemo<DshHomeGetPromo[]>(() => {
    return marketingBanners
      .filter((item) => item.status === 'published')
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        icon: item.partnerName ? '✨' : '🔥',
        actionType: item.actionType as DshHomeGetPromo['actionType'],
        actionTarget: item.actionTarget,
        actionExtra: item.actionExtra,
        mediaKey: item.mediaKey,
        imageUrl: item.imageUrl,
        accentColor: item.accentColor,
        ctaLabel: item.ctaLabel,
        templateId: item.templateId,
        offerBadgeText: item.offerBadgeText,
        offerBadgeColor: item.offerBadgeColor,
        offerBadgePosition: item.offerBadgePosition as DshHomeGetPromo['offerBadgePosition'],
        partnerLogoUrl: item.partnerLogoUrl,
        partnerLogoPosition: item.partnerLogoPosition as DshHomeGetPromo['partnerLogoPosition'],
        overlayImageUrl: undefined,
        overlayPosition: undefined,
        overlayOpacity: undefined,
        titlePlacement: item.titlePlacement as DshHomeGetPromo['titlePlacement'],
        subtitlePlacement: undefined,
        ctaPlacement: undefined,
        imageFit: item.imageFit as DshHomeGetPromo['imageFit'],
        motionStyle: item.motionStyle as DshHomeGetPromo['motionStyle'],
        autoplayEnabled: item.autoplayEnabled,
        autoplayIntervalMs: item.autoplayIntervalMs,
        pauseOnInteraction: item.pauseOnInteraction,
        publishStage: 'published-preview',
      }));
  }, []);

  const homePromos = React.useMemo<HomePromoRecord[]>(() => {
    return marketingPromos.filter((item) => item.status === 'published');
  }, []);

  return {
    isMarketingGrowthRouteValid,
    liveMarketingPrograms,
    liveMarketingShorts,
    homeMarketingPromos,
    homePromos,
  };
}
