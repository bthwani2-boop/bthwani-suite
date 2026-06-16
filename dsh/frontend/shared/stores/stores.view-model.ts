import React from 'react';
import { Share } from 'react-native';
import {
  resolveDshDiscoveryStoresRuntimeConfig,
  isDshDiscoveryStoresOfflineError,
  createDshDiscoveryStoresClient,
  type DshGetDiscoveryStoreResponse,
} from './stores.api';
import { createDshProductApiHttpClient, resolveDshProductApiBaseUrl } from '../products/dsh-product-api.transport';
import {
  mapProductRecordToItem,
  buildStoreSearchCategories,
  getAllDeliveryModes,
  normalizeDisplayText,
  resolveStoreOperationalState,
} from './stores.adapters';
import type { DshRoute } from '../checkout/dsh-client-binding.contracts';
import type { DshFulfillmentDeliveryMode } from '../delivery';
import type { DshStoreSearchCategory } from './stores.adapters';
import type { DshDiscoveryStore, DshCanonicalStoreCard } from './stores.presentation';
import type { DshStoreMenuItem } from '../products';
import { getDshFulfillmentDeliveryModeMeta } from '../cart';
import { canRenderInClientSurface } from '../../app-partner/domain/partner.workflow';
import { getDshClientStateMeta } from '../orders/orders.client-state';
import { resolveDshRuntimeImageSource } from '../media/resolve-runtime-image-source';
import { resolveDshStoreClientVisibility } from '../stores/dsh-client-visibility.model';

// ─── useDshClientStoreState.ts consolidations ─────────────────────────────────

type UseDshClientStoreStateOptions = {
  route: DshRoute;
  clientVisibleDiscoveryStores: DshDiscoveryStore[];
};

