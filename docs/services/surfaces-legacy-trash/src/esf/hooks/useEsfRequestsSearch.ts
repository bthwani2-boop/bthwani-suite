/**
 * useEsfRequestsSearch — search/list via api-host ESF repository adapter.
 */

import { useState, useEffect, useCallback } from 'react';
import { getEsfRestAdapter } from '../data/esfRestSingleton';
import { parseRequestsListPayload } from '../data/esfDtoMappers';
import type { BloodDonationRequest, EsfUrgencyUi } from '../uiTypes';

export type { BloodDonationRequest };

export interface UseEsfRequestsSearchOptions {
  query?: string;
  bloodType?: string | 'all';
  urgency?: EsfUrgencyUi | 'all';
}

export interface UseEsfRequestsSearchResult {
  results: BloodDonationRequest[];
  totalCount: number;
  isLoading: boolean;
  isSearching: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useEsfRequestsSearch(options: UseEsfRequestsSearchOptions = {}): UseEsfRequestsSearchResult {
  const { query = '', bloodType = 'all', urgency = 'all' } = options;

  const [results, setResults] = useState<BloodDonationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (searchQuery: string, isNewSearch = false) => {
      if (isNewSearch) {
        setIsSearching(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const adapter = getEsfRestAdapter();
        const baseQ: Record<string, string | number | undefined> = { limit: 100, offset: 0 };
        if (bloodType !== 'all') baseQ.emergency_type = bloodType;
        if (urgency !== 'all') baseQ.priority = urgency.toUpperCase();

        const trimmed = searchQuery.trim();
        let raw: unknown;
        if (trimmed.length >= 2) {
          raw = await adapter.requestsSearch({ ...baseQ, q: trimmed });
        } else {
          raw = await adapter.requestsList(baseQ);
        }

        let list = parseRequestsListPayload(raw);
        if (trimmed.length > 0 && trimmed.length < 2) {
          const lower = trimmed.toLowerCase();
          list = list.filter(
            (r) =>
              r.bloodType.toLowerCase().includes(lower) ||
              r.location.toLowerCase().includes(lower) ||
              r.hospitalName.toLowerCase().includes(lower)
          );
        }
        setResults(list);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    [bloodType, urgency]
  );

  useEffect(() => {
    if (query) {
      fetchData(query);
    }
  }, [query, bloodType, urgency]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    results,
    totalCount: results.length,
    isLoading,
    isSearching,
    error,
    search: (q: string) => fetchData(q, true),
    refetch: () => fetchData(query),
  };
}
