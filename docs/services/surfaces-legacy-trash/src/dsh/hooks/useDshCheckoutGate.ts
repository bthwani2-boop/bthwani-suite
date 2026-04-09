/**
 * useDshCheckoutGate - Hook for DSH Checkout Gate screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshCheckoutGateOrderSummaryMock, type CheckoutOrderSummary } from '../fixtures/checkoutGate';

export interface UseDshCheckoutGateResult {
  orderSummary: CheckoutOrderSummary | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshCheckoutGate(): UseDshCheckoutGateResult {
  const { t } = useI18n();
  
  const [orderSummary, setOrderSummary] = useState<CheckoutOrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildDshCheckoutGateOrderSummaryMock(t);
        setOrderSummary(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    orderSummary,
    isLoading,
    error,
    refetch: () => fetchData(),
  };
}
