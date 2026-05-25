import * as React from 'react';
import type { MarketingGrowthRecord } from '../../data/marketing.preview-data';
import type { MarketingVideoRecord } from '../../data/marketing.preview-data';
import { resolveHomeCategoryContext } from '../shared/home-promo-mappers';
import { getMarketingVideoVisibilityRecord, isMarketingRenderable } from '../../shared/marketing-visibility.contract';

export function useHomeVideoHandlers({
  categoryItems,
  approvedVideoShorts,
  resolveTargetPartnerStatus,
  setActiveCategoryId,
  setActiveSubcategoryId,
  setShortsVisible,
  onVideoCtaClick,
  onOpenSheinInfo,
  onOpenList,
  onOpenStore,
  onOpenDiscovery,
  onOpenStoreCategory,
  onOpenProduct,
  onOpenBenefits,
  onOpenSearch,
}: {
  categoryItems: any[];
  approvedVideoShorts: MarketingVideoRecord[];
  resolveTargetPartnerStatus: (type: string, id: string) => any;
  setActiveCategoryId: (id: string) => void;
  setActiveSubcategoryId: (id: string | null) => void;
  setShortsVisible: (v: boolean) => void;
  onVideoCtaClick?: (id: string) => void;
  onOpenSheinInfo?: () => void;
  onOpenList?: () => void;
  onOpenStore?: (id: string) => void;
  onOpenDiscovery?: () => void;
  onOpenStoreCategory?: (sId: string, cId: string) => void;
  onOpenProduct?: (sId: string, pId: string) => void;
  onOpenBenefits?: (id?: string) => void;
  onOpenSearch?: () => void;
}) {
  const resolveVideoCtaPress = React.useCallback(
    (item: MarketingGrowthRecord) => {
      onVideoCtaClick?.(item.id);
      setShortsVisible(false);

      if (item.routeTarget === 'main_category' || item.routeTarget === 'sub_category') {
        const nextHomeContext = resolveHomeCategoryContext(categoryItems, item.routeTargetId);

        if (nextHomeContext) {
          setActiveCategoryId(nextHomeContext.categoryId);
          setActiveSubcategoryId(nextHomeContext.subcategoryId);
          return;
        }

        if (item.routeTargetId === 'shein' && onOpenSheinInfo) {
          onOpenSheinInfo();
          return;
        }

        onOpenList?.();
        return;
      }

      if (item.routeTarget === 'store') {
        if (item.routeTargetId && onOpenStore) {
          onOpenStore(item.routeTargetId);
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (item.routeTarget === 'store_category') {
        if (item.routeTargetId && item.routeTargetExtra && onOpenStoreCategory) {
          onOpenStoreCategory(item.routeTargetId, item.routeTargetExtra);
          return;
        }

        if (item.routeTargetId && onOpenStore) {
          onOpenStore(item.routeTargetId);
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (item.routeTarget === 'product') {
        if (item.routeTargetExtra && item.routeTargetId && onOpenProduct) {
          onOpenProduct(item.routeTargetExtra, item.routeTargetId);
          return;
        }

        if (item.routeTargetExtra && onOpenStore) {
          onOpenStore(item.routeTargetExtra);
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (item.routeTarget === 'subscription' || item.routeTarget === 'subscription-family-get' || item.routeTarget === 'entitlements-get') {
        onOpenBenefits?.(item.routeTarget);
        return;
      }

      if (item.routeTarget === 'search') {
        onOpenSearch?.();
        return;
      }

      if (item.routeTarget === 'promo-apply') {
        onOpenBenefits?.('offers');
        return;
      }

      if (onOpenDiscovery) {
        onOpenDiscovery();
        return;
      }

      onOpenList?.();
    },
    [
      categoryItems,
      onOpenBenefits,
      onOpenDiscovery,
      onOpenList,
      onOpenProduct,
      onOpenSearch,
      onOpenSheinInfo,
      onOpenStore,
      onOpenStoreCategory,
      onVideoCtaClick,
      setActiveCategoryId,
      setActiveSubcategoryId,
      setShortsVisible,
    ]
  );

  const approvedVideoReels = React.useMemo(() => approvedVideoShorts.filter((video) => {
    const visibility = getMarketingVideoVisibilityRecord(video, {
      targetSurface: 'home',
      partnerStatus: resolveTargetPartnerStatus(video.targetType, video.targetId),
    });

    return isMarketingRenderable(visibility);
  }), [approvedVideoShorts, resolveTargetPartnerStatus]);

  return { resolveVideoCtaPress, approvedVideoReels };
}
