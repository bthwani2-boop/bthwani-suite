// CONTROL PANEL Operation Wrappers for Pattern Unification & Behavior Unification
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.6 (Wrapper Sunset Plan)
// Status: TRANSITIONAL - Will be deprecated after 90 days

import { createBthwaniClients } from '@bthwani/api-clients';
import { generateCorrelationId, logger } from '@bthwani/platform-utils';

const getClient = () =>
  createBthwaniClients({ baseUrl: '/api', timeout: 30000, retries: 2 });

type EntityListParams = {
  domain?: string;
  entityType: string;
  actorType: 'admin';
  status?: string[];
  limit?: number;
  offset?: number;
};

type EntityActionApplyParams = {
  domain?: string;
  entityType: string;
  action: string;
  reason?: string;
  notes?: string;
  effectiveDate?: string;
};

async function entity_list(params: EntityListParams) {
  const client = getClient() as {
    entityList?: (input: EntityListParams) => Promise<unknown>;
  };
  if (typeof client.entityList === 'function') {
    return client.entityList(params);
  }
  return { items: [] };
}

async function entity_get(
  entityId: string,
  params: Omit<EntityListParams, 'status' | 'limit' | 'offset'>
) {
  const client = getClient() as {
    entityGet?: (
      id: string,
      input: Omit<EntityListParams, 'status' | 'limit' | 'offset'>
    ) => Promise<unknown>;
  };
  if (typeof client.entityGet === 'function') {
    return client.entityGet(entityId, params);
  }
  return { id: entityId, ...params };
}

async function mcpw_entity_action_apply(
  entityId: string,
  params: EntityActionApplyParams
) {
  return {
    success: false,
    entityId,
    ...params,
  };
}

/**
 * DEPRECATED: Use entity_list instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 * Will be removed after sunset + 30 days grace period
 */
