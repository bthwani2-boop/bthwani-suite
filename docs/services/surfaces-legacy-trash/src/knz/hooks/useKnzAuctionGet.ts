/**
 * useKnzAuctionGet - Hook for KNZ Auction Detail screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildKnzAuctionGetMock, type AuctionDetail } from '../fixtures/auctionGet';

// ============================================
// Types
// ============================================

export interface UseKnzAuctionGetResult {
  auction: AuctionDetail | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  placeBid: (amount: number) => Promise<boolean>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useKnzAuctionGet(auctionId: string): UseKnzAuctionGetResult {
  const { t } = useI18n();
  
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!auctionId) {
      setError(new Error('Auction ID is required'));
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
        const data = buildKnzAuctionGetMock(t, auctionId);
        setAuction(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, auctionId]);

  const placeBid = useCallback(async (amount: number): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to place bid'));
      return false;
    }
  }, [auctionId]);

  useEffect(() => {
    fetchData();
  }, [auctionId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    auction,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    placeBid,
  };
}
