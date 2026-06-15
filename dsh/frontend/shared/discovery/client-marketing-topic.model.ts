// Canonical location: dsh/frontend/shared/discovery/client-marketing-topic.model.ts
// Authority: dsh/frontend/shared/discovery — client marketing topic model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { useDshClientMarketingModel } from '../marketing/client-marketing.model';

export type ClientMarketingTopicModelProps = {
  clientVisibleDiscoveryStores: any[];
  activeStoreItems: any[];
  homeActions: any;
};

export function useDshClientMarketingTopicModel({
  clientVisibleDiscoveryStores,
  activeStoreItems,
  homeActions,
}: ClientMarketingTopicModelProps) {
  const hasStoreTarget = React.useCallback(
    (storeId?: string): boolean =>
      typeof storeId === 'string' && clientVisibleDiscoveryStores.some((s) => s.id === storeId),
    [clientVisibleDiscoveryStores],
  );

  const hasStoreCategoryTarget = React.useCallback(
    (storeId?: string, categoryId?: string): boolean => {
      if (!hasStoreTarget(storeId) || typeof categoryId !== 'string') return false;
      return activeStoreItems.some((item) => item.categoryId === categoryId);
    },
    [hasStoreTarget, activeStoreItems],
  );

  const hasProductTarget = React.useCallback(
    (storeId?: string, productId?: string): boolean => {
      if (!hasStoreTarget(storeId) || typeof productId !== 'string') return false;
      return activeStoreItems.some((item) => item.id === productId);
    },
    [hasStoreTarget, activeStoreItems],
  );

  const marketingModel = useDshClientMarketingModel({
    hasStoreTarget,
    hasStoreCategoryTarget,
    hasProductTarget,
  });

  const {
    recordMarketingBannerClick,
    recordMarketingBannerImpression,
    recordMarketingGrowthClick,
    recordMarketingGrowthImpression,
  } = homeActions;

  return {
    liveMarketingPrograms: marketingModel.liveMarketingPrograms,
    homeMarketingPromos: marketingModel.homeMarketingPromos,
    homePromos: marketingModel.homePromos,
    liveMarketingShorts: marketingModel.liveMarketingShorts,
    isMarketingGrowthRouteValid: marketingModel.isMarketingGrowthRouteValid,
    recordMarketingBannerClick,
    recordMarketingBannerImpression,
    recordMarketingGrowthClick,
    recordMarketingGrowthImpression,
  };
}
