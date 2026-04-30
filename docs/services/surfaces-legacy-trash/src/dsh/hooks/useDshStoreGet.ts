/**
 * useDshStoreGet - Hook for DSH Store Detail screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshStoreGetMock, type StoreDetail, type MenuItem } from '../fixtures/storeGet';

export interface UseDshStoreGetResult {
  store: StoreDetail | null;
  menuItems: MenuItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshStoreGet(storeId: string): UseDshStoreGetResult {
  const { t } = useI18n();
  
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildDshStoreGetMock(t);
        setStore(data.store);
        setMenuItems(data.menuItems);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, storeId]);

  useEffect(() => {
    fetchData();
  }, [storeId]);

  return {
    store,
    menuItems,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
