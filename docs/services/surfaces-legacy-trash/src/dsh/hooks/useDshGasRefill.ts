/**
 * useDshGasRefill - Hook for DSH Gas Refill screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildGasRefillStationsMock,
  buildGasRefillEstimateMock,
  buildGasRefillOrderMock,
  type GasRefillStation,
  type GasRefillEstimate,
  type GasRefillOrderMock,
  type GasRefillSubcategory,
} from '../fixtures/gasRefill';

export interface UseDshGasRefillResult {
  stations: GasRefillStation[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  getEstimate: (subcategory: GasRefillSubcategory, stationId: string) => GasRefillEstimate;
  createOrder: (subcategory: GasRefillSubcategory, stationId: string) => Promise<GasRefillOrderMock>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshGasRefill(): UseDshGasRefillResult {
  const { t } = useI18n();
  
  const [stations, setStations] = useState<GasRefillStation[]>([]);
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
        const data = buildGasRefillStationsMock(t);
        setStations(data);
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

  const getEstimate = useCallback((subcategory: GasRefillSubcategory, stationId: string): GasRefillEstimate => {
    return buildGasRefillEstimateMock(t, subcategory, stationId);
  }, [t]);

  const createOrder = useCallback(async (subcategory: GasRefillSubcategory, stationId: string): Promise<GasRefillOrderMock> => {
    if (false) {
      await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
      return buildGasRefillOrderMock(t, { subcategory, stationId });
    } else {
      throw new Error('SURFACE_RUNTIME_NOT_WIRED');
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stations,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    getEstimate,
    createOrder,
  };
}
