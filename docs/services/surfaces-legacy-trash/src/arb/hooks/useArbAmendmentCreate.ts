/**
 * useArbAmendmentCreate - Hook for ARB Amendment Create screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildArbAmendmentCreateMock, type ArbAmendmentCreateBooking } from '../fixtures/amendmentCreate';

// ============================================
// Types
// ============================================

export interface UseArbAmendmentCreateResult {
  booking: ArbAmendmentCreateBooking | null;
  isLoading: boolean;
  error: Error | null;
  submitAmendment: (data: { newCheckIn?: string; newCheckOut?: string; newGuests?: number; reason?: string }) => Promise<boolean>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useArbAmendmentCreate(bookingId: string): UseArbAmendmentCreateResult {
  const { t } = useI18n();
  
  const [booking, setBooking] = useState<ArbAmendmentCreateBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!bookingId) {
      setError(new Error('Booking ID is required'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildArbAmendmentCreateMock(t, bookingId);
        setBooking(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t, bookingId]);

  const submitAmendment = useCallback(async (data: { newCheckIn?: string; newCheckOut?: string; newGuests?: number; reason?: string }): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to submit amendment'));
      return false;
    }
  }, [bookingId]);

  useEffect(() => {
    fetchData();
  }, [bookingId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    booking,
    isLoading,
    error,
    submitAmendment,
  };
}
