/**
 * useKnzListingGet - Hook for KNZ Listing Detail screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzListingGetMock, type KnzListingDetail } from '../fixtures/listingGet';

// ============================================
// Types
// ============================================

export interface UseKnzListingGetResult {
  listing: KnzListingDetail | null;
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

export function useKnzListingGet(listingId: string, sellerUserId: string = 'default'): UseKnzListingGetResult {
  const { t } = useI18n();
  
  const [listing, setListing] = useState<KnzListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!listingId) {
      setError(new Error('Listing ID is required'));
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
        const data = buildKnzListingGetMock(t, listingId, sellerUserId);
        setListing(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, listingId, sellerUserId]);

  useEffect(() => {
    fetchData();
  }, [listingId, sellerUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    listing,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
