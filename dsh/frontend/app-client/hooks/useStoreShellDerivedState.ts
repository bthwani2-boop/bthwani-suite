import * as React from 'react';
import { Share } from 'react-native';
import { getDshClientStateMeta } from '../../data/client-state.preview-data';
import { resolveDshImageSource } from '../shared/resolve-image-source';
import {
  normalizeDisplayText,
  resolveStoreOperationalState,
} from '../shared/store-formatting';
import { resolveDshStoreClientVisibility } from '../../shared/dsh-client-visibility.model';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';

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
  openImagePreview: (item: DshStoreGetMenuItem) => void,
  setFavoriteIds: (updater: (prev: ReadonlySet<string>) => Set<string>) => void,
) {
  const storeCoverImageSource = React.useMemo(
    () => (store ? resolveDshImageSource(store.imageUri) : undefined),
    [store],
  );
  const storeLogoImageSource = React.useMemo(
    () =>
      store
        ? resolveDshImageSource(store.logoImageUri) || resolveDshImageSource('dsh.brand.logo.v1')
        : undefined,
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
    [
      operationalState,
      store?.deliveryLabel,
      store?.deliveryModes,
      store?.publishStage,
      store?.serviceLabel,
    ],
  );

  const operationalStateMeta = React.useMemo(
    () => getDshClientStateMeta(operationalState),
    [operationalState],
  );

  const showOperationalNotice = operationalState !== 'store_open';

  const supportActionLabel =
    operationalState === 'area_unserviceable' ? 'تحديث العنوان أو طلب الدعم' : 'طلب الدعم';

  const handleStoreShare = React.useCallback(async () => {
    try {
      await Share.share({ title: normalizedStoreName, message: `${normalizedStoreName} • ${normalizedStoreSubtitle}` });
    } catch {
      // sharing may be dismissed without completing the action
    }
  }, [normalizedStoreName, normalizedStoreSubtitle]);

  const openStoreItemPreview = React.useCallback(
    (item?: DshStoreGetMenuItem | null) => {
      if (item) openImagePreview(item);
    },
    [openImagePreview],
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
