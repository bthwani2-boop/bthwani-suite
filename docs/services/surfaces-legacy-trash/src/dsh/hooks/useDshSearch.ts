/**
 * useDshSearch - Hook for DSH Search screen data
 */

import { useState, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshSearchMock, type Restaurant } from '../fixtures/search';

export interface UseDshSearchResult {
  results: Restaurant[];
  isLoading: boolean;
  isSearching: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 200;
export function useDshSearch(): UseDshSearchResult {
  const { t } = useI18n();
  
  const [results, setResults] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string) => {
    setIsSearching(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        let data = buildDshSearchMock(t);
        if (query) {
          const lowerQuery = query.toLowerCase();
          data = data.filter(r => 
            r.name.toLowerCase().includes(lowerQuery) ||
            r.cuisine.toLowerCase().includes(lowerQuery)
          );
        }
        setResults(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsSearching(false);
    }
  }, [t]);

  return {
    results,
    isLoading,
    isSearching,
    error,
    search,
  };
}
