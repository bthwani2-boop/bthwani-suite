/**
 * useCaptainEarningsHistory - Hook for Captain Earnings History screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildCaptainEarningsHistoryMock, type EarningsRecord, type SummaryStats } from '../fixtures/captainEarningsHistory';

export interface UseCaptainEarningsHistoryResult {
  earningsHistory: EarningsRecord[];
  summaryStats: SummaryStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useCaptainEarningsHistory(): UseCaptainEarningsHistoryResult {
  const { t } = useI18n();
  
  const [earningsHistory, setEarningsHistory] = useState<EarningsRecord[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
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
        const data = buildCaptainEarningsHistoryMock(t);
        setEarningsHistory(data.earningsHistory);
        setSummaryStats(data.summaryStats);
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
  }, []);

  return {
    earningsHistory,
    summaryStats,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
