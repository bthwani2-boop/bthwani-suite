// Re-export domain types from shared so consumers can import from one place.
export type {
  DshPartnerOperationalFlowId,
  DshPartnerSupportCommandContext,
  DshPartnerSupportCommandFilterId,
  DshPartnerSupportIssueCategoryId,
  DshPartnerSupportRouteId,
} from '../shared/partner';
export {
  DSH_PARTNER_OPERATIONAL_FLOW_IDS,
  DSH_PARTNER_HIDDEN_COMPAT_OPERATIONAL_FLOW_IDS,
  DSH_PARTNER_OPERATIONAL_FLOW_IDS_EXPECTED_COUNT,
  DSH_PARTNER_SUPPORT_ROUTE_IDS,
  DSH_PARTNER_SUPPORT_ISSUE_CATEGORY_IDS,
  DSH_PARTNER_HIDDEN_COMPAT_SUPPORT_ROUTE_IDS,
  DSH_PARTNER_SUPPORT_ROUTE_TO_OPERATIONAL_FLOW,
  DSH_PARTNER_OPERATIONAL_FLOW_TO_SUPPORT_ROUTE,
  mapDshPartnerOperationalFlowToSupportRoute,
  mapDshPartnerSupportRouteToOperationalFlow,
  isDshPartnerHiddenCompatOperationalFlow,
  isDshPartnerHiddenCompatSupportRoute,
} from '../shared/partner';

// UI-only: surface route identifiers and props.
export type DshPartnerRoute =
  | 'home'
  | 'entry'
  | 'inbox'
  | 'bell'
  | 'support-directory'
  | 'support-screen'
  | 'inventory-management'
  | 'order-rejection'
  | 'store-courier'
  | 'product-edit'
  | 'category-management'
  | 'product-media'
  | 'product-overrides';

export type DshPartnerSurfaceProps = {
  initialRoute?: DshPartnerRoute;
  initialOrderId?: string;
};

export type PartnerHubSection = 'hub' | 'profile' | 'operations' | 'inventory' | 'wallet' | 'analytics' | 'settings';

export type PartnerDshSurfaceState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshPartnerSurfaceId = DshPartnerRoute | 'wallet-bridge' | 'detail';

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
  onOpenOrdersSearch?: () => void;
  onOpenInventoryManagement?: () => void;
  onOpenStoreScope?: () => void;
  onOpenSupportDirectory?: () => void;
  onOpenWalletHub?: () => void;
  onOpenBell?: () => void;
  onOpenOperationalFlow?: (screenId: DshPartnerOperationalFlowId) => void;
  onOpenSupportScreen?: (screenId: DshPartnerSupportRouteId) => void;
  onOpenStoreCourierSetup?: () => void;
  onToggleAvailability?: (isAvailable: boolean) => void;
  canonicalStoreId?: string;
  dshAuthBearerToken?: string | null;
  dshClientId?: string | null;
  walletBalanceLabel?: string;
};
