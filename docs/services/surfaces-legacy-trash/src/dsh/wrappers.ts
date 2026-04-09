// DSH Operation Wrappers for Pattern Unification
// Status: TRANSITIONAL - entity_* not exported from api-clients; stubbed via createBthwaniClients.

import { createBthwaniClients } from '@bthwani/api-clients';
import { logger } from '@bthwani/platform-utils';

const getClient = () => createBthwaniClients({ baseUrl: '/api', timeout: 30000, retries: 2 });

function generateCorrelationId(): string {
  return `wrapper_${Date.now()}_${(0).toString(36).substr(2, 9)}`;
}

type ClientStub = {
  entityList?: (p: object) => Promise<{ items?: unknown[] }>;
  entityGet?: (id: string, p?: object) => Promise<unknown>;
  entityAccept?: (p: object) => Promise<unknown>;
  entityReject?: (p: object) => Promise<unknown>;
  entityDeliver?: (p: object) => Promise<unknown>;
};

export async function dsh_captain_orders_list(params: { status?: string[]; limit?: number; offset?: number }) {
  logger.warn({ message: 'DEPRECATED: dsh_captain_orders_list - Use entity_list', operation: 'dsh_captain_orders_list', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityList === 'function') return client.entityList({ domain: 'DSH', entityType: 'order', actorType: 'captain', ...params });
  return { items: [] };
}

export async function dsh_captain_order_accept(params: { orderId: string; notes?: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_captain_order_accept - Use entity_accept', operation: 'dsh_captain_order_accept', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityAccept === 'function') return client.entityAccept({ entityId: params.orderId, domain: 'DSH', entityType: 'order', actorType: 'captain', notes: params.notes });
  return undefined;
}

export async function dsh_partner_order_accept(params: { orderId: string; notes?: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_partner_order_accept - Use entity_accept', operation: 'dsh_partner_order_accept', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityAccept === 'function') return client.entityAccept({ entityId: params.orderId, domain: 'DSH', entityType: 'order', actorType: 'partner', notes: params.notes });
  return undefined;
}

export async function dsh_partner_orders_list(params: { status?: string[]; limit?: number; offset?: number }) {
  logger.warn({ message: 'DEPRECATED: dsh_partner_orders_list - Use entity_list', operation: 'dsh_partner_orders_list', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityList === 'function') return client.entityList({ domain: 'DSH', entityType: 'order', actorType: 'partner', ...params });
  return { items: [] };
}

export async function dsh_orders_list(params: { status?: string[]; limit?: number; offset?: number }) {
  logger.warn({ message: 'DEPRECATED: dsh_orders_list - Use entity_list', operation: 'dsh_orders_list', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityList === 'function') return client.entityList({ domain: 'DSH', entityType: 'order', ...params });
  return { items: [] };
}

export async function dsh_captain_order_get(params: { orderId: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_captain_order_get - Use entity_get', operation: 'dsh_captain_order_get', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityGet === 'function') return client.entityGet(params.orderId, { domain: 'DSH', actorType: 'captain' });
  return { id: params.orderId };
}

export async function dsh_partner_order_get(params: { orderId: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_partner_order_get - Use entity_get', operation: 'dsh_partner_order_get', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityGet === 'function') return client.entityGet(params.orderId, { domain: 'DSH', actorType: 'partner' });
  return { id: params.orderId };
}

export async function dsh_order_get(params: { orderId: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_order_get - Use entity_get', operation: 'dsh_order_get', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityGet === 'function') return client.entityGet(params.orderId, { domain: 'DSH' });
  return { id: params.orderId };
}

export async function dsh_external_order_get(params: { orderId: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_external_order_get - Use entity_get', operation: 'dsh_external_order_get', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityGet === 'function') return client.entityGet(params.orderId, { domain: 'DSH', actorType: 'external' });
  return { id: params.orderId };
}

export async function dsh_partner_order_reject(params: { orderId: string; reason: string; notes?: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_partner_order_reject - Use entity_reject', operation: 'dsh_partner_order_reject', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityReject === 'function') return client.entityReject({ entityId: params.orderId, domain: 'DSH', entityType: 'order', actorType: 'partner', reason: params.reason, notes: params.notes });
  return undefined;
}

export async function dsh_captain_order_deliver(params: { orderId: string; verificationCode?: string; recipientName?: string }) {
  logger.warn({ message: 'DEPRECATED: dsh_captain_order_deliver - Use entity_deliver', operation: 'dsh_captain_order_deliver', correlationId: generateCorrelationId() });
  const client = getClient() as ClientStub;
  if (typeof client.entityDeliver === 'function') return client.entityDeliver({ entityId: params.orderId, domain: 'DSH', entityType: 'order', actorType: 'captain', verificationCode: params.verificationCode, recipientName: params.recipientName });
  return undefined;
}
