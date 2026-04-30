/**
 * useMrfMatchGet - Hook for MRF Match Get screen data
 * 
 * الآن: يستخدم fixtures (بيانات تجريبية)
 * لاحقاً: يستخدم api.mrf.matchGet() (API حقيقي)
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildMrfMatchGetMock,
  type MrfMatchDetail,
} from '../fixtures/matchGet';

// ============================================
// Types
// ============================================

export interface UseMrfMatchGetResult {
  match: MrfMatchDetail | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  respondToMatch: (action: 'accept' | 'decline' | 'investigate') => Promise<boolean>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useMrfMatchGet(matchId: string): UseMrfMatchGetResult {
  const { t } = useI18n();
  
  const [match, setMatch] = useState<MrfMatchDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!matchId) {
      setError(new Error('Match ID is required'));
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
        const data = buildMrfMatchGetMock(t, matchId);
        setMatch(data);
      } else {
        // API implementation placeholder
        // const response = await api.mrf.matchGet(matchId);
        // setMatch(response.data);
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, matchId]);

  const respondToMatch = useCallback(async (action: 'accept' | 'decline' | 'investigate'): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        return true;
      } else {
        // API implementation placeholder
        // await api.mrf.matchRespond(matchId, { action });
        // return true;
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to respond to match'));
      return false;
    }
  }, [matchId]);

  useEffect(() => {
    fetchData();
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    match,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    respondToMatch,
  };
}
