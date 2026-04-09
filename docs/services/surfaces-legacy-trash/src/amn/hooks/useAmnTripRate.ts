/**
 * useAmnTripRate - Hook for AMN Trip Rate screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildAmnTripRateMock } from '../fixtures/tripRate';

// ============================================
// Types
// ============================================

export interface AmnTripRateData {
  id: string;
  driverName: string;
  pickupLocation: string;
  destination: string;
  date: string;
}

export interface UseAmnTripRateResult {
  trip: AmnTripRateData | null;
  isLoading: boolean;
  error: Error | null;
  submitRating: (rating: number, comment?: string) => Promise<boolean>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useAmnTripRate(tripId: string): UseAmnTripRateResult {
  const { t } = useI18n();
  
  const [trip, setTrip] = useState<AmnTripRateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!tripId) {
      setError(new Error('Trip ID is required'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildAmnTripRateMock(t, tripId);
        setTrip(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t, tripId]);

  const submitRating = useCallback(async (rating: number, comment?: string): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to submit rating'));
      return false;
    }
  }, [tripId]);

  useEffect(() => {
    fetchData();
  }, [tripId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    trip,
    isLoading,
    error,
    submitRating,
  };
}
