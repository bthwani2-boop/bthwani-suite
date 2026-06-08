import React from 'react';
import {
  getLiveMarketingGrowthItems,
  getPublishedMarketingHomePromos,
  getPublishedHomePromos,
  type MarketingGrowthRecord,
} from '../../data/marketing.preview-data';
import { publishedPromoCategoryIds } from '../dsh-client.navigation-bridge';
import type { DshHomeGetPromo } from './screens/HomeScreen';

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
    if (
      item.routeTarget === 'home'
      || item.routeTarget === 'search'
      || item.routeTarget === 'promo-apply'
      || item.routeTarget === 'subscription'
      || item.routeTarget === 'subscription-family-get'
      || item.routeTarget === 'entitlements-get'
    ) {
      return true;
    }

    if (item.routeTarget === 'main_category' || item.routeTarget === 'sub_category') {
      return item.routeTargetId ? publishedPromoCategoryIds.has(item.routeTargetId) : false;
    }

    if (item.routeTarget === 'store') {
      return hasStoreTarget(item.routeTargetId);
    }

    if (item.routeTarget === 'store_category') {
      return hasStoreCategoryTarget(item.routeTargetId, item.routeTargetExtra);
    }

    if (item.routeTarget === 'product') {
      return hasProductTarget(item.routeTargetExtra, item.routeTargetId);
    }

    return false;
  }, [hasProductTarget, hasStoreCategoryTarget, hasStoreTarget]);

  const liveMarketingPrograms = React.useMemo(() => getLiveMarketingGrowthItems('client'), []);

  const liveMarketingShorts = React.useMemo(
    () => liveMarketingPrograms
      .filter((item) => item.family === 'shorts')
      .filter(isMarketingGrowthRouteValid),
    [isMarketingGrowthRouteValid, liveMarketingPrograms],
  );

  const homeMarketingPromos = React.useMemo(() => getPublishedMarketingHomePromos('home') as DshHomeGetPromo[], []);
  const homePromos = React.useMemo(() => getPublishedHomePromos(), []);

  return {
    isMarketingGrowthRouteValid,
    liveMarketingPrograms,
    liveMarketingShorts,
    homeMarketingPromos,
    homePromos,
  };
}
