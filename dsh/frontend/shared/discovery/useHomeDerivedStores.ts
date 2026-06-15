import * as React from 'react';
import type { DshHomeCategory, DshHomeGetStore, DiscoveryFilter, StorePagerPage } from './dsh-home-types';
import type { DshPartnerActivationStatus } from '../partner/dsh-partner-activation.model';
import { resolveDshStoreClientVisibility } from '../stores/dsh-client-visibility.model';
import { getHomePromoVisibilityRecord, isMarketingRenderable } from '../marketing/marketing.visibility';
import type { HomePromoRecord } from '../marketing/marketing.types';
import { resolveHomePromoPublishStage } from './home-promo-mappers';
import { resolveHomeStoresForCategory } from './home-search-helpers';
import { resolveDshRuntimeImageSource } from '../media/resolve-runtime-image-source';
import { canRenderInClientSurface } from '../partner/partner.workflow';

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

export type HomeStoreCardEntry = {
  item: {
    id: string;
    name: string;
    subtitle: string | undefined;
    image: ReturnType<typeof resolveDshRuntimeImageSource> | undefined;
    rating: number | null;
    distanceKm: number | null;
    isOpen: boolean;
    supportsPickup: boolean;
    supportsPartnerDelivery: boolean;
    serviceTokens: Array<{ label: string | undefined }>;
    isFavorite: boolean;
    isFollowing: boolean;
    followersCount: number | undefined;
    hasBthwaniPro: boolean | undefined;
    subscriptionPackageChips: string[];
    hasNewProducts: boolean | undefined;
    hasOffer: boolean | undefined;
    offerText: string | undefined;
    pointsMultiplier: number;
    hasCouponAvailable: boolean | undefined;
    locationLabel: string | undefined;
    deliveryTimeLabel: string | undefined;
    isPopular: boolean | undefined;
    logoImage: ReturnType<typeof resolveDshRuntimeImageSource> | undefined;
  };
  storeId: string;
  baseFavorite: boolean | undefined;
};

export type UseHomeDerivedStoresResult = {
  resolvedStores: DshHomeGetStore[];
  storePagerItems: StorePagerPage[];
  activeStorePage: StorePagerPage | null;
  activeHomeStoreCards: HomeStoreCardEntry[];
  resolveTargetPartnerStatus: (targetType: string, targetId?: string) => DshPartnerActivationStatus | undefined;
  resolvedHomePromos: HomePromoRecord[];
};

function resolveDshHomeStoreImageSource(imageUri?: string, publishStage?: string): ReturnType<typeof resolveDshRuntimeImageSource> | undefined {
  if (!canRenderInClientSurface(publishStage, 'store')) return undefined;
  return resolveDshRuntimeImageSource(imageUri);
}

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
    () => storesWithVisibility.filter(({ clientVisibility }) => clientVisibility.visible).map(({ store }) => store),
    [storesWithVisibility],
  );

  const storeVisibilityById = React.useMemo(
    () => new Map<string, ClientVisibility>(storesWithVisibility.map(({ store, clientVisibility }) => [store.id, clientVisibility])),
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
      (homePromos ?? []).filter((promo) => {
        const visibility = getHomePromoVisibilityRecord(promo, {
          targetSurface: 'home',
          partnerStatus: promo.targetType ? resolveTargetPartnerStatus(promo.targetType, promo.targetId) : undefined,
        });
        return isMarketingRenderable(visibility) && canRenderInClientSurface(resolveHomePromoPublishStage(promo.status), 'promo');
      }),
    [homePromos, resolveTargetPartnerStatus],
  );

  const categoryPageIds = React.useMemo(() => ['all', ...resolvedCategories.map((c) => c.id)], [resolvedCategories]);

  const resolveStoresForCategory = React.useCallback(
    (categoryId: string) =>
      resolveHomeStoresForCategory({ categoryId, stores: resolvedStores, activeFilter, favoriteToggles, query: debouncedInlineSearchQuery }),
    [activeFilter, favoriteToggles, debouncedInlineSearchQuery, resolvedStores],
  );

  const storePagerItems = React.useMemo<StorePagerPage[]>(
    () =>
      categoryPageIds.map((categoryId) => {
        const category = resolvedCategories.find((entry) => entry.id === categoryId);
        const renderMode = category?.renderMode ?? 'stores';
        return { categoryId, renderMode, stores: renderMode === 'manual-order' ? [] : resolveStoresForCategory(categoryId) };
      }),
    [categoryPageIds, resolvedCategories, resolveStoresForCategory],
  );

  const activeStorePage = React.useMemo(
    () => storePagerItems.find((page) => page.categoryId === activeCategoryId) ?? storePagerItems[0] ?? null,
    [activeCategoryId, storePagerItems],
  );

  const activeHomeStoreCards = React.useMemo<HomeStoreCardEntry[]>(() => {
    if (!activeStorePage?.stores.length) return [];
    return activeStorePage.stores.map((store, index) => {
      const sm = store.commercialSourceMap;
      const isOfferBlocked = sm?.['offerLabel']?.conflictSeverity === 'blocker';
      const isProBlocked = sm?.['hasBthwaniPro']?.conflictSeverity === 'blocker';
      const isCouponBlocked = sm?.['hasCouponAvailable']?.conflictSeverity === 'blocker';
      const isPriceMatchBlocked = sm?.['priceMatchLabel']?.conflictSeverity === 'blocker';
      const isNewProductsBlocked = sm?.['hasNewProducts']?.conflictSeverity === 'blocker' || sm?.['new-product-leak']?.conflictSeverity === 'blocker';
      return {
        item: {
          id: store.id,
          name: store.name,
          subtitle: store.address,
          image: resolveDshHomeStoreImageSource(store.imageUri ?? store.mediaKey, store.publishStage),
          rating: store.rating ?? null,
          distanceKm: Number.parseFloat((store.distanceLabel || '').replace(/[^\d.]/g, '')) || null,
          isOpen: store.statusTone === 'open',
          supportsPickup: sm?.['supportsPickup']?.conflictSeverity !== 'blocker',
          supportsPartnerDelivery: sm?.['supportsPartnerDelivery']?.conflictSeverity !== 'blocker',
          serviceTokens: [{ label: store.deliveryLabel }, { label: isPriceMatchBlocked ? undefined : store.serviceLabel }].filter((token) => token.label),
          isFavorite: favoriteToggles[store.id] ?? store.isFavorite,
          isFollowing: followToggles[store.id] ?? store.isFollowing,
          followersCount: followCounts[store.id] ?? store.followerCount,
          hasBthwaniPro: isProBlocked ? false : store.hasBthwaniPro,
          subscriptionPackageChips: isProBlocked ? [] : (store.subscriptionPackageChips ?? [store.deliveryLabel, store.serviceLabel].filter(Boolean) as string[]),
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

  return { resolvedStores, storePagerItems, activeStorePage, activeHomeStoreCards, resolveTargetPartnerStatus, resolvedHomePromos };
}
