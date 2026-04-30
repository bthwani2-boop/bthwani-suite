/**
 * useAmnTripGet - Hook for AMN Trip Detail screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildAmnTripGetMock, type AmnTripDetail } from '../fixtures/tripGet';

// ============================================
// Types
// ============================================

export interface UseAmnTripGetResult {
  trip: AmnTripDetail | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useAmnTripGet(tripId: string): UseAmnTripGetResult {
  const { t } = useI18n();
  
  const [trip, setTrip] = useState<AmnTripDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!tripId) {
      setError(new Error('Trip ID is required'));
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
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildAmnTripGetMock(t, tripId);
        setTrip(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, tripId]);

  useEffect(() => {
    fetchData();
  }, [tripId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    trip,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
