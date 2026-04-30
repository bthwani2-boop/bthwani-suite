/**
 * useCaptainSettlements - Hook for Captain Settlements screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildWithdrawalRequestsMock,
  buildBankAccountsMock,
  type WithdrawalRequest,
  type BankAccount,
} from '../fixtures/captainSettlements';

export interface UseCaptainSettlementsResult {
  withdrawalRequests: WithdrawalRequest[];
  bankAccounts: BankAccount[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  requestWithdrawal: (amount: number, bankAccountId: string) => Promise<boolean>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useCaptainSettlements(): UseCaptainSettlementsResult {
  const { t } = useI18n();
  
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
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
        setWithdrawalRequests(buildWithdrawalRequestsMock(t));
        setBankAccounts(buildBankAccountsMock(t));
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

  const requestWithdrawal = useCallback(async (amount: number, bankAccountId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    withdrawalRequests,
    bankAccounts,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    requestWithdrawal,
  };
}
