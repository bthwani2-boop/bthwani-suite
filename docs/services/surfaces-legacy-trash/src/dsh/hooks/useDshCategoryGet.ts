/**
 * useDshCategoryGet - Hook for DSH Category screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshCategoryGetMock, type CategoryItem, type CategoryHeader } from '../fixtures/categoryGet';

export interface UseDshCategoryGetResult {
  category: CategoryHeader | null;
  items: CategoryItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshCategoryGet(categoryId: string): UseDshCategoryGetResult {
  const { t } = useI18n();
  
  const [category, setCategory] = useState<CategoryHeader | null>(null);
  const [items, setItems] = useState<CategoryItem[]>([]);
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
        const data = buildDshCategoryGetMock(t);
        setCategory(data.category);
        setItems(data.items);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, categoryId]);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return {
    category,
    items,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
