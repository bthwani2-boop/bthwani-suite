import * as React from 'react';
import type {
  DshHomeCategory,
  DshHomeGetStore,
  DiscoveryFilter,
  StorePagerPage,
} from '../contracts/dsh-home-types';
import type { HomePromoRecord } from '../../shared/promo.preview-store';
import type { DshPartnerActivationStatus } from '../../shared/dsh-partner-activation.model';
import { resolveDshStoreClientVisibility } from '../../shared/dsh-client-visibility.model';
import {
  getHomePromoVisibilityRecord,
  isMarketingRenderable,
} from '../../shared/marketing-visibility.contract';
import { resolveHomePromoPublishStage } from '../shared/home-promo-mappers';
import { resolveHomeStoresForCategory } from '../shared/home-search-helpers';
import { getPublishedHomePromos } from '../../shared/promo.preview-store';
import { canRenderInClientSurface } from '../../shared/workflow';

type UseHomeDerivedStoresParams = {
  stores?: DshHomeGetStore[];
  homePromos?: HomePromoRecord[];
  categories?: DshHomeCategory[];
  activeCategoryId: string;
  activeFilter: DiscoveryFilter;
  favoriteToggles: Record<string, boolean>;
  debouncedInlineSearchQuery: string;
};

type ClientVisibility = ReturnType<typeof resolveDshStoreClientVisibility>;

type UseHomeDerivedStoresResult = {
  resolvedStores: DshHomeGetStore[];
  storePagerItems: StorePagerPage[];
  activeStorePage: StorePagerPage | null;
  resolveTargetPartnerStatus: (targetType: string, targetId?: string) => DshPartnerActivationStatus | undefined;
  resolvedHomePromos: HomePromoRecord[];
};

/**
 * Encapsulates all store-list and promo derivation logic from DshHomeGetScreen.
 * Pure data hook — no JSX, no react-native UI imports.
 * Receives state as params; caller holds useHomeState() to avoid duplicate instances.
 */
export function useHomeDerivedStores({
  stores,
  homePromos,
  categories,
  activeCategoryId,
  activeFilter,
  favoriteToggles,
  debouncedInlineSearchQuery,
}: UseHomeDerivedStoresParams): UseHomeDerivedStoresResult {
  const resolvedCategories = React.useMemo(() => categories ?? [], [categories]);

  // Pair each store with its computed client visibility
  const storesWithVisibility = React.useMemo(
    () =>
      (stores ?? []).map((store) => ({
        store,
        clientVisibility: resolveDshStoreClientVisibility({
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

  return {
    resolvedStores,
    storePagerItems,
    activeStorePage,
    resolveTargetPartnerStatus,
    resolvedHomePromos,
  };
}
