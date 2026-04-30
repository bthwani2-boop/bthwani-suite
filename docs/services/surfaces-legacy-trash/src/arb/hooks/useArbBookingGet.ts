/**
 * useArbBookingGet - Hook for ARB Booking Detail screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildArbBookingGetMock, type ArbBookingDetail } from '../fixtures/bookingGet';

// ============================================
// Types
// ============================================

export interface UseArbBookingGetResult {
  booking: ArbBookingDetail | null;
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

export function useArbBookingGet(bookingId: string): UseArbBookingGetResult {
  const { t } = useI18n();
  
  const [booking, setBooking] = useState<ArbBookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!bookingId) {
      setError(new Error('Booking ID is required'));
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
        const data = buildArbBookingGetMock(t, bookingId);
        setBooking(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, bookingId]);

  useEffect(() => {
    fetchData();
  }, [bookingId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    booking,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