export async function mcpw_ops_amn_trips_list(params: {
  status?: string[];
  limit?: number;
  offset?: number;
}) {
  logger.warn({
    message: 'DEPRECATED: mcpw_ops_amn_trips_list - Use entity_list instead',
    operation: 'mcpw_ops_amn_trips_list',
    unified_operation: 'entity_list',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await entity_list({
    domain: 'AMN',
    entityType: 'trip',
    actorType: 'admin',
    ...params,
  });
}

/**
 * DEPRECATED: Use entity_list instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_arb_bookings_list(params: {
  status?: string[];
  limit?: number;
  offset?: number;
}) {
  logger.warn({
    message: 'DEPRECATED: mcpw_ops_arb_bookings_list - Use entity_list instead',
    operation: 'mcpw_ops_arb_bookings_list',
    unified_operation: 'entity_list',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await entity_list({
    domain: 'ARB',
    entityType: 'booking',
    actorType: 'admin',
    ...params,
  });
}

/**
 * DEPRECATED: Use entity_list instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_dsh_orders_list(params: {
  status?: string[];
  limit?: number;
  offset?: number;
}) {
  logger.warn({
    message: 'DEPRECATED: mcpw_ops_dsh_orders_list - Use entity_list instead',
    operation: 'mcpw_ops_dsh_orders_list',
    unified_operation: 'entity_list',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await entity_list({
    domain: 'DSH',
    entityType: 'order',
    actorType: 'admin',
    ...params,
  });
}

/**
 * DEPRECATED: Use entity_get instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_amn_trip_get(params: { tripId: string }) {
  logger.warn({
    message: 'DEPRECATED: mcpw_ops_amn_trip_get - Use entity_get instead',
    operation: 'mcpw_ops_amn_trip_get',
    unified_operation: 'entity_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await entity_get(params.tripId, {
    domain: 'AMN',
    entityType: 'trip',
    actorType: 'admin',
  });
}

/**
 * DEPRECATED: Use entity_get instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_arb_booking_get(params: { bookingId: string }) {
  logger.warn({
    message: 'DEPRECATED: mcpw_ops_arb_booking_get - Use entity_get instead',
    operation: 'mcpw_ops_arb_booking_get',
    unified_operation: 'entity_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await entity_get(params.bookingId, {
    domain: 'ARB',
    entityType: 'booking',
    actorType: 'admin',
  });
}

/**
 * DEPRECATED: Use entity_get instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_dsh_order_get(params: { orderId: string }) {
  logger.warn({
    message: 'DEPRECATED: mcpw_ops_dsh_order_get - Use entity_get instead',
    operation: 'mcpw_ops_dsh_order_get',
    unified_operation: 'entity_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await entity_get(params.orderId, {
    domain: 'DSH',
    entityType: 'order',
    actorType: 'admin',
  });
}

// ============================================================================
// Behavior Unification Wrappers (Phase 3.2)
// ============================================================================

/**
 * DEPRECATED: Use mcpw_entity_action_apply instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 * Will be removed after sunset + 30 days grace period
 */
export async function mcpw_ops_amn_trip_action_apply(params: {
  tripId: string;
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'activate'
    | 'block'
    | 'unblock'
    | 'cancel'
    | 'refund'
    | 'escalate';
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}) {
  logger.warn({
    message:
      'DEPRECATED: mcpw_ops_amn_trip_action_apply - Use mcpw_entity_action_apply instead',
    operation: 'mcpw_ops_amn_trip_action_apply',
    unified_operation: 'mcpw_entity_action_apply',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await mcpw_entity_action_apply(params.tripId, {
    domain: 'AMN',
    entityType: 'trip',
    action: params.action,
    reason: params.reason,
    notes: params.notes,
    effectiveDate: params.effectiveDate,
  });
}

/**
 * DEPRECATED: Use mcpw_entity_action_apply instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_arb_booking_action_apply(params: {
  bookingId: string;
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'activate'
    | 'block'
    | 'unblock'
    | 'cancel'
    | 'refund'
    | 'escalate';
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}) {
  logger.warn({
    message:
      'DEPRECATED: mcpw_ops_arb_booking_action_apply - Use mcpw_entity_action_apply instead',
    operation: 'mcpw_ops_arb_booking_action_apply',
    unified_operation: 'mcpw_entity_action_apply',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await mcpw_entity_action_apply(params.bookingId, {
    domain: 'ARB',
    entityType: 'booking',
    action: params.action,
    reason: params.reason,
    notes: params.notes,
    effectiveDate: params.effectiveDate,
  });
}

/**
 * DEPRECATED: Use mcpw_entity_action_apply instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_dsh_order_action_apply(params: {
  orderId: string;
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'activate'
    | 'block'
    | 'unblock'
    | 'cancel'
    | 'refund'
    | 'escalate';
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}) {
  logger.warn({
    message:
      'DEPRECATED: mcpw_ops_dsh_order_action_apply - Use mcpw_entity_action_apply instead',
    operation: 'mcpw_ops_dsh_order_action_apply',
    unified_operation: 'mcpw_entity_action_apply',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await mcpw_entity_action_apply(params.orderId, {
    domain: 'DSH',
    entityType: 'order',
    action: params.action,
    reason: params.reason,
    notes: params.notes,
    effectiveDate: params.effectiveDate,
  });
}

/**
 * DEPRECATED: Use mcpw_entity_action_apply instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_captain_action_apply(params: {
  captainId: string;
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'activate'
    | 'block'
    | 'unblock'
    | 'cancel'
    | 'refund'
    | 'escalate';
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}) {
  logger.warn({
    message:
      'DEPRECATED: mcpw_ops_captain_action_apply - Use mcpw_entity_action_apply instead',
    operation: 'mcpw_ops_captain_action_apply',
    unified_operation: 'mcpw_entity_action_apply',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await mcpw_entity_action_apply(params.captainId, {
    entityType: 'captain',
    action: params.action,
    reason: params.reason,
    notes: params.notes,
    effectiveDate: params.effectiveDate,
  });
}

/**
 * DEPRECATED: Use mcpw_entity_action_apply instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_partner_action_apply(params: {
  partnerId: string;
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'activate'
    | 'block'
    | 'unblock'
    | 'cancel'
    | 'refund'
    | 'escalate';
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}) {
  logger.warn({
    message:
      'DEPRECATED: mcpw_ops_partner_action_apply - Use mcpw_entity_action_apply instead',
    operation: 'mcpw_ops_partner_action_apply',
    unified_operation: 'mcpw_entity_action_apply',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await mcpw_entity_action_apply(params.partnerId, {
    entityType: 'partner',
    action: params.action,
    reason: params.reason,
    notes: params.notes,
    effectiveDate: params.effectiveDate,
  });
}

/**
 * DEPRECATED: Use mcpw_entity_action_apply instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_ops_user_action_apply(params: {
  userId: string;
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'activate'
    | 'block'
    | 'unblock'
    | 'cancel'
    | 'refund'
    | 'escalate';
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}) {
  logger.warn({
    message:
      'DEPRECATED: mcpw_ops_user_action_apply - Use mcpw_entity_action_apply instead',
    operation: 'mcpw_ops_user_action_apply',
    unified_operation: 'mcpw_entity_action_apply',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await mcpw_entity_action_apply(params.userId, {
    entityType: 'user',
    action: params.action,
    reason: params.reason,
    notes: params.notes,
    effectiveDate: params.effectiveDate,
  });
}

/**
 * DEPRECATED: Use mcpw_entity_action_apply instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function mcpw_support_case_action_apply(params: {
  caseId: string;
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'activate'
    | 'block'
    | 'unblock'
    | 'cancel'
    | 'refund'
    | 'escalate';
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}) {
  logger.warn({
    message:
      'DEPRECATED: mcpw_support_case_action_apply - Use mcpw_entity_action_apply instead',
    operation: 'mcpw_support_case_action_apply',
    unified_operation: 'mcpw_entity_action_apply',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await mcpw_entity_action_apply(params.caseId, {
    domain: 'SUPPORT',
    entityType: 'ticket',
    action: params.action,
    reason: params.reason,
    notes: params.notes,
    effectiveDate: params.effectiveDate,
  });
}

