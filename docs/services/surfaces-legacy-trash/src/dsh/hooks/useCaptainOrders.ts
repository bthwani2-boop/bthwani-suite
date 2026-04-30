/**
 * useCaptainOrders - Hook for Captain Orders data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildOrderAcceptMock,
  buildOrderDeliverMock,
  buildOrderPickupFallback,
  type OrderAccept,
  type OrderDeliver,
  type OrderPickup,
} from '../fixtures/captainOrders';

export interface UseCaptainOrderAcceptResult {
  order: OrderAccept | null;
  isLoading: boolean;
  error: Error | null;
  acceptOrder: () => Promise<boolean>;
  rejectOrder: () => Promise<boolean>;
}

export interface UseCaptainOrderDeliverResult {
  order: OrderDeliver | null;
  isLoading: boolean;
  error: Error | null;
  confirmDelivery: () => Promise<boolean>;
}

export interface UseCaptainOrderPickupResult {
  order: OrderPickup | null;
  isLoading: boolean;
  error: Error | null;
  confirmPickup: () => Promise<boolean>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useCaptainOrderAccept(): UseCaptainOrderAcceptResult {
  const { t } = useI18n();
  
  const [order, setOrder] = useState<OrderAccept | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildOrderAcceptMock(t);
        setOrder(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const acceptOrder = useCallback(async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
      return true;
    } catch {
      return false;
    }
  }, []);

  const rejectOrder = useCallback(async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return { order, isLoading, error, acceptOrder, rejectOrder };
}

export function useCaptainOrderDeliver(): UseCaptainOrderDeliverResult {
  const { t } = useI18n();
  
  const [order, setOrder] = useState<OrderDeliver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildOrderDeliverMock(t);
        setOrder(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const confirmDelivery = useCallback(async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return { order, isLoading, error, confirmDelivery };
}

export function useCaptainOrderPickup(orderId: string): UseCaptainOrderPickupResult {
  const { t } = useI18n();
  
  const [order, setOrder] = useState<OrderPickup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildOrderPickupFallback(t, orderId);
        setOrder(data);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t, orderId]);

  const confirmPickup = useCallback(async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [orderId]);

  return { order, isLoading, error, confirmPickup };
}
