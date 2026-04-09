// ARB Operation Wrappers for Pattern Unification
// Status: TRANSITIONAL - entity_list/entity_get not yet exported from api-clients; stubbed.

import { createBthwaniClients } from '@bthwani/api-clients';
import { generateCorrelationId, logger } from '@bthwani/platform-utils';

const getClient = () => createBthwaniClients({ baseUrl: '/api', timeout: 30000, retries: 2 });

export async function arb_bookings_list(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  logger.warn({
    message: 'DEPRECATED: arb_bookings_list - Use entity_list instead',
    operation: 'arb_bookings_list',
    unified_operation: 'entity_list',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId()
  });
  const client = getClient() as { entityList?: (p: object) => Promise<{ items?: unknown[] }> };
  if (typeof client.entityList === 'function') {
    return client.entityList({ domain: 'ARB', entityType: 'booking', actorType: 'user', status: params?.status, limit: params?.limit, offset: params?.offset });
  }
  return { items: [] };
}

export async function arb_booking_get(params: { bookingId: string }) {
  logger.warn({
    message: 'DEPRECATED: arb_booking_get - Use entity_get instead',
    operation: 'arb_booking_get',
    unified_operation: 'entity_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId()
  });
  const client = getClient() as { entityGet?: (id: string, p: object) => Promise<unknown> };
  if (typeof client.entityGet === 'function') {
    return client.entityGet(params.bookingId, { domain: 'ARB', entityType: 'booking', actorType: 'user' });
  }
  return { id: params.bookingId };
}
