/**
 * useKwdMyListings - Hook for KWD My Listings screen data
 * 
 * الآن: يستخدم fixtures (بيانات تجريبية)
 * لاحقاً: يستخدم api.kwd.myListings() (API حقيقي)
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildKwdMyListingsMockJobs,
  buildKwdMyListingsMockApplications,
  type KwdMyListingsJobItem,
  type KwdMyListingsApplicationItem,
} from '../fixtures/myListings';

// ============================================
// Types
// ============================================

export interface UseKwdMyListingsResult {
  jobs: KwdMyListingsJobItem[];
  applications: KwdMyListingsApplicationItem[];
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

export function useKwdMyListings(): UseKwdMyListingsResult {
  const { t } = useI18n();
  
  const [jobs, setJobs] = useState<KwdMyListingsJobItem[]>([]);
  const [applications, setApplications] = useState<KwdMyListingsApplicationItem[]>([]);
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
        
        const jobsData = buildKwdMyListingsMockJobs(t, 'default');
        const applicationsData = buildKwdMyListingsMockApplications(t, 'default');
        
        setJobs(jobsData);
        setApplications(applicationsData);
      } else {
        // API implementation placeholder
        // const response = await api.kwd.myListings();
        // setJobs(response.data.jobs);
        // setApplications(response.data.applications);
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

  return {
    jobs,
    applications,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
