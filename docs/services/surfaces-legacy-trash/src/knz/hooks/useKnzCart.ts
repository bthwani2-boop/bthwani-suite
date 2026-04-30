/**
 * useKnzCart - Hook for KNZ Cart Item Add screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzCartMockListing } from '../fixtures/cart';
import type { ListingInfo } from '../app-client/mobile/auto_knz_cart_item_add';

// ============================================
// Types
// ============================================

export interface UseKnzCartResult {
  listing: ListingInfo | null;
  isLoading: boolean;
  error: Error | null;
  addToCart: () => Promise<boolean>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useKnzCart(listingId: string): UseKnzCartResult {
  const { t } = useI18n();
  
  const [listing, setListing] = useState<ListingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!listingId) {
      setError(new Error('Listing ID is required'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildKnzCartMockListing(t, listingId);
        setListing(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t, listingId]);

  const addToCart = useCallback(async (): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to add to cart'));
      return false;
    }
  }, [listingId]);

  useEffect(() => {
    fetchData();
  }, [listingId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    listing,
    isLoading,
    error,
    addToCart,
  };
}

