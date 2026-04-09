/**
 * useArbHome - Hook for ARB Home screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildArbHomeMock, type ArbHomeData } from '../fixtures/home';

// ============================================
// Types
// ============================================

export interface UseArbHomeResult {
  data: ArbHomeData | null;
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

export function useArbHome(): UseArbHomeResult {
  const { t } = useI18n();
  
  const [data, setData] = useState<ArbHomeData | null>(null);
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
        const homeData = buildArbHomeMock(t);
        setData(homeData);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
