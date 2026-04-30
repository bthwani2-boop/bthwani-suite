// Platform Pattern Unification Wrappers - Unit Tests
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.6 (Wrapper Testing)
// Status: Phase 4 - Pattern Unification

import {
  user_profile_get,
  dsh_partner_profile_get,
  platform_captain_profile_get
} from '../wrappers';
import { profile_get } from '@bthwani/api-clients';
import { logger } from '@bthwani/platform-utils';

jest.mock('@bthwani/api-clients', () => ({
  profile_get: jest.fn()
}));

jest.mock('@bthwani/platform-utils', () => ({
  generateCorrelationId: jest.fn(() => 'test-correlation-id'),
  logger: {
    warn: jest.fn(),
    info: jest.fn()
  }
}));

describe('Platform Pattern Unification Wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Profile Operations', () => {
    it('user_profile_get should call profile_get with correct parameters and log warning', async () => {
      const mockParams = { actorId: 'user_123' };
      await user_profile_get(mockParams);

      expect(profile_get).toHaveBeenCalledWith({
        actorType: 'user',
        actorId: 'user_123'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: user_profile_get - Use profile_get instead',
          operation: 'user_profile_get',
          unified_operation: 'profile_get'
        })
      );
    });

    it('dsh_partner_profile_get should call profile_get with correct parameters and log warning', async () => {
      const mockParams = { partnerId: 'partner_456' };
      await dsh_partner_profile_get(mockParams);

      expect(profile_get).toHaveBeenCalledWith({
        actorType: 'partner',
        actorId: 'partner_456',
        domain: 'DSH'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: dsh_partner_profile_get - Use profile_get instead',
          unified_operation: 'profile_get'
        })
      );
    });

    it('platform_captain_profile_get should call profile_get with correct parameters and log warning', async () => {
      const mockParams = { captainId: 'captain_789', service_mode: 'DSH' as const };
      await platform_captain_profile_get(mockParams);

      expect(profile_get).toHaveBeenCalledWith({
        actorType: 'captain',
        actorId: 'captain_789',
        domain: 'DSH'
      });
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DEPRECATED: platform_captain_profile_get - Use profile_get instead',
          unified_operation: 'profile_get'
        })
      );
    });

    it('platform_captain_profile_get should handle missing service_mode', async () => {
      const mockParams = { captainId: 'captain_789' };
      await platform_captain_profile_get(mockParams);

      expect(profile_get).toHaveBeenCalledWith({
        actorType: 'captain',
        actorId: 'captain_789',
        domain: undefined
      });
    });
  });
});
