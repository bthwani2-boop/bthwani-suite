// DSH Partner domain — operational flows, intake, workspace, scope, profile types.
// No JSX. No ui-kit. No Tamagui.

import type { DshFulfillmentDeliveryMode } from '../../delivery';

// ── Operational Flows ──────────────────────────────────────────────────────

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

export const DSH_PARTNER_OPERATIONAL_FLOW_IDS_EXPECTED_COUNT = DSH_PARTNER_OPERATIONAL_FLOW_IDS.length;

export const DSH_PARTNER_SUPPORT_ROUTE_IDS = [
  'auction-status-update',
  'chat-read-ack',
  'chat-send',
  'doc-upload',
  'intake-start',
  'inventory-adjust',
  'inventory-update',
  'items-upsert',
  'order-accept',
  'order-get',
  'order-handoff',
  'order-issue-queue',
  'order-out-for-delivery',
  'order-prepare',
  'order-ready',
  'order-reject',
  'order-store-delivered',
  'quick-reply-config',
  'quick-reply-settings',
  'quick-reply-setup',
  'store-nomination',
  'video-upload',
] as const;

export type DshPartnerSupportRouteId = (typeof DSH_PARTNER_SUPPORT_ROUTE_IDS)[number];

export const DSH_PARTNER_SUPPORT_ISSUE_CATEGORY_IDS = [
  'delayed-preparation',
  'item-unavailable',
  'partner-reject-request',
  'courier-not-arrived',
  'customer-not-responding',
  'handoff-mismatch',
  'wrong-item',
  'payment-refund-review',
] as const;

export type DshPartnerSupportIssueCategoryId = (typeof DSH_PARTNER_SUPPORT_ISSUE_CATEGORY_IDS)[number];

export type DshPartnerSupportCommandFilterId =
  | 'all'
  | 'active-orders'
  | 'order-issues'
  | 'conversations'
  | 'inventory-branch'
  | 'escalation'
  | 'urgent';

export type DshPartnerSupportCommandContext = {
  filterId: DshPartnerSupportCommandFilterId;
  highlightedCaseId?: string | null;
  highlightedIssueCategoryId?: DshPartnerSupportIssueCategoryId | null;
  preferredOperationalFlowId?: DshPartnerOperationalFlowId | null;
  preferredSupportRouteId?: DshPartnerSupportRouteId | null;
  source?: 'operations' | 'bell' | 'settings' | 'orders' | 'hub';
};

export const DSH_PARTNER_HIDDEN_COMPAT_SUPPORT_ROUTE_IDS = [
  'auction-status-update',
] as const satisfies readonly DshPartnerSupportRouteId[];

export const DSH_PARTNER_HIDDEN_COMPAT_OPERATIONAL_FLOW_IDS = [
  'order-alerts',
  'order-sla-risk',
  'order-issue-required',
  'partner-finance-bridge',
  'partner-settlement-summary',
  'partner-commission-summary',
] as const satisfies readonly DshPartnerOperationalFlowId[];

export const DSH_PARTNER_SUPPORT_ROUTE_TO_OPERATIONAL_FLOW: Record<DshPartnerSupportRouteId, DshPartnerOperationalFlowId | null> = {
  'auction-status-update': null,
  'chat-read-ack': 'order-chat-read-ack',
  'chat-send': 'order-chat-send',
  'doc-upload': 'doc-upload',
  'intake-start': 'intake-start',
  'inventory-adjust': 'inventory-adjust',
  'inventory-update': 'inventory-update',
  'items-upsert': 'items-upsert',
  'order-accept': 'order-accept',
  'order-get': 'order-get',
  'order-handoff': 'order-handoff',
  'order-issue-queue': 'order-issue-queue',
  'order-out-for-delivery': 'order-out-for-delivery',
  'order-prepare': 'order-prepare',
  'order-ready': 'order-ready',
  'order-reject': 'order-reject',
  'order-store-delivered': 'order-store-delivered',
  'quick-reply-config': 'order-quick-reply-config',
  'quick-reply-settings': 'order-quick-reply-settings',
  'quick-reply-setup': 'order-quick-reply-setup',
  'store-nomination': 'store-nomination',
  'video-upload': 'video-upload',
};

export const DSH_PARTNER_OPERATIONAL_FLOW_TO_SUPPORT_ROUTE: Record<DshPartnerOperationalFlowId, DshPartnerSupportRouteId | null> = {
  'order-accept': 'order-accept',
  'order-get': 'order-get',
  'order-handoff': 'order-handoff',
  'order-alerts': null,
  'order-sla-risk': null,
  'order-issue-queue': 'order-issue-queue',
  'order-issue-required': null,
  'order-out-for-delivery': 'order-out-for-delivery',
  'order-prepare': 'order-prepare',
  'order-ready': 'order-ready',
  'order-reject': 'order-reject',
  'order-store-delivered': 'order-store-delivered',
  'order-chat-read-ack': 'chat-read-ack',
  'order-chat-send': 'chat-send',
  'order-quick-reply-config': 'quick-reply-config',
  'order-quick-reply-settings': 'quick-reply-settings',
  'order-quick-reply-setup': 'quick-reply-setup',
  'inventory-adjust': 'inventory-adjust',
  'inventory-update': 'inventory-update',
  'items-upsert': 'items-upsert',
  'doc-upload': 'doc-upload',
  'intake-start': 'intake-start',
  'store-nomination': 'store-nomination',
  'video-upload': 'video-upload',
  'partner-finance-bridge': null,
  'partner-settlement-summary': null,
  'partner-commission-summary': null,
};

