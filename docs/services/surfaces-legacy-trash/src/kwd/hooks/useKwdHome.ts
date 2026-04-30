/**
 * useKwdHome - Hook for KWD Home screen data
 * 
 * الآن: يستخدم fixtures (بيانات تجريبية)
 * لاحقاً: يستخدم api.kwd.homeGet() (API حقيقي)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildKwdHomeMockJobs,
  type KwdJobFixture,
} from '../fixtures/home';

// ============================================
// Types
// ============================================

export interface UseKwdHomeOptions {
  jobType?: 'daily' | 'one_time' | 'part_time' | 'full_time' | 'all';
  maxDistance?: number;
}

export interface UseKwdHomeResult {
  jobs: KwdJobFixture[];
  totalCount: number;
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

export function useKwdHome(options: UseKwdHomeOptions = {}): UseKwdHomeResult {
  const { jobType = 'all', maxDistance } = options;
  const { t } = useI18n();
  
  const [jobs, setJobs] = useState<KwdJobFixture[]>([]);
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
        
        let allJobs = buildKwdHomeMockJobs(t);
        
        if (jobType !== 'all') {
          allJobs = allJobs.filter(j => j.jobType === jobType);
        }
        if (maxDistance !== undefined) {
          allJobs = allJobs.filter(j => (j.distance ?? 0) <= maxDistance);
        }
        
        setJobs(allJobs);
      } else {
        // API implementation placeholder
        // const response = await api.kwd.homeGet({ jobType, maxDistance });
        // setJobs(response.data.jobs);
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, jobType, maxDistance]);

  useEffect(() => {
    fetchData();
  }, [jobType, maxDistance]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    jobs,
    totalCount: jobs.length,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