export function useDshClientStoreState({
  route,
  clientVisibleDiscoveryStores,
}: UseDshClientStoreStateOptions) {
  const [activeStoreId, setActiveStoreId] = React.useState<string>('store-1001');
  const [activeStoreDetail, setActiveStoreDetail] = React.useState<DshGetDiscoveryStoreResponse | null>(null);
  const [storeDetailState, setStoreDetailState] = React.useState<'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'not-found'>('loading');
  const [activeStoreItemsState, setActiveStoreItemsState] = React.useState<DshStoreMenuItem[]>([]);
  const [activeCanonicalStoreId, setActiveCanonicalStoreId] = React.useState<string | undefined>('store-1001');
  const [activeCanonicalProductId, setActiveCanonicalProductId] = React.useState<string | undefined>(undefined);
  const [selectedItemId, setSelectedItemId] = React.useState<string>('');
  const [favoriteOverrides, setFavoriteOverrides] = React.useState<Record<string, boolean>>({});
  const [itemsQuery, setItemsQuery] = React.useState('');
  const [itemsCategory, setItemsCategory] = React.useState('all');

  const [fetchedLimit, setFetchedLimit] = React.useState<number>(0);
  const [fetchedStoreId, setFetchedStoreId] = React.useState<string>('');

  const activeStore = React.useMemo(
    () => clientVisibleDiscoveryStores.find((store) => store.id === activeStoreId) ?? clientVisibleDiscoveryStores[0],
    [activeStoreId, clientVisibleDiscoveryStores],
  );

  const targetLimit = React.useMemo(() => {
    const isFullView = route === 'store-items' || itemsQuery.trim() !== '' || itemsCategory !== 'all';
    return isFullView ? 100 : 15;
  }, [route, itemsQuery, itemsCategory]);

  const fetchStoreDetail = React.useCallback((
    storeId: string,
    _store: unknown,
    limit: number = 15,
  ) => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) {
      setStoreDetailState('offline');
      return () => {};
    }

    setStoreDetailState('loading');
    let cancelled = false;

    // Use runtime configs to build a fresh runtime client instance
    const client = createDshDiscoveryStoresClient(config);
    const productBaseUrl = resolveDshProductApiBaseUrl();
    const prodClient = createDshProductApiHttpClient(productBaseUrl);

    Promise.all([
      client.getDiscoveryStore(storeId),
      prodClient.listProducts(storeId, { limit })
    ]).then(([storeResp, productsResp]) => {
      if (cancelled) return;
      setActiveStoreDetail(storeResp);

      const mappedItems = (productsResp.products || []).map(mapProductRecordToItem);

      setActiveStoreItemsState(mappedItems);
      setStoreDetailState('ready');
      setFetchedLimit(limit);
      setFetchedStoreId(storeId);
    }).catch((err) => {
      if (cancelled) return;
      let detailErrorState: 'offline' | 'not-found' | 'error' = 'error';
      if (isDshDiscoveryStoresOfflineError(err) || (typeof err === 'object' && err !== null && (err as any).kind === 'offline')) {
        detailErrorState = 'offline';
      } else if (typeof err === 'object' && err !== null && (err as any).kind === 'http' && (err as any).status === 404) {
        detailErrorState = 'not-found';
      }
      setStoreDetailState(detailErrorState);
    });

    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (route !== 'store-get' && route !== 'store-items') return undefined;
    if (!activeStoreId) return undefined;

    const needsFetch = activeStoreId !== fetchedStoreId || targetLimit > fetchedLimit;
    if (!needsFetch) return undefined;

    return fetchStoreDetail(activeStoreId, activeStore, targetLimit);
  }, [activeStoreId, route, activeStore, targetLimit, fetchedLimit, fetchedStoreId, fetchStoreDetail]);

  return {
    activeStoreId,
    setActiveStoreId,
    activeStoreDetail,
    setActiveStoreDetail,
    storeDetailState,
    setStoreDetailState,
    activeStoreItemsState,
    setActiveStoreItemsState,
    activeCanonicalStoreId,
    setActiveCanonicalStoreId,
    activeCanonicalProductId,
    setActiveCanonicalProductId,
    selectedItemId,
    setSelectedItemId,
    favoriteOverrides,
    setFavoriteOverrides,
    itemsQuery,
    setItemsQuery,
    itemsCategory,
    setItemsCategory,
    activeStore,
    fetchStoreDetail,
  };
}

// ─── useStoreDerivedItems.ts consolidations ───────────────────────────────────

type StoreDeliveryModeOption = {
  id: DshFulfillmentDeliveryMode;
  label: string;
  icon: string;
};