// ── Intake Types ───────────────────────────────────────────────────────────
// DshPartnerIntakeSource, DshPartnerIntakeItem, DshPartnerIntakeMetric are canonical
// in state-machines/workflow — re-exported via shared/state-machines topic.

export type DshPartnerIntakeQueue = 'offer-approval' | 'partner-review' | 'marketing-review';

export type DshPartnerFulfillmentMode = DshFulfillmentDeliveryMode;

export type DshPartnerModeAgreement = {
  mode: DshPartnerFulfillmentMode;
  modeLabel: string;
  enabled: boolean;
  /** SCAFFOLD - actual rate lives in WLT commission engine */
  commissionRatePreview: string;
  settlementBasis: string;
  operationalReadiness: 'ready' | 'pending' | 'unavailable';
  validityLabel: string;
  negotiationNote?: string;
};

export type DshPartnerFulfillmentAgreement = {
  partnerId: string;
  storeName: string;
  categoryLabel: string;
  modes: readonly DshPartnerModeAgreement[];
};

// ── Workspace Types ────────────────────────────────────────────────────────

export type PartnerWorkspaceTabId =
  | 'inbox'
  | 'activation'
  | 'documents'
  | 'readiness_escalations'
  | 'readiness_approvals'
  | 'overrides'
  | 'performance'
  | 'eligibility'
  | 'topology'
  | 'contracts'
  | 'deactivation';

export type PartnerSubTabItem = {
  id: string;
  label: string;
};

export type PartnerWorkspaceTabItem = {
  id: PartnerWorkspaceTabId;
  label: string;
};

export const PARTNER_PRIMARY_TABS: readonly PartnerWorkspaceTabItem[] = [
  { id: 'inbox', label: 'الوارد الجديد' },
  { id: 'activation', label: 'تفعيل الشريك' },
  { id: 'documents', label: 'وثائق الشراكة' },
  { id: 'readiness_escalations', label: 'تصاعد الجاهزية' },
  { id: 'readiness_approvals', label: 'اعتمادات الجاهزية' },
  { id: 'overrides', label: 'تجاوزات الكاتالوج' },
  { id: 'performance', label: 'الأداء والإحصاءات' },
  { id: 'eligibility', label: 'أهلية الترويج' },
  { id: 'topology', label: 'مستويات الخدمة' },
  { id: 'contracts', label: 'إدارة العقود والإحصاءات' },
  { id: 'deactivation', label: 'إلغاء التفعيل' },
];

export const PARTNER_SUB_TAB_DEFINITIONS: Partial<Record<PartnerWorkspaceTabId, readonly PartnerSubTabItem[]>> = {
  inbox: [
    { id: 'registration', label: 'طلبات التسجيل' },
    { id: 'modifications', label: 'تعديل البيانات' },
    { id: 'complaints', label: 'شكاوى الشراكة' },
  ],
  performance: [
    { id: 'performance', label: 'الأداء والسرعة' },
    { id: 'disputes', label: 'النزاعات والاستفسار' },
    { id: 'visibility', label: 'الظهور والتمييز' },
  ],
  eligibility: [
    { id: 'benefits', label: 'المزايا والعروض' },
  ],
};

// ── Scope and Profile ──────────────────────────────────────────────────────

export type PartnerStoreScopeOption = {
  id: string;
  label: string;
  description: string;
};

export const storeScopeOptions: readonly PartnerStoreScopeOption[] = [
  { id: 'all', label: 'كل الفروع', description: 'عرض موحّد لكل فروع الشريك.' },
  { id: 'fakhama-1', label: 'الفخامة 1', description: 'الفرع الأساسي الحالي.' },
  { id: 'fakhama-2', label: 'الفخامة 2', description: 'فرع المدينة الثاني للتشغيل.' },
  { id: 'fakhama-3', label: 'الفخامة 3', description: 'فرع داعم لنطاق الطلبات الممتد.' },
] as const;

export type PartnerRuntimeProfile = {
  storeName: string;
  branchLabel: string;
  cityLabel: string;
  managerLabel: string;
  todayHoursLabel: string;
  activeZoneLabel: string;
};

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

export type PartnerHubSection = 'hub' | 'profile' | 'operations' | 'inventory' | 'wallet' | 'analytics' | 'settings';
