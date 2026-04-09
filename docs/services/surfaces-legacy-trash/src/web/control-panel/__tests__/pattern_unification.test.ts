// CONTROL PANEL Pattern Unification & Behavior Unification Wrappers - Unit Tests
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.6 (Wrapper Testing)
// Status: Phase 3.1 + Phase 3.2 - Pattern & Behavior Unification

import {
  mcpw_ops_amn_trips_list,
  mcpw_ops_arb_bookings_list,
  mcpw_ops_dsh_orders_list,
  mcpw_ops_amn_trip_get,
  mcpw_ops_arb_booking_get,
  mcpw_ops_dsh_order_get,
  mcpw_ops_amn_trip_action_apply,
  mcpw_ops_arb_booking_action_apply,
  mcpw_ops_dsh_order_action_apply,
  mcpw_ops_captain_action_apply,
  mcpw_ops_partner_action_apply,
  mcpw_ops_user_action_apply,
  mcpw_support_case_action_apply
} from '../wrappers';
import { entity_list, entity_get, mcpw_entity_action_apply } from '@bthwani/api-clients';
import { logger } from '@bthwani/platform-utils';

jest.mock('@bthwani/api-clients', () => ({
  entity_list: jest.fn(),
  entity_get: jest.fn(),
  mcpw_entity_action_apply: jest.fn()
}));

jest.mock('@bthwani/platform-utils', () => ({
  generateCorrelationId: jest.fn(() => 'test-correlation-id'),
  logger: {
    warn: jest.fn(),
    info: jest.fn()
  }
}));

