// ARB Pattern Unification Wrappers - Unit Tests
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.6 (Wrapper Testing)
// Status: Phase 6 - Pattern Unification

import { arb_bookings_list, arb_booking_get } from '../wrappers';
import { entity_list, entity_get } from '@bthwani/api-clients';
import { logger } from '@bthwani/platform-utils';

jest.mock('@bthwani/api-clients', () => ({
  entity_list: jest.fn(),
  entity_get: jest.fn()
}));

jest.mock('@bthwani/platform-utils', () => ({
  generateCorrelationId: jest.fn(() => 'test-correlation-id'),
  logger: {
    warn: jest.fn(),
    info: jest.fn()
  }
}));

describe('ARB Pattern Unification Wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Booking Operations', () => {
    it('arb_bookings_list should call entity_list with correct parameters and log warning', async () => {
      const mockParams = { status: 'pending', limit: 20, offset: 0 };
      await arb_bookings_list(mockParams);

      expect(entity_list).toHaveBeenCalledWith({
        domain: 'ARB',
        entityType: 'booking',
        actorType: 'user',
        status: 'pending',
        limit: 20,
        offset: 0
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: arb_bookings_list - Use entity_list instead',
          operation: 'arb_bookings_list',
          unified_operation: 'entity_list'
        })
      );
    });

    it('arb_booking_get should call entity_get with correct parameters and log warning', async () => {
      const mockParams = { bookingId: 'booking_456' };
      await arb_booking_get(mockParams);

      expect(entity_get).toHaveBeenCalledWith('booking_456', {
        domain: 'ARB',
        entityType: 'booking',
        actorType: 'user'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: arb_booking_get - Use entity_get instead',
          unified_operation: 'entity_get'
        })
      );
    });
  });
});
