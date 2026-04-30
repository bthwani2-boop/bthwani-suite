/**
 * ESF REST adapter — calls api-host /api/esf/* via @bthwani/api-clients (TypedApiClient.request).
 * Kept in surfaces to satisfy TS project references (no extra api-clients barrel surface).
 */

import { createBthwaniClients } from '@bthwani/api-clients';
import type { ApiConfig } from '@bthwani/api-clients';

export interface EsfRestAdapter {
  requestsList(query?: Record<string, string | number | undefined>): Promise<unknown>;
  requestsSearch(query?: Record<string, string | number | undefined>): Promise<unknown>;
  requestGet(requestId: string): Promise<unknown>;
  requestCancel(requestId: string, body?: { reason?: string }): Promise<unknown>;
  matchGet(matchId: string): Promise<unknown>;
  matchRespond(matchId: string, body: { decision: 'accept' | 'decline'; reason?: string }): Promise<unknown>;
}

const defaultPartial: Partial<ApiConfig> = {
  baseUrl: '/api',
  timeout: 30000,
  retries: 2,
};

let cached: EsfRestAdapter | null = null;

function buildAdapter(config?: Partial<ApiConfig>): EsfRestAdapter {
  const client = createBthwaniClients({ ...defaultPartial, ...config });
  return {
    requestsList: (query) =>
      client.request<unknown>('GET', '/esf/requests', { query: query as Record<string, unknown> }),
    requestsSearch: (query) =>
      client.request<unknown>('GET', '/esf/requests/search', { query: query as Record<string, unknown> }),
    requestGet: (requestId) =>
      client.request<unknown>('GET', `/esf/requests/${encodeURIComponent(requestId)}`, {}),
    requestCancel: (requestId, body) =>
      client.request<unknown>('POST', `/esf/requests/${encodeURIComponent(requestId)}/cancel`, {
        body: body ?? {},
      }),
    matchGet: (matchId) =>
      client.request<unknown>('GET', `/esf/matches/${encodeURIComponent(matchId)}`, {}),
    matchRespond: (matchId, body) =>
      client.request<unknown>('POST', `/esf/matches/${encodeURIComponent(matchId)}/respond`, {
        body,
      }),
  };
}

export function getEsfRestAdapter(): EsfRestAdapter {
  if (!cached) {
    cached = buildAdapter();
  }
  return cached;
}