describe('CONTROL PANEL Pattern Unification Wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('List Operations', () => {
    it('mcpw_ops_amn_trips_list should call entity_list with correct parameters and log warning', async () => {
      const mockParams = { limit: 10, offset: 0 };
      await mcpw_ops_amn_trips_list(mockParams);

      expect(entity_list).toHaveBeenCalledWith({
        domain: 'AMN',
        entityType: 'trip',
        actorType: 'admin',
        ...mockParams
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_amn_trips_list - Use entity_list instead',
          operation: 'mcpw_ops_amn_trips_list',
          unified_operation: 'entity_list'
        })
      );
    });

    it('mcpw_ops_arb_bookings_list should call entity_list with correct parameters and log warning', async () => {
      const mockParams = { limit: 20, offset: 0 };
      await mcpw_ops_arb_bookings_list(mockParams);

      expect(entity_list).toHaveBeenCalledWith({
        domain: 'ARB',
        entityType: 'booking',
        actorType: 'admin',
        ...mockParams
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_arb_bookings_list - Use entity_list instead',
          operation: 'mcpw_ops_arb_bookings_list',
          unified_operation: 'entity_list'
        })
      );
    });

    it('mcpw_ops_dsh_orders_list should call entity_list with correct parameters and log warning', async () => {
      const mockParams = { limit: 15, offset: 0 };
      await mcpw_ops_dsh_orders_list(mockParams);

      expect(entity_list).toHaveBeenCalledWith({
        domain: 'DSH',
        entityType: 'order',
        actorType: 'admin',
        ...mockParams
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_dsh_orders_list - Use entity_list instead',
          operation: 'mcpw_ops_dsh_orders_list',
          unified_operation: 'entity_list'
        })
      );
    });
  });

  describe('Get Operations', () => {
    it('mcpw_ops_amn_trip_get should call entity_get with correct parameters and log warning', async () => {
      const tripId = 'trip123';
      await mcpw_ops_amn_trip_get({ tripId });

      expect(entity_get).toHaveBeenCalledWith(tripId, {
        domain: 'AMN',
        actorType: 'admin'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_amn_trip_get - Use entity_get instead',
          operation: 'mcpw_ops_amn_trip_get',
          unified_operation: 'entity_get'
        })
      );
    });

    it('mcpw_ops_arb_booking_get should call entity_get with correct parameters and log warning', async () => {
      const bookingId = 'booking456';
      await mcpw_ops_arb_booking_get({ bookingId });

      expect(entity_get).toHaveBeenCalledWith(bookingId, {
        domain: 'ARB',
        actorType: 'admin'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_arb_booking_get - Use entity_get instead',
          operation: 'mcpw_ops_arb_booking_get',
          unified_operation: 'entity_get'
        })
      );
    });

    it('mcpw_ops_dsh_order_get should call entity_get with correct parameters and log warning', async () => {
      const orderId = 'order789';
      await mcpw_ops_dsh_order_get({ orderId });

      expect(entity_get).toHaveBeenCalledWith(orderId, {
        domain: 'DSH',
        actorType: 'admin'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_dsh_order_get - Use entity_get instead',
          operation: 'mcpw_ops_dsh_order_get',
          unified_operation: 'entity_get'
        })
      );
    });
  });

  describe('Behavior Unification - Action Apply Operations (Phase 3.2)', () => {
    it('mcpw_ops_amn_trip_action_apply should call mcpw_entity_action_apply with correct parameters and log warning', async () => {
      const mockParams = {
        tripId: 'trip_123',
        action: 'approve' as const,
        reason: 'Test reason',
        notes: 'Test notes'
      };
      await mcpw_ops_amn_trip_action_apply(mockParams);

      expect(mcpw_entity_action_apply).toHaveBeenCalledWith('trip_123', {
        domain: 'AMN',
        entityType: 'trip',
        action: 'approve',
        reason: 'Test reason',
        notes: 'Test notes'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_amn_trip_action_apply - Use mcpw_entity_action_apply instead',
          operation: 'mcpw_ops_amn_trip_action_apply',
          unified_operation: 'mcpw_entity_action_apply'
        })
      );
    });

    it('mcpw_ops_arb_booking_action_apply should call mcpw_entity_action_apply with correct parameters and log warning', async () => {
      const mockParams = {
        bookingId: 'booking_456',
        action: 'reject' as const,
        reason: 'Test reason'
      };
      await mcpw_ops_arb_booking_action_apply(mockParams);

      expect(mcpw_entity_action_apply).toHaveBeenCalledWith('booking_456', {
        domain: 'ARB',
        entityType: 'booking',
        action: 'reject',
        reason: 'Test reason'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_arb_booking_action_apply - Use mcpw_entity_action_apply instead',
          unified_operation: 'mcpw_entity_action_apply'
        })
      );
    });

    it('mcpw_ops_dsh_order_action_apply should call mcpw_entity_action_apply with correct parameters and log warning', async () => {
      const mockParams = {
        orderId: 'order_789',
        action: 'suspend' as const,
        notes: 'Test notes'
      };
      await mcpw_ops_dsh_order_action_apply(mockParams);

      expect(mcpw_entity_action_apply).toHaveBeenCalledWith('order_789', {
        domain: 'DSH',
        entityType: 'order',
        action: 'suspend',
        notes: 'Test notes'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_dsh_order_action_apply - Use mcpw_entity_action_apply instead',
          unified_operation: 'mcpw_entity_action_apply'
        })
      );
    });

    it('mcpw_ops_captain_action_apply should call mcpw_entity_action_apply with correct parameters and log warning', async () => {
      const mockParams = {
        captainId: 'captain_111',
        action: 'activate' as const
      };
      await mcpw_ops_captain_action_apply(mockParams);

      expect(mcpw_entity_action_apply).toHaveBeenCalledWith('captain_111', {
        entityType: 'captain',
        action: 'activate'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_captain_action_apply - Use mcpw_entity_action_apply instead',
          unified_operation: 'mcpw_entity_action_apply'
        })
      );
    });

    it('mcpw_ops_partner_action_apply should call mcpw_entity_action_apply with correct parameters and log warning', async () => {
      const mockParams = {
        partnerId: 'partner_222',
        action: 'block' as const,
        reason: 'Test reason'
      };
      await mcpw_ops_partner_action_apply(mockParams);

      expect(mcpw_entity_action_apply).toHaveBeenCalledWith('partner_222', {
        entityType: 'partner',
        action: 'block',
        reason: 'Test reason'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_partner_action_apply - Use mcpw_entity_action_apply instead',
          unified_operation: 'mcpw_entity_action_apply'
        })
      );
    });

    it('mcpw_ops_user_action_apply should call mcpw_entity_action_apply with correct parameters and log warning', async () => {
      const mockParams = {
        userId: 'user_333',
        action: 'unblock' as const
      };
      await mcpw_ops_user_action_apply(mockParams);

      expect(mcpw_entity_action_apply).toHaveBeenCalledWith('user_333', {
        entityType: 'user',
        action: 'unblock'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_ops_user_action_apply - Use mcpw_entity_action_apply instead',
          unified_operation: 'mcpw_entity_action_apply'
        })
      );
    });

    it('mcpw_support_case_action_apply should call mcpw_entity_action_apply with correct parameters and log warning', async () => {
      const mockParams = {
        caseId: 'case_444',
        action: 'escalate' as const,
        notes: 'Test notes'
      };
      await mcpw_support_case_action_apply(mockParams);

      expect(mcpw_entity_action_apply).toHaveBeenCalledWith('case_444', {
        domain: 'SUPPORT',
        entityType: 'ticket',
        action: 'escalate',
        notes: 'Test notes'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: mcpw_support_case_action_apply - Use mcpw_entity_action_apply instead',
          unified_operation: 'mcpw_entity_action_apply'
        })
      );
    });
  });
});

