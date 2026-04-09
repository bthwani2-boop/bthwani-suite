/**
 * useKnzFavoritesList - Hook for KNZ Favorites List screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzFavoritesListMock, type FavoriteListing } from '../fixtures/favoritesList';

// ============================================
// Types
// ============================================

export interface UseKnzFavoritesListResult {
  favorites: FavoriteListing[];
  totalCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  removeFavorite: (listingId: string) => Promise<boolean>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useKnzFavoritesList(): UseKnzFavoritesListResult {
  const { t } = useI18n();
  
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
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
        const data = buildKnzFavoritesListMock(t);
        setFavorites(data);
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

  const removeFavorite = useCallback(async (listingId: string): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        setFavorites(prev => prev.filter(f => f.id !== listingId));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to remove favorite'));
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    favorites,
    totalCount: favorites.length,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    removeFavorite,
  };
}
