/**
 * useEsfRequestCancel — load request + cancel via api-host ESF adapter.
 */

import { useState, useEffect, useCallback } from 'react';
import { getEsfRestAdapter } from '../data/esfRestSingleton';
import { assertEsfSuccess, mapRequestRowToCancelDetail, type BackendRequestRow } from '../data/esfDtoMappers';
import type { EsfRequestCancelDetail } from '../uiTypes';

export type { EsfRequestCancelDetail };

export interface UseEsfRequestCancelResult {
  request: EsfRequestCancelDetail | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  cancelRequest: (reason?: string) => Promise<boolean>;
}

export function useEsfRequestCancel(requestId: string): UseEsfRequestCancelResult {
  const [request, setRequest] = useState<EsfRequestCancelDetail | null>(null);
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
        setRequest(mapRequestRowToCancelDetail(data as BackendRequestRow));
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [requestId]
  );

  const cancelRequest = useCallback(
    async (reason?: string): Promise<boolean> => {
      try {
        const adapter = getEsfRestAdapter();
        const raw = await adapter.requestCancel(requestId, { reason });
        assertEsfSuccess(raw);
        await fetchData(true);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to cancel request'));
        return false;
      }
    },
    [requestId, fetchData]
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
    cancelRequest,
  };
}
