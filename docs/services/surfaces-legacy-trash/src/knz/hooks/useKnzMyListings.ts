/**
 * useKnzMyListings - Hook for KNZ My Listings screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzMyListingsMock, type MyListingItem } from '../fixtures/myListings';

// ============================================
// Types
// ============================================

export interface UseKnzMyListingsOptions {
  status?: 'active' | 'closed' | 'all';
}

export interface UseKnzMyListingsResult {
  listings: MyListingItem[];
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

export function useKnzMyListings(options: UseKnzMyListingsOptions = {}): UseKnzMyListingsResult {
  const { status = 'all' } = options;
  const { t } = useI18n();
  
  const [listings, setListings] = useState<MyListingItem[]>([]);
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
        
        let allListings = buildKnzMyListingsMock(t);
        
        if (status !== 'all') {
          allListings = allListings.filter(l => l.status === status);
        }
        
        setListings(allListings);
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
    listings,
    totalCount: listings.length,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
