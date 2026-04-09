/**
 * useArbBookingsList - Hook for ARB Bookings List screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildArbBookingsListMock, type ArbBookingListItem } from '../fixtures/bookingsList';

// ============================================
// Types
// ============================================

export interface UseArbBookingsListResult {
  bookings: ArbBookingListItem[];
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

export function useArbBookingsList(
  resolveDevMediaUrl?: (path: string) => string
): UseArbBookingsListResult {
  const { t } = useI18n();
  
  const [bookings, setBookings] = useState<ArbBookingListItem[]>([]);
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
        const data = buildArbBookingsListMock(t, resolveDevMediaUrl);
        setBookings(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, resolveDevMediaUrl]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    bookings,
    totalCount: bookings.length,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
