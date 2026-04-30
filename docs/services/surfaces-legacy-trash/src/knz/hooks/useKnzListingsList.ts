/**
 * useKnzListingsList - Hook for KNZ Listings List screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzListingsListMock, type Listing } from '../fixtures/listingsList';

// ============================================
// Types
// ============================================

export interface UseKnzListingsListOptions {
  category?: string;
  condition?: 'new' | 'used' | 'refurbished' | 'all';
}

export interface UseKnzListingsListResult {
  listings: Listing[];
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

export function useKnzListingsList(options: UseKnzListingsListOptions = {}): UseKnzListingsListResult {
  const { category, condition = 'all' } = options;
  const { t } = useI18n();
  
  const [listings, setListings] = useState<Listing[]>([]);
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
        
        let allListings = buildKnzListingsListMock(t);
        
        if (category) {
          allListings = allListings.filter(l => l.category === category);
        }
        if (condition !== 'all') {
          allListings = allListings.filter(l => l.condition === condition);
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
  }, [t, category, condition]);

  useEffect(() => {
    fetchData();
  }, [category, condition]); // eslint-disable-line react-hooks/exhaustive-deps

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
