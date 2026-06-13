import type { DshFulfillmentDeliveryMode } from '../../app-client/contracts/dsh-client-binding.contracts';
export type { CanonicalOperationsGroupId } from '../../shared/dsh-operational.contract';

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
    operationalOwner: 'بثواني + كابتن',
    requiresCaptain: true,
    requiresPartnerCourier: false,
    requiresCustomerPickup: false,
  },
  partner_delivery: {
    label: 'توصيل المتجر',
    operationalOwner: 'مندوب المتجر',
    requiresCaptain: false,
    requiresPartnerCourier: true,
    requiresCustomerPickup: false,
  },
  pickup: {
    label: 'استلام بنفسي',
    operationalOwner: 'عميل + متجر',
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
  // demoted canonical group IDs (now legacy aliases)
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

export type AnyOperationsWorkspaceId = CanonicalOperationsGroupId | LegacyOperationsWorkspaceId | LegacySectionRedirectId | 'orders' | 'overview';

export type NonOperationsSectionRootId = 'support' | 'finance' | 'catalogs' | 'marketing' | 'partners' | 'platform' | 'administration';

export type OperationsSubGroupMeta = {
  id: string;
  label: string;
};

export type OperationsTertiaryFilterId = 'الآن' | '١٥ دقيقة' | '٣٠ دقيقة' | 'خطر عالٍ' | 'نقص كباتن' | 'ضغط متاجر';

export type OperationsGroupMeta = {
  id: CanonicalOperationsGroupId;
  label: string;
  description: string;
  badge: string;
  subGroups?: readonly OperationsSubGroupMeta[];
  tertiaryFilters?: readonly OperationsTertiaryFilterId[];
};

export type OperationsNormalizationResult =
  | {
      kind: 'group';
      group: CanonicalOperationsGroupId;
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
