/**
 * useCaptainFinancialReports - Hook for Captain Financial Reports screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildFinancialReportMock, type FinancialReport } from '../fixtures/captainFinancialReports';

export interface UseCaptainFinancialReportsResult {
  report: FinancialReport | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useCaptainFinancialReports(): UseCaptainFinancialReportsResult {
  const { t } = useI18n();
  
  const [report, setReport] = useState<FinancialReport | null>(null);
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
        const data = buildFinancialReportMock(t);
        setReport(data);
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
    report,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
