/**
 * useAmnTripsList - Hook for AMN Trips List screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildAmnTripsListMock, type AmnTripListItem } from '../fixtures/tripsList';

// ============================================
// Types
// ============================================

export interface UseAmnTripsListOptions {
  status?: 'all' | 'completed' | 'in_progress' | 'cancelled';
}

export interface UseAmnTripsListResult {
  trips: AmnTripListItem[];
  totalCount: number;
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

export function useAmnTripsList(options: UseAmnTripsListOptions = {}): UseAmnTripsListResult {
  const { status = 'all' } = options;
  const { t } = useI18n();
  
  const [trips, setTrips] = useState<AmnTripListItem[]>([]);
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
        
        let allTrips = buildAmnTripsListMock(t);
        
        if (status !== 'all') {
          allTrips = allTrips.filter(trip => trip.status === status);
        }
        
        setTrips(allTrips);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, status]);

  useEffect(() => {
    fetchData();
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    trips,
    totalCount: trips.length,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
