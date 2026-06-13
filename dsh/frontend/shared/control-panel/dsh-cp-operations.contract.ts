/**
 * SCAFFOLD: DSH Control Panel operations workspace shared types.
 * Moved here from dsh/frontend/control-panel/operations/operations.types to
 * correct the dependency direction: archived seed data must not import from
 * dsh/frontend/control-panel.
 *
 * Owner: dsh/frontend/shared
 * Not a runtime binding — not API/backend source.
 */

import type { DshFulfillmentDeliveryMode } from './dsh-delivery-mode.model';

export const dshCpOperationsContractMeta = {
  dataKind: 'SCAFFOLD_PENDING_BINDING',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

/**
 * Operational fulfillment mode identifier — structurally identical to
 * DshFulfillmentDeliveryMode. Declared as an alias to preserve semantic
 * intent for operations-context consumers.
 */
export type DshFulfillmentOperationalMode = DshFulfillmentDeliveryMode;

/** A single row in the operations live-orders board preview fixture. */
export type DshOperationsOrderRow = {
  id: string;
  storeName: string;
  customerName: string;
  statusLabel: string;
  statusTone: 'warning' | 'danger' | 'success' | 'neutral';
  fulfillmentMode: DshFulfillmentOperationalMode;
  nextAction: string;
  slaLabel: string;
};
