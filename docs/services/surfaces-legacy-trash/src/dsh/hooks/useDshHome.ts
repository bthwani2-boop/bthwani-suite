/**
 * useDshHome - Hook for DSH Home screen data
 */

import { useState, useEffect, useCallback } from 'react';
import type { DshHomeDataMock } from '../data/dshHomeTypes';
import { getDshHomeRuntime } from '../data/dshHomeRepository';

export interface UseDshHomeResult {
  data: DshHomeDataMock | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;

export function useDshHome(): UseDshHomeResult {
  const [data, setData] = useState<DshHomeDataMock | null>(null);
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
      await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
      const homeData = await getDshHomeRuntime();
      setData(homeData);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
