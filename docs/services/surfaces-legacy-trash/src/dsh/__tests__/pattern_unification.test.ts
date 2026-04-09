// Pattern Unification Tests for DSH Operations
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.1
// Tests: Response consistency, error handling, backward compatibility

import { entity_list, entity_get } from '@bthwani/api-clients';
import {
  dsh_captain_orders_list,
  dsh_partner_orders_list,
  dsh_orders_list,
  dsh_captain_order_get,
  dsh_partner_order_get,
  dsh_order_get,
  dsh_external_order_get
} from '../wrappers';

describe('DSH Pattern Unification', () => {
  describe('Response Envelope Consistency', () => {
    test('entity_list returns standardized envelope', async () => {
      const result = await entity_list({
        domain: 'DSH',
        entityType: 'order',
        actorType: 'captain'
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result).toHaveProperty('metadata');
      expect(result.metadata).toHaveProperty('domain', 'DSH');
      expect(result.metadata).toHaveProperty('entityType', 'order');
      expect(result.metadata).toHaveProperty('actorType', 'captain');
      expect(result.metadata).toHaveProperty('timestamp');
      expect(result.metadata).toHaveProperty('requestId');
    });

    test('entity_get returns standardized envelope', async () => {
      const result = await entity_get({
        entityId: 'test-order-123',
        domain: 'DSH',
        actorType: 'captain'
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(result.metadata).toHaveProperty('domain', 'DSH');
      expect(result.metadata).toHaveProperty('entityId', 'test-order-123');
      expect(result.metadata).toHaveProperty('actorType', 'captain');
    });
  });

  describe('Backward Compatibility (Wrappers)', () => {
    test('dsh_captain_orders_list wrapper calls unified operation', async () => {
      const mockEntityList = jest.spyOn(require('@bthwani/api-clients'), 'entity_list');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await dsh_captain_orders_list({ limit: 10 });

      expect(mockEntityList).toHaveBeenCalledWith({
        domain: 'DSH',
        entityType: 'order',
        actorType: 'captain',
        limit: 10
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('DEPRECATED'),
          operation: 'dsh_captain_orders_list',
          unified_operation: 'entity_list'
        })
      );

      mockEntityList.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    test('dsh_partner_orders_list wrapper calls unified operation', async () => {
      const mockEntityList = jest.spyOn(require('@bthwani/api-clients'), 'entity_list');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await dsh_partner_orders_list({ status: ['pending'] });

      expect(mockEntityList).toHaveBeenCalledWith({
        domain: 'DSH',
        entityType: 'order',
        actorType: 'partner',
        status: ['pending']
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('DEPRECATED'),
          operation: 'dsh_partner_orders_list'
        })
      );

      mockEntityList.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    test('dsh_order_get wrapper calls unified operation', async () => {
      const mockEntityGet = jest.spyOn(require('@bthwani/api-clients'), 'entity_get');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await dsh_order_get({ orderId: 'test-123' });

      expect(mockEntityGet).toHaveBeenCalledWith({
        entityId: 'test-123',
        domain: 'DSH'
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'dsh_order_get',
          unified_operation: 'entity_get'
        })
      );

      mockEntityGet.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Behavior Unification (Write Operations)', () => {
    test('dsh_captain_order_accept wrapper calls unified operation', async () => {
      const mockEntityAccept = jest.spyOn(require('@bthwani/api-clients'), 'entity_accept');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await dsh_captain_order_accept({ orderId: 'test-123', notes: 'Accepted by captain' });

      expect(mockEntityAccept).toHaveBeenCalledWith({
        entityId: 'test-123',
        domain: 'DSH',
        entityType: 'order',
        actorType: 'captain',
        notes: 'Accepted by captain'
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'dsh_captain_order_accept',
          unified_operation: 'entity_accept'
        })
      );

      mockEntityAccept.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    test('dsh_partner_order_accept wrapper calls unified operation', async () => {
      const mockEntityAccept = jest.spyOn(require('@bthwani/api-clients'), 'entity_accept');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await dsh_partner_order_accept({ orderId: 'test-456' });

      expect(mockEntityAccept).toHaveBeenCalledWith({
        entityId: 'test-456',
        domain: 'DSH',
        entityType: 'order',
        actorType: 'partner'
      });

      mockEntityAccept.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    test('dsh_captain_order_deliver wrapper calls unified operation', async () => {
      const mockEntityDeliver = jest.spyOn(require('@bthwani/api-clients'), 'entity_deliver');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await dsh_captain_order_deliver({
        orderId: 'test-789',
        verificationCode: '1234',
        recipientName: 'John Doe'
      });

      expect(mockEntityDeliver).toHaveBeenCalledWith({
        entityId: 'test-789',
        domain: 'DSH',
        entityType: 'order',
        actorType: 'captain',
        verificationCode: '1234',
        recipientName: 'John Doe'
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'dsh_captain_order_deliver',
          unified_operation: 'entity_deliver'
        })
      );

      mockEntityDeliver.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    test('dsh_partner_order_reject wrapper calls unified operation', async () => {
      const mockEntityReject = jest.spyOn(require('@bthwani/api-clients'), 'entity_reject');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await dsh_partner_order_reject({
        orderId: 'test-999',
        reason: 'busy',
        notes: 'Currently handling another order'
      });

      expect(mockEntityReject).toHaveBeenCalledWith({
        entityId: 'test-999',
        domain: 'DSH',
        entityType: 'order',
        actorType: 'partner',
        reason: 'busy',
        notes: 'Currently handling another order'
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'dsh_partner_order_reject',
          unified_operation: 'entity_reject'
        })
      );

      mockEntityReject.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Error Contract Consistency', () => {
    test('entity operations return standardized error format', async () => {
      try {
        await entity_get({
          entityId: 'non-existent-id',
          domain: 'DSH'
        });
      } catch (error) {
        expect(error).toHaveProperty('code', 'ENTITY_NOT_FOUND');
        expect(error).toHaveProperty('message');
        expect(error).toHaveProperty('domain', 'DSH');
        expect(error).toHaveProperty('details');
      }
    });
  });

  describe('Parameter Mapping', () => {
    test('wrapper parameters map correctly to unified operation', async () => {
      const mockEntityList = jest.spyOn(require('@bthwani/api-clients'), 'entity_list');

      await dsh_captain_orders_list({
        status: ['pending', 'accepted'],
        limit: 50,
        offset: 10
      });

      expect(mockEntityList).toHaveBeenCalledWith({
        domain: 'DSH',
        entityType: 'order',
        actorType: 'captain',
        status: ['pending', 'accepted'],
        limit: 50,
        offset: 10
      });

      mockEntityList.mockRestore();
    });
  });

  describe('Domain Isolation', () => {
    test('DSH operations only return DSH domain data', async () => {
      const result = await entity_list({
        domain: 'DSH',
        entityType: 'order'
      });

      // All returned entities should be from DSH domain
      if (result.data && result.data.length > 0) {
        result.data.forEach((entity: any) => {
          expect(entity.domain).toBe('DSH');
        });
      }
    });
  });

  describe('Performance Regression', () => {
    test('unified operations performance within acceptable range', async () => {
      const startTime = Date.now();

      await entity_list({
        domain: 'DSH',
        entityType: 'order',
        limit: 10
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(5000); // 5 seconds max
    });
  });
});
