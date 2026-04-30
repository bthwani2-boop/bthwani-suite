/**
 * useArbOffersSearch - Hook for ARB Offers Search screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildArbOffersSearchMock, type OfferHit } from '../fixtures/offersSearch';

// ============================================
// Types
// ============================================

export interface UseArbOffersSearchOptions {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface UseArbOffersSearchResult {
  offers: OfferHit[];
  totalCount: number;
  isLoading: boolean;
  isSearching: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  refetch: () => Promise<void>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 200;
// ============================================
// Hook Implementation
// ============================================

export function useArbOffersSearch(
  options: UseArbOffersSearchOptions = {},
  resolveDevMediaUrl?: (path: string) => string
): UseArbOffersSearchResult {
  const { query = '', location, minPrice, maxPrice } = options;
  const { t } = useI18n();
  
  const [offers, setOffers] = useState<OfferHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (searchQuery: string, isNewSearch = false) => {
    if (isNewSearch) {
      setIsSearching(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        
        let results = buildArbOffersSearchMock(t, resolveDevMediaUrl);
        
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          results = results.filter(o => 
            o.title.toLowerCase().includes(lowerQuery) ||
            o.location.toLowerCase().includes(lowerQuery)
          );
        }
        if (location) {
          results = results.filter(o => o.location.toLowerCase().includes(location.toLowerCase()));
        }
        
        setOffers(results);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [t, location, resolveDevMediaUrl]);

  useEffect(() => {
    if (query) {
      fetchData(query);
    }
  }, [query, location]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    offers,
    totalCount: offers.length,
    isLoading,
    isSearching,
    error,
    search: (q: string) => fetchData(q, true),
    refetch: () => fetchData(query),
  };
}
