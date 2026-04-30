/**
 * useDshPartnerZoneSet - Hook for DSH Partner Zone Set screen data (app-partner)
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshPartnerZoneSetMock, type Zone } from '../fixtures/partnerZoneSet';

export interface UseDshPartnerZoneSetResult {
  zones: Zone[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  updateZone: (zoneId: string, updates: Partial<Zone>) => Promise<boolean>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshPartnerZoneSet(): UseDshPartnerZoneSetResult {
  const { t } = useI18n();
  
  const [zones, setZones] = useState<Zone[]>([]);
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
        const data = buildDshPartnerZoneSetMock(t);
        setZones(data);
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

  const updateZone = useCallback(async (zoneId: string, updates: Partial<Zone>): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        setZones(prev => prev.map(z => z.id === zoneId ? { ...z, ...updates } : z));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    zones,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    updateZone,
  };
}
