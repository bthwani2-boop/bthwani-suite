/**
 * useMrfReportGet - Hook for MRF Report Get screen data
 * 
 * الآن: يستخدم fixtures (بيانات تجريبية)
 * لاحقاً: يستخدم api.mrf.reportGet() (API حقيقي)
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildMrfReportGetMock,
  type MrfReportDetail,
} from '../fixtures/reportGet';

// ============================================
// Types
// ============================================

export interface UseMrfReportGetResult {
  report: MrfReportDetail | null;
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

export function useMrfReportGet(reportId: string): UseMrfReportGetResult {
  const { t } = useI18n();
  
  const [report, setReport] = useState<MrfReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!reportId) {
      setError(new Error('Report ID is required'));
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
        const data = buildMrfReportGetMock(t, reportId);
        setReport(data);
      } else {
        // API implementation placeholder
        // const response = await api.mrf.reportGet(reportId);
        // setReport(response.data);
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, reportId]);

  useEffect(() => {
    fetchData();
  }, [reportId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    report,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
