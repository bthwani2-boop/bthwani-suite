/**
 * useCaptainWallet - Hook for Captain Wallet screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildCaptainWalletMock, type WalletData, type Transaction } from '../fixtures/captainWallet';

export interface UseCaptainWalletResult {
  walletData: WalletData | null;
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useCaptainWallet(isAmn: boolean = false): UseCaptainWalletResult {
  const { t } = useI18n();
  
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
        const data = buildCaptainWalletMock(t, isAmn);
        setWalletData(data.walletData);
        setTransactions(data.transactions);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, isAmn]);

  useEffect(() => {
    fetchData();
  }, [isAmn]);

  return {
    walletData,
    transactions,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
