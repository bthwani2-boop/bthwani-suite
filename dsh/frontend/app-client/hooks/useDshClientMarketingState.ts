import React from 'react';
import { publishedPromoCategoryIds } from '../dsh-client.navigation-bridge';
import type { DshHomeGetPromo } from '../contracts/dsh-home-types';
import type { MarketingGrowthRecord } from '../../data/marketing.preview-data';

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

    if (target === 'store') {
      return hasStoreTarget(item.routeTargetId);
    }

    if (target === 'store_category') {
      return hasStoreCategoryTarget(item.routeTargetId, item.routeTargetExtra);
    }

    if (target === 'product') {
      return hasProductTarget(item.routeTargetExtra, item.routeTargetId);
    }

    return false;
  }, [hasProductTarget, hasStoreCategoryTarget, hasStoreTarget]);

  // Marketing data will come from GET /marketing/promos API — empty until endpoint is built.
  const liveMarketingPrograms = React.useMemo<MarketingGrowthRecord[]>(() => [], []);

  const liveMarketingShorts = React.useMemo(
    () => liveMarketingPrograms
      .filter((item) => item.family === 'shorts')
      .filter(isMarketingGrowthRouteValid),
    [isMarketingGrowthRouteValid, liveMarketingPrograms],
  );

  const homeMarketingPromos = React.useMemo<DshHomeGetPromo[]>(() => [], []);
  const homePromos = React.useMemo(() => [], []);

  return {
    isMarketingGrowthRouteValid,
    liveMarketingPrograms,
    liveMarketingShorts,
    homeMarketingPromos,
    homePromos,
  };
}
