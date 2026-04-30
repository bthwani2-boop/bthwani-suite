/**
 * useCaptainOrderDetails - Hook for Captain Order Details screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildDshCaptainOrderDetailsFallback,
  mapApiResponseToOrderDetails,
  type OrderDetails,
} from '../fixtures/captainOrderDetails';

export interface UseCaptainOrderDetailsResult {
  orderDetails: OrderDetails | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useCaptainOrderDetails(orderId: string): UseCaptainOrderDetailsResult {
  const { t } = useI18n();
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
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
        const data = buildDshCaptainOrderDetailsFallback(t, orderId);
        setOrderDetails(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, orderId]);

  useEffect(() => {
    fetchData();
  }, [orderId]);

  return {
    orderDetails,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}

export { mapApiResponseToOrderDetails };
