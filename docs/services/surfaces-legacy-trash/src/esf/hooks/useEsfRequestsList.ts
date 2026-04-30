/**
 * useEsfRequestsList — ESF requests list via api-host /esf/requests (repository adapter).
 */

import { useState, useEffect, useCallback } from 'react';
import { getEsfRestAdapter } from '../data/esfRestSingleton';
import { parseRequestsListPayload } from '../data/esfDtoMappers';
import type { BloodDonationRequest, EsfRequestStatusUi, EsfUrgencyUi } from '../uiTypes';

export type { EsfRequestStatusUi, EsfUrgencyUi, BloodDonationRequest };
/** @deprecated Use EsfRequestStatusUi */
export type EsfRequestStatus = EsfRequestStatusUi;
/** @deprecated Use EsfUrgencyUi */
export type EsfUrgency = EsfUrgencyUi;

export interface UseEsfRequestsListOptions {
  status?: EsfRequestStatusUi | 'all';
  urgency?: EsfUrgencyUi | 'all';
  bloodType?: string | 'all';
}

export interface UseEsfRequestsListResult {
  requests: BloodDonationRequest[];
  totalCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

function backendStatusParam(status: EsfRequestStatusUi | 'all'): string | undefined {
  if (status === 'all') return undefined;
  if (status === 'pending') return 'PENDING';
  if (status === 'completed') return 'COMPLETED';
  if (status === 'cancelled') return 'CANCELLED';
  return undefined;
}

export function useEsfRequestsList(options: UseEsfRequestsListOptions = {}): UseEsfRequestsListResult {
  const { status = 'all', urgency = 'all', bloodType = 'all' } = options;

  const [requests, setRequests] = useState<BloodDonationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const adapter = getEsfRestAdapter();
        const q: Record<string, string | number | undefined> = { limit: 100, offset: 0 };
        const st = backendStatusParam(status);
        if (st) q.status = st;
        if (urgency !== 'all') q.priority = urgency.toUpperCase();
        if (bloodType !== 'all') q.emergency_type = bloodType;

        const raw = await adapter.requestsList(q);
        let list = parseRequestsListPayload(raw);

        if (status === 'matched') {
          list = list.filter((r) => r.status === 'matched');
        }
        setRequests(list);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [status, urgency, bloodType]
  );

  useEffect(() => {
    fetchData();
  }, [status, urgency, bloodType]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    requests,
    totalCount: requests.length,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
  };
}
