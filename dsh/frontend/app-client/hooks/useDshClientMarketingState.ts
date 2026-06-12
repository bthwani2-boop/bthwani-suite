import React from 'react';
import { publishedPromoCategoryIds } from '../dsh-client.navigation-bridge';
import type { DshHomeGetPromo } from '../contracts/dsh-home-types';
import type {
  MarketingGrowthRecord,
  MarketingVideoRecord,
  HomePromoRecord,
} from '../../data/marketing.preview-data';

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

  const liveMarketingPrograms = React.useMemo<MarketingGrowthRecord[]>(() => [], []);
  const liveMarketingShorts = React.useMemo<MarketingVideoRecord[]>(() => [], []);
  const homeMarketingPromos = React.useMemo<DshHomeGetPromo[]>(() => [], []);
  const homePromos = React.useMemo<HomePromoRecord[]>(() => [], []);

  return {
    isMarketingGrowthRouteValid,
    liveMarketingPrograms,
    liveMarketingShorts,
    homeMarketingPromos,
    homePromos,
  };
}
