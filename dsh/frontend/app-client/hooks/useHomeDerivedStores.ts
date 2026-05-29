import * as React from 'react';
import type {
  DshHomeCategory,
  DshHomeGetStore,
  DiscoveryFilter,
  StorePagerPage,
} from '../contracts/dsh-home-types';
import type { HomePromoRecord } from '../../data/marketing.preview-data';
import type { DshPartnerActivationStatus } from '../../shared/dsh-partner-activation.model';
import { resolveDshStoreClientVisibility } from '../../shared/dsh-client-visibility.model';
import {
  getHomePromoVisibilityRecord,
  isMarketingRenderable,
} from '../../shared/marketing-visibility.contract';
import { resolveHomePromoPublishStage } from '../shared/home-promo-mappers';
import { resolveHomeStoresForCategory } from '../shared/home-search-helpers';
import { resolveDshImageSource } from '../shared/resolve-image-source';
import { getPublishedHomePromos } from '../../data/marketing.preview-data';
import { canRenderInClientSurface } from '../../shared/workflow';

type UseHomeDerivedStoresParams = {
  stores?: DshHomeGetStore[];
  homePromos?: HomePromoRecord[];
  categories?: DshHomeCategory[];
  activeCategoryId: string;
  activeFilter: DiscoveryFilter;
  favoriteToggles: Record<string, boolean>;
  followToggles?: Record<string, boolean>;
  followCounts?: Record<string, number>;
  debouncedInlineSearchQuery: string;
};

type ClientVisibility = ReturnType<typeof resolveDshStoreClientVisibility>;

type UseHomeDerivedStoresResult = {
  resolvedStores: DshHomeGetStore[];
  storePagerItems: StorePagerPage[];
  activeStorePage: StorePagerPage | null;
  activeHomeStoreCards: any[];
  resolveTargetPartnerStatus: (targetType: string, targetId?: string) => DshPartnerActivationStatus | undefined;
  resolvedHomePromos: HomePromoRecord[];
};

function resolveDshHomeStoreImageSource(imageUri?: string, publishStage?: string): any {
  if (!canRenderInClientSurface(publishStage, 'store')) {
    return undefined;
  }
  return resolveDshImageSource(imageUri);
}

/**
 * Encapsulates all store-list and promo derivation logic from DshHomeGetScreen.
 * Pure data hook â€” no JSX, no react-native UI imports.
 * Receives state as params; caller holds useHomeState() to avoid duplicate instances.
 */
