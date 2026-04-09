/**
 * useEsfRequestGet — single request via api-host /esf/requests/:id.
 */

import { useState, useEffect, useCallback } from 'react';
import { getEsfRestAdapter } from '../data/esfRestSingleton';
import { assertEsfSuccess, mapRequestGetToDetail, type BackendRequestRow } from '../data/esfDtoMappers';
import type { EsfRequestDetail } from '../uiTypes';

export type { EsfRequestDetail };

export interface UseEsfRequestGetResult {
  request: EsfRequestDetail | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useEsfRequestGet(requestId: string): UseEsfRequestGetResult {
  const [request, setRequest] = useState<EsfRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!requestId) {
        setError(new Error('Request ID is required'));
        setIsLoading(false);
        return;
      }

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const adapter = getEsfRestAdapter();
        const raw = await adapter.requestGet(requestId);
        const data = assertEsfSuccess(raw);
        setRequest(mapRequestGetToDetail(data as BackendRequestRow));
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [requestId]
  );

  useEffect(() => {
    fetchData();
  }, [requestId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    request,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
