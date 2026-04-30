// AMN Operation Wrappers for Pattern Unification
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.6 (Wrapper Sunset Plan)
// Status: TRANSITIONAL - Will be deprecated after 90 days
// Note: entity_list/entity_get/entity_reject are not yet exported from @bthwani/api-clients; stubbed until unified client is available.

import { createBthwaniClients } from '@bthwani/api-clients';
import { generateCorrelationId, logger } from '@bthwani/platform-utils';

const getClient = () => createBthwaniClients({ baseUrl: '/api', timeout: 30000, retries: 2 });

/**
 * DEPRECATED: Use entity_list instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 * Will be removed after sunset + 30 days grace period
 */
export async function amn_trips_list(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  logger.warn({
    message: 'DEPRECATED: amn_trips_list - Use entity_list instead',
    operation: 'amn_trips_list',
    unified_operation: 'entity_list',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId()
  });
  const client = getClient() as { entityList?: (p: object) => Promise<{ items?: unknown[] }> };
  if (typeof client.entityList === 'function') {
    return client.entityList({ domain: 'AMN', entityType: 'trip', actorType: 'user', status: params?.status, limit: params?.limit, offset: params?.offset });
  }
  return { items: [] };
}

/**
 * DEPRECATED: Use entity_get instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function amn_trip_get(params: { tripId: string }) {
  logger.warn({
    message: 'DEPRECATED: amn_trip_get - Use entity_get instead',
    operation: 'amn_trip_get',
    unified_operation: 'entity_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId()
  });
  const client = getClient() as { entityGet?: (id: string, p: object) => Promise<unknown> };
  if (typeof client.entityGet === 'function') {
    return client.entityGet(params.tripId, { domain: 'AMN', entityType: 'trip', actorType: 'user' });
  }
  return { id: params.tripId };
}

/**
 * DEPRECATED: Use entity_reject instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function amn_trip_cancel(params: {
  tripId: string;
  reason?: 'busy' | 'location_issue' | 'payment_issue' | 'other';
  notes?: string;
}) {
  logger.warn({
    message: 'DEPRECATED: amn_trip_cancel - Use entity_reject instead',
    operation: 'amn_trip_cancel',
    unified_operation: 'entity_reject',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId()
  });
  const client = getClient() as { entityReject?: (id: string, p: object) => Promise<unknown> };
  if (typeof client.entityReject === 'function') {
    return client.entityReject(params.tripId, { domain: 'AMN', entityType: 'trip', actorType: 'captain', reason: params.reason || 'other', notes: params.notes });
  }
  return undefined;
}
