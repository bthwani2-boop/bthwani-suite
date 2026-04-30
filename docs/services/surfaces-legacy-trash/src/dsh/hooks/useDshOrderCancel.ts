/**
 * useDshOrderCancel - Hook for DSH Order Cancel screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshOrderCancelMock, type DshOrderCancelInfo } from '../fixtures/orderCancel';

export interface UseDshOrderCancelResult {
  orderInfo: DshOrderCancelInfo | null;
  isLoading: boolean;
  error: Error | null;
  cancelOrder: (reason: string) => Promise<boolean>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshOrderCancel(orderId: string): UseDshOrderCancelResult {
  const { t } = useI18n();
  
  const [orderInfo, setOrderInfo] = useState<DshOrderCancelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildDshOrderCancelMock(t, orderId);
        setOrderInfo(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t, orderId]);

  const cancelOrder = useCallback(async (reason: string): Promise<boolean> => {
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch {
      return false;
    }
  }, [orderId]);

  useEffect(() => {
    fetchData();
  }, [orderId]);

  return {
    orderInfo,
    isLoading,
    error,
    cancelOrder,
  };
}
