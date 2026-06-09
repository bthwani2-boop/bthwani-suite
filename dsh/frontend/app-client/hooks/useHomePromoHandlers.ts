import * as React from 'react';
import type {
  DshHomeCategory,
  DshHomeGetPromo,
  DiscoveryFilter,
} from '../contracts/dsh-home-types';
import { resolvePreviewColor } from '../../shared/dsh-preview-color';
import { resolveHomeCategoryContext } from '../shared/home-promo-mappers';

type UseHomePromoHandlersParams = {
  categoryItems: DshHomeCategory[];
  promos?: DshHomeGetPromo[];
  activePromoIndex?: number;
  resolveBannerImageSource?: (imageUrl?: string) => any;
  setActiveCategoryId: (id: string) => void;
  setActiveSubcategoryId: (id: string | null) => void;
  setActiveFilter: (filter: DiscoveryFilter) => void;
  setInlineSearchVisible: (visible: boolean) => void;
  onPromoClick?: (id: string) => void;
  onPromoImpression?: (id: string) => void;
  onOpenSheinInfo?: () => void;
  onOpenStore?: (storeId: string) => void;
  onOpenDiscovery?: () => void;
  onOpenList?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenBenefits?: (screenId?: string) => void;
  onOpenProduct?: (storeId: string, itemId: string) => void;
  onOpenSearch?: () => void;
  onOpenStoreCategory?: (storeId: string, categoryId: string) => void;
};

type UseHomePromoHandlersResult = {
  activePromo: any;
  bannerItems: any[];
  resolveBannerPress: (promo: DshHomeGetPromo) => () => void;
  promoImpressionIdsRef: React.MutableRefObject<Set<string>>;
  tickerAction?: () => void;
};

/**
 * Encapsulates promo banner press routing logic extracted from DshHomeGetScreen.
 * Pure logic hook — no JSX.
 * Receives all navigation callbacks as params for full behavioral parity.
 */
export function useHomePromoHandlers({
  categoryItems,
  promos,
  activePromoIndex = 0,
  resolveBannerImageSource,
  setActiveCategoryId,
  setActiveSubcategoryId,
  setActiveFilter,
  setInlineSearchVisible,
  onPromoClick,
  onPromoImpression,
  onOpenSheinInfo,
  onOpenStore,
  onOpenDiscovery,
  onOpenList,
  onOpenOrders,
  onOpenTracking,
  onOpenBenefits,
  onOpenProduct,
  onOpenSearch,
  onOpenStoreCategory,
}: UseHomePromoHandlersParams): UseHomePromoHandlersResult {
  const promoImpressionIdsRef = React.useRef<Set<string>>(new Set());

  const resolveBannerPress = React.useCallback(
    (promo: DshHomeGetPromo) => () => {
      if (promo.id) {
        onPromoClick?.(promo.id);
      }

      if (promo.actionType === 'main_category' || promo.actionType === 'sub_category') {
        const nextHomeContext = resolveHomeCategoryContext(categoryItems, promo.actionTarget);

        if (nextHomeContext) {
          setActiveCategoryId(nextHomeContext.categoryId);
          setActiveSubcategoryId(nextHomeContext.subcategoryId);
          return;
        }

        if (promo.actionTarget === 'shein' && onOpenSheinInfo) {
          onOpenSheinInfo();
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      if (promo.actionType === 'store') {
        if (promo.actionTarget && onOpenStore) {
          onOpenStore(promo.actionTarget);
          return;
        }

        if (onOpenDiscovery) {
          onOpenDiscovery();
          return;
        }

        setInlineSearchVisible(true);
        return;
      }

      if (promo.actionType === 'store_category') {
        if (promo.actionTarget && promo.actionExtra && onOpenStoreCategory) {
          onOpenStoreCategory(promo.actionTarget, promo.actionExtra);
          return;
        }

        if (promo.actionTarget && onOpenStore) {
          onOpenStore(promo.actionTarget);
          return;
        }

        if (onOpenDiscovery) {
          onOpenDiscovery();
          return;
        }

        onOpenList?.();
        return;
      }

      if (promo.actionType === 'product') {
        if (promo.actionExtra && promo.actionTarget && onOpenProduct) {
          onOpenProduct(promo.actionExtra, promo.actionTarget);
          return;
        }

        if (promo.actionExtra && onOpenStore) {
          onOpenStore(promo.actionExtra);
          return;
        }

        setInlineSearchVisible(true);
        return;
      }

      if (promo.actionType === 'subscription') {
        if (onOpenBenefits) {
          onOpenBenefits(promo.actionTarget);
          return;
        }
        onOpenDiscovery?.();
        return;
      }

      if (promo.actionType === 'external') {
        if (promo.actionTarget === 'home') {
          setActiveCategoryId('all');
          setActiveSubcategoryId(null);
          setActiveFilter('all');
          return;
        }

        if (promo.actionTarget === 'stores' || promo.actionTarget === 'DshStoresList') {
          onOpenList?.();
          return;
        }

        if (promo.actionTarget === 'offers') {
          if (promo.actionExtra && onOpenStore) {
            onOpenStore(promo.actionExtra);
            return;
          }

          setActiveFilter('offers');
          onOpenDiscovery?.();
          return;
        }

        if (promo.actionTarget === 'orders-list' || promo.actionTarget === 'orders') {
          onOpenOrders?.();
          return;
        }

        if (promo.actionTarget === 'tracking') {
          onOpenTracking?.();
          return;
        }

        if (promo.actionTarget === 'entitlements-get' || promo.actionTarget === 'loyalty') {
          onOpenBenefits?.('entitlements-get');
          return;
        }

        if (promo.actionTarget === 'campaign') {
          onOpenDiscovery?.();
          return;
        }

        onOpenDiscovery?.();
        return;
      }

      // Fallback for unknown action types
      onOpenDiscovery?.();
    },
    [
      categoryItems,
      onOpenBenefits,
      onOpenDiscovery,
      onOpenList,
      onOpenOrders,
      onOpenProduct,
      onOpenSearch,
      onOpenSheinInfo,
      onOpenStore,
      onOpenStoreCategory,
      onOpenTracking,
      onPromoClick,
      setActiveCategoryId,
      setActiveFilter,
      setActiveSubcategoryId,
      setInlineSearchVisible,
    ],
  );

  const bannerItems = React.useMemo(() => (
    (promos ?? []).map((promo) => ({
      id: promo.id,
      title: promo.title,
      subtitle: promo.subtitle,
      badge: promo.offerBadgeText,
      cta: promo.ctaLabel,
      image: resolveBannerImageSource?.(promo.imageUrl ?? promo.mediaKey),
      accentColor: promo.accentColor ? resolvePreviewColor(promo.accentColor) : undefined,
      onPress: () => resolveBannerPress(promo)(),
    }))
  ), [promos, resolveBannerImageSource, resolveBannerPress]);

  const activePromo = bannerItems.length ? bannerItems[activePromoIndex % bannerItems.length] ?? null : null;
  const tickerAction = activePromo ? activePromo.onPress : undefined;

  React.useEffect(() => {
    if (!activePromo?.id || !onPromoImpression) return;
    if (promoImpressionIdsRef.current.has(activePromo.id)) return;
    promoImpressionIdsRef.current.add(activePromo.id);
    onPromoImpression(activePromo.id);
  }, [activePromo?.id, onPromoImpression, bannerItems.length]);

  return { activePromo, bannerItems, resolveBannerPress, promoImpressionIdsRef, tickerAction };
}
