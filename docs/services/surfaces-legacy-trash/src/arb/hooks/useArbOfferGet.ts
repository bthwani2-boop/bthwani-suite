/**
 * useArbOfferGet - Hook for ARB Offer Detail screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildArbOfferGetMock, type ArbOfferDetail } from '../fixtures/offerGet';

// ============================================
// Types
// ============================================

export interface UseArbOfferGetResult {
  offer: ArbOfferDetail | null;
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

export function useArbOfferGet(offerId: string): UseArbOfferGetResult {
  const { t } = useI18n();
  
  const [offer, setOffer] = useState<ArbOfferDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!offerId) {
      setError(new Error('Offer ID is required'));
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
        const data = buildArbOfferGetMock(t, offerId);
        setOffer(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, offerId]);

  useEffect(() => {
    fetchData();
  }, [offerId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    offer,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
