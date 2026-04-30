/**
 * useKnzListingUpdate - Hook for KNZ Listing Update screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzListingUpdateMock } from '../fixtures/listingUpdate';

// ============================================
// Types
// ============================================

export interface KnzListingUpdateData {
  id: string;
  currentData: {
    title: string;
    price: number;
    description: string;
    category: string;
    condition: string;
    location: string;
  };
  stats: {
    views: number;
    favorites: number;
    inquiries: number;
  };
}

export interface UseKnzListingUpdateResult {
  data: KnzListingUpdateData | null;
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

export function useKnzListingUpdate(listingId: string): UseKnzListingUpdateResult {
  const { t } = useI18n();
  
  const [data, setData] = useState<KnzListingUpdateData | null>(null);
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
        const mockData = buildKnzListingUpdateMock(t);
        setData({ ...mockData, id: listingId });
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, listingId]);

  useEffect(() => {
    fetchData();
  }, [listingId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