export function useHomeDerivedStores({
  stores,
  homePromos,
  categories,
  activeCategoryId,
  activeFilter,
  favoriteToggles,
  followToggles = {},
  followCounts = {},
  debouncedInlineSearchQuery,
}: UseHomeDerivedStoresParams): UseHomeDerivedStoresResult {
  const resolvedCategories = React.useMemo(() => categories ?? [], [categories]);

  // Pair each store with its computed client visibility
  const storesWithVisibility = React.useMemo(
    () =>
      (stores ?? []).map((store) => ({
        store,
        clientVisibility: resolveDshStoreClientVisibility({
          storeId: store.id,
          publishStage: store.publishStage,
          supportsPickup: store.supportsPickup,
          supportsPartnerDelivery: store.supportsPartnerDelivery,
          serviceabilityAvailable: store.serviceabilityAvailable,
          catalogPublished: store.catalogPublished,
          serviceLabel: store.serviceLabel,
          deliveryLabel: store.deliveryLabel,
          storeOpen: store.statusTone === 'open',
        }) as ClientVisibility,
      })),
    [stores],
  );

  const resolvedStores = React.useMemo(
    () =>
      storesWithVisibility
        .filter(({ clientVisibility }) => clientVisibility.visible)
        .map(({ store }) => store),
    [storesWithVisibility],
  );

  const storeVisibilityById = React.useMemo(
    () =>
      new Map<string, ClientVisibility>(
        storesWithVisibility.map(({ store, clientVisibility }) => [store.id, clientVisibility]),
      ),
    [storesWithVisibility],
  );

  const resolveTargetPartnerStatus = React.useCallback(
    (targetType: string, targetId?: string): DshPartnerActivationStatus | undefined => {
      if (targetType !== 'store' || !targetId) return undefined;
      return storeVisibilityById.get(targetId)?.activationStatus;
    },
    [storeVisibilityById],
  );

  const resolvedHomePromos = React.useMemo(
    () =>
      (homePromos ?? getPublishedHomePromos()).filter((promo) => {
        const visibility = getHomePromoVisibilityRecord(promo, {
          targetSurface: 'home',
          partnerStatus: resolveTargetPartnerStatus(promo.targetType, promo.targetId),
        });
        return (
          isMarketingRenderable(visibility) &&
          canRenderInClientSurface(resolveHomePromoPublishStage(promo.status), 'promo')
        );
      }),
    [homePromos, resolveTargetPartnerStatus],
  );

  const categoryPageIds = React.useMemo(
    () => ['all', ...resolvedCategories.map((c) => c.id)],
    [resolvedCategories],
  );

  const resolveStoresForCategory = React.useCallback(
    (categoryId: string) =>
      resolveHomeStoresForCategory({
        categoryId,
        stores: resolvedStores,
        activeFilter,
        favoriteToggles,
        query: debouncedInlineSearchQuery,
      }),
    [activeFilter, favoriteToggles, debouncedInlineSearchQuery, resolvedStores],
  );

  const storePagerItems = React.useMemo<StorePagerPage[]>(
    () =>
      categoryPageIds.map((categoryId) => {
        const category = resolvedCategories.find((entry) => entry.id === categoryId);
        const renderMode = category?.renderMode ?? 'stores';
        return {
          categoryId,
          renderMode,
          stores: renderMode === 'manual-order' ? [] : resolveStoresForCategory(categoryId),
        };
      }),
    [categoryPageIds, resolvedCategories, resolveStoresForCategory],
  );

  const activeStorePage = React.useMemo(
    () =>
      storePagerItems.find((page) => page.categoryId === activeCategoryId) ??
      storePagerItems[0] ??
      null,
    [activeCategoryId, storePagerItems],
  );

  const activeHomeStoreCards = React.useMemo(() => {
    if (!activeStorePage?.stores.length) {
      return [];
    }

    return activeStorePage.stores.map((store, index) => {
      const sm = store.commercialSourceMap;
      const isOfferBlocked = sm?.['offerLabel']?.conflictStatus === 'blocker';
      const isProBlocked = sm?.['hasBthwaniPro']?.conflictStatus === 'blocker';
      const isCouponBlocked = sm?.['hasCouponAvailable']?.conflictStatus === 'blocker';
      const isPriceMatchBlocked = sm?.['priceMatchLabel']?.conflictStatus === 'blocker';
      const isNewProductsBlocked = sm?.['hasNewProducts']?.conflictStatus === 'blocker' || sm?.['new-product-leak']?.conflictStatus === 'blocker';

      return {
        item: {
          id: store.id,
          name: store.name,
          subtitle: store.address,
          image: resolveDshHomeStoreImageSource(store.imageUri ?? store.mediaKey, store.publishStage),
          rating: store.rating ?? null,
          distanceKm: Number.parseFloat((store.distanceLabel || '').replace(/[^\d.]/g, '')) || null,
          isOpen: store.statusTone === 'open',
          supportsPickup: sm?.['supportsPickup']?.conflictStatus !== 'blocker',
          supportsPartnerDelivery: sm?.['supportsPartnerDelivery']?.conflictStatus !== 'blocker',
          serviceTokens: [
            { label: store.deliveryLabel },
            { label: isPriceMatchBlocked ? undefined : store.serviceLabel }
          ].filter((token) => token.label),
          isFavorite: favoriteToggles[store.id] ?? store.isFavorite,
          isFollowing: followToggles[store.id] ?? store.isFollowing,
          followersCount: followCounts[store.id] ?? store.followerCount,
          hasBthwaniPro: isProBlocked ? false : store.hasBthwaniPro,
          subscriptionPackageChips: isProBlocked ? [] : (store.subscriptionPackageChips ?? [store.deliveryLabel, store.serviceLabel].filter(Boolean)),
          hasNewProducts: isNewProductsBlocked ? false : store.hasNewProducts,
          hasOffer: isOfferBlocked ? false : store.hasOffer,
          offerText: isOfferBlocked ? undefined : store.offerLabel,
          pointsMultiplier: Number.parseInt((store.multiplierLabel || '').replace(/[^\d]/g, ''), 10) || (index === 2 ? 3 : index === 0 ? 2 : 1),
          hasCouponAvailable: isCouponBlocked ? false : store.hasCouponAvailable,
          locationLabel: store.locationLabel,
          deliveryTimeLabel: store.deliveryTimeLabel,
          isPopular: store.isPopular,
          logoImage: resolveDshHomeStoreImageSource(store.logoImageUri, store.publishStage),
        },
        storeId: store.id,
        baseFavorite: store.isFavorite,
      };
    });
  }, [activeStorePage, favoriteToggles, followCounts, followToggles]);

  return {
    resolvedStores,
    storePagerItems,
    activeStorePage,
    activeHomeStoreCards,
    resolveTargetPartnerStatus,
    resolvedHomePromos,
  };
}
