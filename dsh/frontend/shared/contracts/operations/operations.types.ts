// Canonical location: dsh/frontend/shared/contracts/operations/operations.types.ts
// Authority: dsh/frontend/shared — moved from control-panel/operations/operations.types.ts

import type { DshFulfillmentDeliveryMode } from '../../dsh-client-binding.contracts';
export type { CanonicalOperationsGroupId } from '../dsh-operational.contract';

export type OperationsPanelId = 'detail' | 'chat' | 'batches';

export type DshFulfillmentOperationalMode = DshFulfillmentDeliveryMode;

export type OperationsFocusParams = {
  orderId?: string;
  customerId?: string;
  ticketId?: string;
  callId?: string;
  requestId?: string;
  panel?: OperationsPanelId;
  subGroup?: string;
};

export const DSH_FULFILLMENT_OPERATIONAL_MODE_META: Readonly<Record<DshFulfillmentOperationalMode, {
  readonly label: string;
  readonly operationalOwner: string;
  readonly requiresCaptain: boolean;
  readonly requiresPartnerCourier: boolean;
  readonly requiresCustomerPickup: boolean;
}>> = {
  bthwani_delivery: {
    label: 'توصيل بثواني',
    operationalOwner: 'الكابتن + بثواني',
    requiresCaptain: true,
    requiresPartnerCourier: false,
    requiresCustomerPickup: false,
  },
  partner_delivery: {
    label: 'توصيل الشريك',
    operationalOwner: 'ساعي الشريك',
    requiresCaptain: false,
    requiresPartnerCourier: true,
    requiresCustomerPickup: false,
  },
  pickup: {
    label: 'استلام ذاتي',
    operationalOwner: 'العميل + المتجر',
    requiresCaptain: false,
    requiresPartnerCourier: false,
    requiresCustomerPickup: true,
  },
} as const;

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

export type LegacyOperationsWorkspaceId =
  | 'overview'
  | 'orders'
  | 'dashboard'
  | 'dispatch-fleet'
  | 'tracking-handoff'
  | 'exceptions-sla'
  | 'partner-readiness'
  | 'proxy-shein-awnak'
  | 'audit-evidence'
  | 'captain-ops'
  | 'field-ops'
  | 'issues'
  | 'serviceability'
  | 'guard-status'
  | 'evidence'
  | 'order-detail'
  | 'orderchat'
  | 'assisted-order-desk'
  | 'order-rescue'
  | 'dispatch-assignment'
  | 'geo-heatmap'
  | 'sheinproxy'
  | 'awnak-operations'
  | 'captain-operations'
  | 'partner-stores'
  | 'area-capacity'
  | 'exceptions-escalations'
  | 'audit-support-sla'
  | 'dispatch'
  | 'live-tracking'
  | 'exceptions'
  | 'sla'
  | 'audit'
  | 'partner-prep'
  | 'handoff'
  | 'proof-review'
  | 'capacity'
  | 'partners'
  | 'catalogs'
  | 'catalog-categories'
  | 'marketing'
  | 'banners'
  | 'growth'
  | 'loyalty'
  | 'smart-signal'
  | 'reassign'
  | 'peak-mode'
  | 'bell'
  | 'arrival-bell'
  | 'zone-set'
  | 'live-map-capacity';

export type LegacySectionRedirectId =
  | 'support'
  | 'finance'
  | 'settlements'
  | 'cod'
  | 'refunds'
  | 'catalogs'
  | 'catalog-categories'
  | 'marketing'
  | 'banners'
  | 'growth'
  | 'loyalty'
  | 'smart-signal'
  | 'partners'
  | 'platform'
  | 'administration';

export type AnyOperationsWorkspaceId = import('../dsh-operational.contract').CanonicalOperationsGroupId | LegacyOperationsWorkspaceId | LegacySectionRedirectId | 'orders' | 'overview';

export type NonOperationsSectionRootId = 'support' | 'finance' | 'catalogs' | 'marketing' | 'partners' | 'platform' | 'administration';

export type OperationsSubGroupMeta = {
  id: string;
  label: string;
};

export type OperationsTertiaryFilterId = 'الكل' | 'في الطريق' | 'في الطريق' | 'فوق الحد' | 'أعلى خطر' | 'أدنى خطر';

export type OperationsGroupMeta = {
  id: import('../dsh-operational.contract').CanonicalOperationsGroupId;
  label: string;
  description: string;
  badge: string;
  subGroups?: readonly OperationsSubGroupMeta[];
  tertiaryFilters?: readonly OperationsTertiaryFilterId[];
};

export type OperationsNormalizationResult =
  | {
      kind: 'group';
      group: import('../dsh-operational.contract').CanonicalOperationsGroupId;
      sourceWorkspace?: AnyOperationsWorkspaceId;
      panel?: OperationsPanelId;
      subGroup?: string;
    }
  | {
      kind: 'redirect';
      sourceWorkspace: AnyOperationsWorkspaceId;
      section: NonOperationsSectionRootId;
      href: `/${NonOperationsSectionRootId}`;
    };

export type OperationsViewState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type StateViewCopy = {
  stateId?: 'loading' | 'empty' | 'offline' | 'recoverableError';
  kind?: 'warning';
  title: string;
  description: string;
  actionLabel: string;
};
