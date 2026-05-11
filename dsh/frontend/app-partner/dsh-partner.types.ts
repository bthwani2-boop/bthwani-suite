export const DSH_PARTNER_OPERATIONAL_FLOW_IDS = [
  'order-accept',
  'order-get',
  'order-handoff',
  'order-alerts',
  'order-sla-risk',
  'order-issue-queue',
  'order-issue-required',
  'order-out-for-delivery',
  'order-prepare',
  'order-ready',
  'order-reject',
  'order-store-delivered',
  'order-chat-read-ack',
  'order-chat-send',
  'order-quick-reply-config',
  'order-quick-reply-settings',
  'order-quick-reply-setup',
  'inventory-adjust',
  'inventory-update',
  'items-upsert',
  'doc-upload',
  'intake-start',
  'store-nomination',
  'video-upload',
  'partner-finance-bridge',
  'partner-settlement-summary',
  'partner-commission-summary',
] as const;

export type DshPartnerOperationalFlowId = (typeof DSH_PARTNER_OPERATIONAL_FLOW_IDS)[number];

export type PartnerHubSection = 'hub' | 'profile' | 'operations' | 'inventory' | 'wallet' | 'analytics' | 'settings';

export type PartnerDshSurfaceState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshPartnerHubSurfaceProps = {
  state?: PartnerDshSurfaceState;
  section?: PartnerHubSection;
  onSectionChange?: (section: PartnerHubSection) => void;
  storeName?: string;
  branchLabel?: string;
  cityLabel?: string;
  managerLabel?: string;
  todayHoursLabel?: string;
  activeZoneLabel?: string;
  storeOpen?: boolean;
  listingEnabled?: boolean;
  serviceModes?: readonly { id: string; label: string; description: string; enabled: boolean }[];
  activeOrdersCount?: number;
  urgentOrdersCount?: number;
  pendingActionsCount?: number;
  onOpenOrdersBoard?: () => void;
  onOpenInventoryManagement?: () => void;
  onOpenStoreScope?: () => void;
  onOpenSupportDirectory?: () => void;
  onOpenWalletHub?: () => void;
  onOpenBell?: () => void;
  onOpenOperationalFlow?: (screenId: DshPartnerOperationalFlowId) => void;
  onOpenSupportScreen?: (screenId: DshPartnerOperationalFlowId) => void;
  canonicalStoreId?: string;
};
