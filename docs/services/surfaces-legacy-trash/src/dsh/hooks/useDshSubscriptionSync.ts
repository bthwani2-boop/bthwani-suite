/**
 * useDshSubscriptionSync - Hook for DSH Subscription Sync screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshSubscriptionSyncMock, type Subscription } from '../fixtures/subscriptionSync';

export interface UseDshSubscriptionSyncResult {
  subscriptions: Subscription[];
  isLoading: boolean;
  isRefreshing: boolean;
  isSyncing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  syncSubscription: (subscriptionId: string) => Promise<boolean>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshSubscriptionSync(): UseDshSubscriptionSyncResult {
  const { t } = useI18n();
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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
        const data = buildDshSubscriptionSyncMock(t);
        setSubscriptions(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  const syncSubscription = useCallback(async (subscriptionId: string): Promise<boolean> => {
    setIsSyncing(true);
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch {
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    subscriptions,
    isLoading,
    isRefreshing,
    isSyncing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    syncSubscription,
  };
}
