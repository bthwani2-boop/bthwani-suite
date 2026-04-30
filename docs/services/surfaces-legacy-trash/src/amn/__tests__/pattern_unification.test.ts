// AMN Pattern Unification Wrappers - Unit Tests
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.6 (Wrapper Testing)
// Status: Phase 6 - Pattern Unification

import { amn_trips_list, amn_trip_get, amn_trip_cancel } from '../wrappers';
import { entity_list, entity_get, entity_reject } from '@bthwani/api-clients';
import { logger } from '@bthwani/platform-utils';

jest.mock('@bthwani/api-clients', () => ({
  entity_list: jest.fn(),
  entity_get: jest.fn(),
  entity_reject: jest.fn()
}));

jest.mock('@bthwani/platform-utils', () => ({
  generateCorrelationId: jest.fn(() => 'test-correlation-id'),
  logger: {
    warn: jest.fn(),
    info: jest.fn()
  }
}));

describe('AMN Pattern Unification Wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Trip Operations', () => {
    it('amn_trips_list should call entity_list with correct parameters and log warning', async () => {
      const mockParams = { status: 'pending', limit: 20, offset: 0 };
      await amn_trips_list(mockParams);

      expect(entity_list).toHaveBeenCalledWith({
        domain: 'AMN',
        entityType: 'trip',
        actorType: 'user',
        status: 'pending',
        limit: 20,
        offset: 0
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: amn_trips_list - Use entity_list instead',
          operation: 'amn_trips_list',
          unified_operation: 'entity_list'
        })
      );
    });

    it('amn_trip_get should call entity_get with correct parameters and log warning', async () => {
      const mockParams = { tripId: 'trip_123' };
      await amn_trip_get(mockParams);

      expect(entity_get).toHaveBeenCalledWith('trip_123', {
        domain: 'AMN',
        entityType: 'trip',
        actorType: 'user'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: amn_trip_get - Use entity_get instead',
          unified_operation: 'entity_get'
        })
      );
    });

    it('amn_trip_cancel should call entity_reject with correct parameters and log warning', async () => {
      const mockParams = { tripId: 'trip_123', reason: 'busy' as const, notes: 'Captain busy' };
      await amn_trip_cancel(mockParams);

      expect(entity_reject).toHaveBeenCalledWith('trip_123', {
        domain: 'AMN',
        entityType: 'trip',
        actorType: 'captain',
        reason: 'busy',
        notes: 'Captain busy'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: amn_trip_cancel - Use entity_reject instead',
          unified_operation: 'entity_reject'
        })
      );
    });
  });
});
