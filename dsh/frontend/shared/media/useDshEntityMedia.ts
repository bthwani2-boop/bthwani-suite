// DSH Entity Media Hook
// Fetches media assets for a given entity (product, store, etc.) from the DSH Media API.
// Authority: dsh/frontend/shared/media — no JSX, no ui-kit, no Tamagui.

import React from 'react';
import {
  createDshMediaApiHttpClient,
  type DshMediaAsset,
  type DshMediaOwnerType,
} from './dsh-media-api.client';

const EMPTY: readonly DshMediaAsset[] = Object.freeze([]);

const baseUrl =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DSH_API_BASE_URL) ||
  (typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>)['__DSH_API_BASE_URL__'] as string) ||
  '';

const client = baseUrl ? createDshMediaApiHttpClient(baseUrl) : null;

export function useDshEntityMedia(
  ownerType: DshMediaOwnerType,
  ownerId: string | null | undefined,
): { assets: readonly DshMediaAsset[]; loading: boolean } {
  const [assets, setAssets] = React.useState<readonly DshMediaAsset[]>(EMPTY);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!client || !ownerId) {
      setAssets(EMPTY);
      return;
    }
    let cancelled = false;
    setLoading(true);
    client
      .listMedia({ owner_type: ownerType, owner_id: ownerId, status: 'active' })
      .then((res) => {
        if (!cancelled) setAssets(res.items);
      })
      .catch(() => {
        if (!cancelled) setAssets(EMPTY);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [ownerType, ownerId]);

  return { assets, loading };
}