type UseStoreDerivedItemsParams = {
  menuItems?: DshStoreMenuItem[];
  storeCategories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
  storeDeliveryModes?: Array<{ id: DshFulfillmentDeliveryMode; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
  favoriteIds: ReadonlySet<string>;
};

type UseStoreDerivedItemsResult = {
  clientVisibleItems: DshStoreMenuItem[];
  categories: DshStoreSearchCategory[];
  deliveryModes: StoreDeliveryModeOption[];
};

export function useStoreDerivedItems({
  menuItems,
  storeCategories,
  storeDeliveryModes,
  favoriteIds,
}: UseStoreDerivedItemsParams): UseStoreDerivedItemsResult {
  const resolvedMenuItems = React.useMemo<DshStoreMenuItem[]>(() => menuItems ?? [], [menuItems]);

  const clientVisibleItems = React.useMemo(
    () => resolvedMenuItems.filter((item) => item.isAvailable !== false && canRenderInClientSurface(item.publishStage, 'product')),
    [resolvedMenuItems],
  );

  const categories = React.useMemo(
    () => buildStoreSearchCategories({ storeCategories, clientVisibleItems, favoriteIds }),
    [clientVisibleItems, favoriteIds, storeCategories],
  );

  const deliveryModes = React.useMemo<StoreDeliveryModeOption[]>(() => {
    if (storeDeliveryModes?.length) {
      return storeDeliveryModes
        .filter((m) => m.isAvailable)
        .map((m) => {
          const meta = getDshFulfillmentDeliveryModeMeta(m.id);
          return { id: m.id, label: meta.label, icon: meta.icon };
        });
    }
    return getAllDeliveryModes();
  }, [storeDeliveryModes]);

  return { clientVisibleItems, categories, deliveryModes };
}

// ─── useStoreShellDerivedState.ts consolidations ──────────────────────────────

type StoreShellStore = {
  name?: string;
  subtitle?: string;
  etaLabel?: string;
  imageUri?: string;
  logoImageUri?: string;
  statusLabel?: string;
  deliveryLabel?: string;
  serviceLabel?: string;
  publishStage?: string;
  deliveryModes?: Array<{ id: string; isAvailable: boolean }>;
} | undefined;

export function useStoreShellDerivedState(
  store: StoreShellStore,
  openImageViewer: (item: DshStoreMenuItem) => void,
  setFavoriteIds: (updater: (prev: ReadonlySet<string>) => Set<string>) => void,
) {
  const storeCoverImageSource = React.useMemo(
    () => (store ? resolveDshRuntimeImageSource(store.imageUri) : undefined),
    [store],
  );
  const storeLogoImageSource = React.useMemo(
    () => (store ? resolveDshRuntimeImageSource(store.logoImageUri) : undefined),
    [store],
  );

  const normalizedStoreName = normalizeDisplayText(store?.name);
  const normalizedStoreSubtitle = normalizeDisplayText(store?.subtitle);
  const normalizedEtaLabel = normalizeDisplayText(store?.etaLabel);

  const operationalState = React.useMemo(
    () => resolveStoreOperationalState(store?.statusLabel ?? '', store?.deliveryLabel, store?.serviceLabel),
    [store?.statusLabel, store?.deliveryLabel, store?.serviceLabel],
  );

  const storeVisibility = React.useMemo(
    () =>
      resolveDshStoreClientVisibility({
        publishStage: store?.publishStage,
        deliveryModesReady: Boolean(store?.deliveryModes?.some((mode) => mode.isAvailable)),
        serviceabilityAvailable: operationalState !== 'area_unserviceable',
        serviceLabel: store?.serviceLabel,
        deliveryLabel: store?.deliveryLabel,
        storeOpen: operationalState === 'store_open',
        inZone: operationalState !== 'area_unserviceable',
      }),
    [operationalState, store?.deliveryLabel, store?.deliveryModes, store?.publishStage, store?.serviceLabel],
  );

  const operationalStateMeta = React.useMemo(() => getDshClientStateMeta(operationalState), [operationalState]);

  const showOperationalNotice = operationalState !== 'store_open';

  const supportActionLabel =
    operationalState === 'area_unserviceable' ? 'تحديث العنوان أو طلب الدعم' : 'طلب الدعم';

  const handleStoreShare = React.useCallback(async () => {
    try {
      await Share.share({ title: normalizedStoreName, message: `${normalizedStoreName} • ${normalizedStoreSubtitle}` });
    } catch {
      // sharing dismissed
    }
  }, [normalizedStoreName, normalizedStoreSubtitle]);

  const openStoreItemPreview = React.useCallback(
    (item?: DshStoreMenuItem | null) => {
      if (item) openImageViewer(item);
    },
    [openImageViewer],
  );

  const handleToggleFavorite = React.useCallback(
    (id: string) => {
      setFavoriteIds((prev: ReadonlySet<string>) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [setFavoriteIds],
  );

  return {
    storeCoverImageSource,
    storeLogoImageSource,
    normalizedStoreName,
    normalizedStoreSubtitle,
    normalizedEtaLabel,
    operationalState,
    storeVisibility,
    operationalStateMeta,
    showOperationalNotice,
    supportActionLabel,
    handleStoreShare,
    openStoreItemPreview,
    handleToggleFavorite,
  };
}
