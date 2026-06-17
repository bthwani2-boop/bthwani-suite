import * as React from 'react';
import type { DshHomeCategory } from './dsh-home-types';
import type { DshPartnerActivationStatus } from '../stores/partner/dsh-partner-activation.model';
import { resolveHomeCategoryContext } from './home-promo-mappers';
import { getMarketingVideoVisibilityRecord, isMarketingRenderable } from '../marketing/marketing.visibility';
import type { MarketingVideoRecord } from '../marketing/marketing.types';

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
  categoryItems: DshHomeCategory[];
  approvedVideoShorts: MarketingVideoRecord[];
  resolveTargetPartnerStatus: (type: string, id?: string) => DshPartnerActivationStatus | undefined;
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
    (item: MarketingVideoRecord) => {
      onVideoCtaClick?.(item.id);
      setShortsVisible(false);

      const target = item.targetType as string;

      if (target === 'main_category' || target === 'sub_category') {
        const nextHomeContext = resolveHomeCategoryContext(categoryItems, item.targetId);
        if (nextHomeContext) {
          setActiveCategoryId(nextHomeContext.categoryId);
          setActiveSubcategoryId(nextHomeContext.subcategoryId);
          return;
        }
        if (item.targetId === 'shein' && onOpenSheinInfo) {
          onOpenSheinInfo();
          return;
        }
        onOpenList?.();
        return;
      }

      if (target === 'store') {
        if (item.targetId && onOpenStore) {
          onOpenStore(item.targetId);
          return;
        }
        onOpenDiscovery?.();
        return;
      }

      if (target === 'store_category') {
        if (item.targetId && item.targetExtra && onOpenStoreCategory) {
          onOpenStoreCategory(item.targetId, item.targetExtra);
          return;
        }
        if (item.targetId && onOpenStore) {
          onOpenStore(item.targetId);
          return;
        }
        onOpenDiscovery?.();
        return;
      }

      if (target === 'product') {
        if (item.targetExtra && item.targetId && onOpenProduct) {
          onOpenProduct(item.targetExtra, item.targetId);
          return;
        }
        if (item.targetExtra && onOpenStore) {
          onOpenStore(item.targetExtra);
          return;
        }
        onOpenDiscovery?.();
        return;
      }

      if (target === 'subscription' || target === 'subscription-family-get' || target === 'entitlements-get') {
        onOpenBenefits?.(target);
        return;
      }

      if (target === 'search') {
        onOpenSearch?.();
        return;
      }

      if (target === 'promo-apply') {
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
    ],
  );

  const approvedVideoReels = React.useMemo(
    () =>
      approvedVideoShorts.filter((video) => {
        const visibility = getMarketingVideoVisibilityRecord(video, {
          targetSurface: 'home',
          partnerStatus: resolveTargetPartnerStatus(video.targetType, video.targetId),
        });
        return isMarketingRenderable(visibility);
      }),
    [approvedVideoShorts, resolveTargetPartnerStatus],
  );

  return { resolveVideoCtaPress, approvedVideoReels };
}
