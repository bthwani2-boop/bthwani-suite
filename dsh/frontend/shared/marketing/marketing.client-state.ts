import React from 'react';
import { publishedPromoCategoryIds } from '../checkout/dsh-client-binding.contracts';
import type { DshHomeGetPromo } from '../discovery/dsh-home-types';
import type { HomePromoRecord, MarketingGrowthRecord, MarketingVideoRecord, MarketingBannerRecord } from './marketing.types';
import {
  getMarketingBannerItems,
  getHomePromoItems,
  getMarketingVideoItems,
  getCampaignItems,
} from './marketing.preview-state';

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

  const liveMarketingPrograms = React.useMemo<MarketingGrowthRecord[]>(() => {
    return getCampaignItems().filter((item) => item.status === 'published') as unknown as MarketingGrowthRecord[];
  }, []);

  const liveMarketingShorts = React.useMemo<MarketingVideoRecord[]>(() => {
    return getMarketingVideoItems().filter((item) => item.status === 'published');
  }, []);

  const homeMarketingPromos = React.useMemo<DshHomeGetPromo[]>(() => {
    return getMarketingBannerItems()
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
    return getHomePromoItems().filter((item) => item.status === 'published');
  }, []);

  return {
    isMarketingGrowthRouteValid,
    liveMarketingPrograms,
    liveMarketingShorts,
    homeMarketingPromos,
    homePromos,
  };
}
