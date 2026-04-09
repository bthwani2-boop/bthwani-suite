/**
 * useKnzCartGet - Hook for KNZ Cart screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzCartGetMockItems, type CartItem } from '../fixtures/cartGet';

// ============================================
// Types
// ============================================

export interface UseKnzCartGetResult {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
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

export function useKnzCartGet(): UseKnzCartGetResult {
  const { t } = useI18n();
  
  const [items, setItems] = useState<CartItem[]>([]);
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
        const cartItems = buildKnzCartGetMockItems(t);
        setItems(cartItems);
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

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items,
    totalCount: items.length,
    totalPrice,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
