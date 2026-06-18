// dsh/frontend/app-field/dsh-field.routes.ts
// Authority: app-field — unified configuration for routing, screen registry, policies, and types.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshFulfillmentDeliveryMode } from '../shared';
import type {
  PartnerFulfillmentModeAgreement,
  PartnerOnboardingSectionId,
  PartnerDocumentRuntimeStatus,
  PartnerOnboardingDraft,
  OnboardingStoreFile,
  PartnerSectionSummary,
  DshSignalEventKind,
  DshPartnerIntakeStage,
  DshOrderLifecycleHandoff,
  PartnerDocumentKind,
} from '../shared';
import {
  onboardingStatusLabels,
  onboardingStatusTones,
  partnerSectionOrder,
  partnerSectionLabels,
  getHandoffsForSurface,
} from '../shared';

// ─── Type Definitions (from old types file) ─────────────────────────────────

export type FieldFulfillmentMode = DshFulfillmentDeliveryMode;
export type FieldFulfillmentModeAgreement = PartnerFulfillmentModeAgreement;

export type FieldStatusTone = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type FieldLeadSource = 'candidate' | 'manual' | 'local-draft' | 'backend';

export type FieldLeadStatus =
  | 'new-lead'
  | 'visit-planned'
  | 'offer-pending-approval'
  | 'offer-approved'
  | 'appointment-scheduled'
  | 'visited'
  | 'follow-up-required'
  | 'ready-for-onboarding'
  | 'submitted';

export type FieldLeadFilter = 'all' | 'today' | 'ready' | 'follow-up' | 'pending' | 'submitted' | 'done';

export type DshFieldSurfaceId = 'stores' | 'onboarding' | 'visits' | 'finance' | 'profile';

export type FieldOnboardingSectionId = PartnerOnboardingSectionId;
export type FieldDocumentRuntimeStatus = PartnerDocumentRuntimeStatus;
/** @deprecated Use FieldDocumentRuntimeStatus */
export type FieldDocumentPreviewStatus = FieldDocumentRuntimeStatus;
export type FieldDocumentStatus = FieldDocumentRuntimeStatus;

export type FieldOnboardingDraft = PartnerOnboardingDraft;
export type FieldStoreFile = OnboardingStoreFile;
export type { OnboardingProductItem } from '../shared';
export type FieldSectionSummary = PartnerSectionSummary;

// ── Surface routing types ──────────────────────────────────────────────────

export type DshFieldRoute =
  | 'stores'
  | 'onboarding'
  | 'visit'
  | 'account'
  | 'profile'
  | 'history'
  | 'finance'
  | 'readiness-escalation'
  | 'document-upload'
  | 'products-upload';

export type DshFieldRouteState =
  | { kind: 'stores' }
  | { kind: 'onboarding'; storeId: string }
  | { kind: 'visit'; backendStoreId: string }
  | { kind: 'account' }
  | { kind: 'profile' }
  | { kind: 'history' }
  | { kind: 'finance' }
  | { kind: 'readiness-escalation'; storeId: string }
  | { kind: 'document-upload'; storeId: string; docKind?: PartnerDocumentKind }
  | { kind: 'products-upload'; storeId: string };

export type DshFieldCommandTarget = DshFieldRoute;

export type DshFieldNavigationCommand = {
  token: number;
  target: DshFieldCommandTarget;
  storeId?: string;
};

export type DshFieldSurfaceProps = {
  command?: DshFieldNavigationCommand;
  onExit?: () => void;
};

export type DshFieldSurfaceHostProps = DshFieldSurfaceProps;

// ── Visit contract ─────────────────────────────────────────────────────────

export const dshFieldVisitContractMeta = {
  dataKind: 'BACKEND_RUNTIME_BINDING_REQUIRED',
  runtimeTruth: true,
  backendSource: true,
  bindingSource: true,
} as const;

export type DshFieldStoreVisitState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldVisitEvidenceItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  capturedAtLabel: string;
};

export type DshFieldStoreVisitValues = {
  visitSummary: string;
  followUpAction: string;
};

export type DshFieldStoreVisitErrors = Partial<Record<keyof DshFieldStoreVisitValues, string>>;

// ── Labels and constants ────────────────────────────────────────────────────

export const fieldStatusLabels: Record<FieldLeadStatus, string> = {
  'new-lead': onboardingStatusLabels['new-lead'],
  'visit-planned': 'زيارة مخططة',
  'offer-pending-approval': onboardingStatusLabels['offer-pending-approval'],
  'offer-approved': onboardingStatusLabels['offer-approved'],
  'appointment-scheduled': 'جاهز للزيارة',
  visited: 'بانتظار تسجيل النتيجة',
  'follow-up-required': onboardingStatusLabels['follow-up-required'],
  'ready-for-onboarding': onboardingStatusLabels['ready-for-onboarding'],
  submitted: onboardingStatusLabels['submitted'],
};

export const fieldStatusTones: Record<FieldLeadStatus, FieldStatusTone> = {
  'new-lead': onboardingStatusTones['new-lead'],
  'visit-planned': 'info',
  'offer-pending-approval': onboardingStatusTones['offer-pending-approval'],
  'offer-approved': onboardingStatusTones['offer-approved'],
  'appointment-scheduled': 'brand',
  visited: 'info',
  'follow-up-required': onboardingStatusTones['follow-up-required'],
  'ready-for-onboarding': onboardingStatusTones['ready-for-onboarding'],
  submitted: onboardingStatusTones['submitted'],
};

export const fieldFilterOptions: readonly { id: FieldLeadFilter; label: string; tone: FieldStatusTone }[] = [
  { id: 'all', label: 'الكل', tone: 'default' },
  { id: 'today', label: 'اليوم', tone: 'brand' },
  { id: 'ready', label: 'جاهز للإضافة', tone: 'success' },
  { id: 'follow-up', label: 'تحتاج متابعة', tone: 'warning' },
  { id: 'pending', label: 'بانتظار اعتماد', tone: 'info' },
  { id: 'submitted', label: 'مرسل', tone: 'brand' },
  { id: 'done', label: 'منتهٍ للميداني', tone: 'success' },
] as const;

export const fieldSectionOrder = partnerSectionOrder;
export const fieldSectionLabels = partnerSectionLabels;

// ─── Route configurations (from old routes file) ─────────────────────────────

export type DshFieldRouteId =
  | 'dsh-field-stores'
  | 'dsh-field-onboarding'
  | 'dsh-field-visit'
  | 'dsh-field-account'
  | 'dsh-field-profile'
  | 'dsh-field-history'
  | 'dsh-field-finance'
  | 'dsh-field-readiness-escalation'
  | 'dsh-field-document-upload'
  | 'dsh-field-products-upload';

export type DshFieldLegacyRoute = DshFieldRoute;

export type DshFieldRouteRecord = {
  readonly routeId: DshFieldRouteId;
  readonly legacyRoute: DshFieldLegacyRoute;
  readonly screenId: string;
  readonly ownerPath: string;
};

export const dshFieldRoutes = [
  {
    routeId: 'dsh-field-stores',
    legacyRoute: 'stores',
    screenId: 'field.dsh.stores.list',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx',
  },
  {
    routeId: 'dsh-field-onboarding',
    legacyRoute: 'onboarding',
    screenId: 'field.dsh.store.onboarding',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx',
  },
  {
    routeId: 'dsh-field-visit',
    legacyRoute: 'visit',
    screenId: 'field.dsh.store.visit',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx',
  },
  {
    routeId: 'dsh-field-account',
    legacyRoute: 'account',
    screenId: 'field.dsh.account.home',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldProfileHomeScreen.tsx',
  },
  {
    routeId: 'dsh-field-profile',
    legacyRoute: 'profile',
    screenId: 'field.dsh.account.profile',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldProfileScreen.tsx',
  },
  {
    routeId: 'dsh-field-history',
    legacyRoute: 'history',
    screenId: 'field.dsh.stores.history',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoresHistoryScreen.tsx',
  },
  {
    routeId: 'dsh-field-finance',
    legacyRoute: 'finance',
    screenId: 'field.dsh.finance.overview',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldFinanceScreen.tsx',
  },
  {
    routeId: 'dsh-field-readiness-escalation',
    legacyRoute: 'readiness-escalation',
    screenId: 'field.dsh.store.readiness-escalation',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldReadinessEscalationScreen.tsx',
  },
  {
    routeId: 'dsh-field-document-upload',
    legacyRoute: 'document-upload',
    screenId: 'field.dsh.store.document-upload',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldDocumentUploadScreen.tsx',
  },
  {
    routeId: 'dsh-field-products-upload',
    legacyRoute: 'products-upload',
    screenId: 'field.dsh.store.products-upload',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreProductsUploadScreen.tsx',
  },
] as const satisfies readonly DshFieldRouteRecord[];

export type DshFieldRegistryRouteId = DshFieldRouteId | 'wlt-dsh-field-finance-bridge';

export type DshFieldScreenRegistryItem = {
  readonly screenId: string;
  readonly routeId: DshFieldRegistryRouteId;
  readonly surfaceId: 'app-field';
  readonly ownerKind: 'app' | 'service' | 'integration';
  readonly ownerId: 'app-field' | 'dsh' | 'wlt.dsh';
  readonly serviceId?: 'dsh' | 'wlt';
  readonly linkedServiceId?: 'dsh' | 'wlt';
  readonly ownerPath: string;
  readonly componentName: string;
  readonly screenKind: 'TAB_ROOT' | 'SCREEN_ENTRY' | 'FLOW_STEP' | 'MODAL' | 'SHEET';
  readonly flowId?: string;
  readonly requiredStates: readonly DshFieldScreenState[];
  readonly analytics: {
    readonly screenView: string;
  };
  readonly fallbackRouteId?: DshFieldRouteId;
  readonly releaseCriticality: 'P0' | 'P1' | 'P2';
  readonly status: DshFieldScreenRegistryStatus;
};

export type DshFieldScreenState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled'
  | 'retry'
  | 'blocked';

export type DshFieldScreenRegistryStatus =
  | 'READY_FOR_REVIEW'
  | 'VERIFIED'
  | 'DEPRECATED';

export const dshFieldScreenRegistry = [
  {
    screenId: 'field.dsh.stores.list',
    routeId: 'dsh-field-stores',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx',
    componentName: 'DshFieldStoresScreen',
    screenKind: 'TAB_ROOT',
    flowId: 'dsh.field.stores',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    analytics: { screenView: 'field_dsh_stores_list_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.store.onboarding',
    routeId: 'dsh-field-onboarding',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx',
    componentName: 'DshFieldStoreOnboardingScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.onboarding',
    requiredStates: ['success', 'disabled'],
    analytics: { screenView: 'field_dsh_store_onboarding_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.store.visit',
    routeId: 'dsh-field-visit',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx',
    componentName: 'DshFieldStoreVisitScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.visit',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled'],
    analytics: { screenView: 'field_dsh_store_visit_view' },
    fallbackRouteId: 'dsh-field-onboarding',
    releaseCriticality: 'P0',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.account.home',
    routeId: 'dsh-field-account',
    surfaceId: 'app-field',
    ownerKind: 'app',
    ownerId: 'app-field',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldProfileHomeScreen.tsx',
    componentName: 'DshFieldProfileHomeScreen',
    screenKind: 'SCREEN_ENTRY',
    flowId: 'dsh.field.account',
    requiredStates: ['success'],
    analytics: { screenView: 'field_dsh_account_home_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P1',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.account.profile',
    routeId: 'dsh-field-profile',
    surfaceId: 'app-field',
    ownerKind: 'app',
    ownerId: 'app-field',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldProfileScreen.tsx',
    componentName: 'DshFieldProfileScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.account',
    requiredStates: ['success'],
    analytics: { screenView: 'field_dsh_account_profile_view' },
    fallbackRouteId: 'dsh-field-account',
    releaseCriticality: 'P2',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.stores.history',
    routeId: 'dsh-field-history',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoresHistoryScreen.tsx',
    componentName: 'DshFieldStoresHistoryScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.history',
    requiredStates: ['empty', 'success'],
    analytics: { screenView: 'field_dsh_stores_history_view' },
    fallbackRouteId: 'dsh-field-account',
    releaseCriticality: 'P2',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.finance.overview',
    routeId: 'dsh-field-finance',
    surfaceId: 'app-field',
    ownerKind: 'integration',
    ownerId: 'wlt.dsh',
    serviceId: 'wlt',
    linkedServiceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldFinanceScreen.tsx',
    componentName: 'DshFieldFinanceScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.finance',
    requiredStates: ['loading', 'error', 'success', 'offline'],
    analytics: { screenView: 'field_dsh_finance_overview_view' },
    fallbackRouteId: 'dsh-field-account',
    releaseCriticality: 'P1',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.wlt.dsh.finance.bridge',
    routeId: 'wlt-dsh-field-finance-bridge',
    surfaceId: 'app-field',
    ownerKind: 'integration',
    ownerId: 'wlt.dsh',
    serviceId: 'wlt',
    linkedServiceId: 'dsh',
    ownerPath: 'wlt/frontend/dsh/app-field/WltDshFieldBridge.tsx',
    componentName: 'WltDshFieldBridge',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.finance',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'blocked'],
    analytics: { screenView: 'field_wlt_dsh_finance_bridge_view' },
    fallbackRouteId: 'dsh-field-finance',
    releaseCriticality: 'P1',
    status: 'VERIFIED',
  },
  {
    screenId: 'field.dsh.store.readiness-escalation',
    routeId: 'dsh-field-readiness-escalation',
    surfaceId: 'app-field',
    ownerKind: 'app',
    ownerId: 'app-field',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldReadinessEscalationScreen.tsx',
    componentName: 'DshFieldReadinessEscalationScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.stores',
    requiredStates: ['loading', 'success', 'error', 'blocked', 'retry'],
    analytics: { screenView: 'field_dsh_store_readiness_escalation_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P2',
    status: 'READY_FOR_REVIEW',
  },
  {
    screenId: 'field.dsh.store.document-upload',
    routeId: 'dsh-field-document-upload',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldDocumentUploadScreen.tsx',
    componentName: 'DshFieldDocumentUploadScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.stores',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled'],
    analytics: { screenView: 'field_dsh_store_document_upload_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P1',
    status: 'READY_FOR_REVIEW',
  },
  {
    screenId: 'field.dsh.store.products-upload',
    routeId: 'dsh-field-products-upload',
    surfaceId: 'app-field',
    ownerKind: 'service',
    ownerId: 'dsh',
    serviceId: 'dsh',
    ownerPath: 'dsh/frontend/app-field/screens/DshFieldStoreProductsUploadScreen.tsx',
    componentName: 'DshFieldStoreProductsUploadScreen',
    screenKind: 'FLOW_STEP',
    flowId: 'dsh.field.stores',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled'],
    analytics: { screenView: 'field_dsh_store_products_upload_view' },
    fallbackRouteId: 'dsh-field-stores',
    releaseCriticality: 'P1',
    status: 'READY_FOR_REVIEW',
  },
] as const satisfies readonly DshFieldScreenRegistryItem[];

// ─── Field agent lifecycle state & policies (from old policy file) ───────────

export type DshFieldAgentLifecycleState =
  | 'idle'                    // No active task
  | 'store_list_browsing'     // Reviewing store list
  | 'onboarding_in_progress'  // Onboarding a new store
  | 'onboarding_submitted'    // Onboarding form submitted — pending approval
  | 'visit_in_progress'       // Active visit to a store
  | 'visit_completed'         // Visit done — report submitted
  | 'readiness_check'         // Checking store readiness
  | 'readiness_escalating'    // Escalating readiness issue
  | 'finance_reviewing';      // Reviewing own commission/finance

export type DshFieldRouteMapping = {
  readonly lifecycleState: DshFieldAgentLifecycleState;
  readonly primaryRoute: DshFieldRoute;
  readonly label: string;
  readonly nextExpectedState?: DshFieldAgentLifecycleState;
};

export const DSH_FIELD_ROUTE_MAP: readonly DshFieldRouteMapping[] = [
  { lifecycleState: 'idle',                   primaryRoute: 'stores',               label: 'استعراض قائمة المتاجر',       nextExpectedState: 'store_list_browsing' },
  { lifecycleState: 'store_list_browsing',    primaryRoute: 'stores',               label: 'يستعرض قائمة المتاجر',       nextExpectedState: 'visit_in_progress' },
  { lifecycleState: 'onboarding_in_progress', primaryRoute: 'onboarding',           label: 'تأهيل متجر جديد جارٍ',       nextExpectedState: 'onboarding_submitted' },
  { lifecycleState: 'onboarding_submitted',   primaryRoute: 'stores',               label: 'طلب التأهيل مُرسَل',          nextExpectedState: 'idle' },
  { lifecycleState: 'visit_in_progress',      primaryRoute: 'visit',                label: 'زيارة نشطة للمتجر',          nextExpectedState: 'visit_completed' },
  { lifecycleState: 'visit_completed',        primaryRoute: 'history',              label: 'الزيارة مكتملة — سجل الزيارات', nextExpectedState: 'idle' },
  { lifecycleState: 'readiness_check',        primaryRoute: 'visit',                label: 'فحص جاهزية المتجر',          nextExpectedState: 'readiness_escalating' },
  { lifecycleState: 'readiness_escalating',   primaryRoute: 'readiness-escalation', label: 'تصعيد الجاهزية',              nextExpectedState: 'idle' },
  { lifecycleState: 'finance_reviewing',      primaryRoute: 'finance',              label: 'مراجعة المالية والعمولات',    nextExpectedState: 'idle' },
] as const;

export function getFieldRouteForLifecycle(
  state: DshFieldAgentLifecycleState,
): DshFieldRouteMapping {
  return DSH_FIELD_ROUTE_MAP.find((m) => m.lifecycleState === state)
    ?? DSH_FIELD_ROUTE_MAP[0]!;
}

export type DshFieldVisitOutcome =
  | 'visit_ok'                    // Store is healthy — no action needed
  | 'catalog_update_needed'       // Items need to be added/updated
  | 'store_readiness_issue'       // Store not ready to receive orders
  | 'compliance_issue'            // Documentation or compliance gap
  | 'escalation_required'         // Needs control-panel or partner attention
  | 'onboarding_follow_up';       // New store needs intake follow-up

export type DshFieldVisitOutcomeEntry = {
  readonly outcome: DshFieldVisitOutcome;
  readonly label: string;
  readonly nextRoute: DshFieldRoute;
  readonly nextLifecycleState: DshFieldAgentLifecycleState;
  /** Does this outcome trigger a catalog update signal to partner intake? */
  readonly triggersCatalogUpdate: boolean;
  /** Does this outcome trigger a control-panel alert? */
  readonly triggersControlPanelAlert: boolean;
  /** Signal emitted on this outcome */
  readonly signalKind?: DshSignalEventKind;
  readonly auditRequired: boolean;
};

export const DSH_FIELD_VISIT_OUTCOMES: readonly DshFieldVisitOutcomeEntry[] = [
  {
    outcome: 'visit_ok',
    label: 'زيارة مكتملة — لا متابعة مطلوبة',
    nextRoute: 'history',
    nextLifecycleState: 'idle',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: false,
    signalKind: undefined,
    auditRequired: false,
  },
  {
    outcome: 'catalog_update_needed',
    label: 'يحتاج تحديث الكتالوج — مُشغَّل طلب تحديث',
    nextRoute: 'stores',
    nextLifecycleState: 'visit_completed',
    triggersCatalogUpdate: true,
    triggersControlPanelAlert: false,
    signalKind: 'catalog_item_approved',
    auditRequired: false,
  },
  {
    outcome: 'store_readiness_issue',
    label: 'مشكلة جاهزية — يحتاج تصعيد',
    nextRoute: 'readiness-escalation',
    nextLifecycleState: 'readiness_escalating',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: true,
    signalKind: 'partner_capacity_degraded',
    auditRequired: true,
  },
  {
    outcome: 'compliance_issue',
    label: 'مشكلة امتثال — يحتاج وثائق',
    nextRoute: 'visit',
    nextLifecycleState: 'readiness_escalating',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: true,
    signalKind: 'partner_docs_missing',
    auditRequired: true,
  },
  {
    outcome: 'escalation_required',
    label: 'تصعيد مطلوب — control-panel يتولى',
    nextRoute: 'readiness-escalation',
    nextLifecycleState: 'readiness_escalating',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: true,
    signalKind: 'ticket_escalated',
    auditRequired: true,
  },
  {
    outcome: 'onboarding_follow_up',
    label: 'متجر جديد يحتاج متابعة الإدراج',
    nextRoute: 'onboarding',
    nextLifecycleState: 'onboarding_in_progress',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: false,
    signalKind: 'partner_submitted',
    auditRequired: false,
  },
] as const;

export function getFieldVisitOutcomeEntry(
  outcome: DshFieldVisitOutcome,
): DshFieldVisitOutcomeEntry {
  return DSH_FIELD_VISIT_OUTCOMES.find((o) => o.outcome === outcome)
    ?? DSH_FIELD_VISIT_OUTCOMES[0]!;
}

export type DshFieldOnboardingIntakeHandoff = {
  /** Stage in the partner intake pipeline this onboarding submission enters */
  readonly intakeStage: DshPartnerIntakeStage;
  /** Who reviews at this stage */
  readonly reviewOwner: 'app-field' | 'app-partner' | 'control-panel';
  readonly label: string;
  /** What the field agent sees after submission */
  readonly fieldAgentFeedback: string;
  /** What the partner app sees after field submits */
  readonly partnerFeedback: string;
  /** What control-panel sees */
  readonly controlPanelFeedback: string;
  readonly signalKind: DshSignalEventKind;
  readonly previewOnly: true;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
};

export const DSH_FIELD_ONBOARDING_INTAKE_HANDOFFS: readonly DshFieldOnboardingIntakeHandoff[] = [
  {
    intakeStage: 'pending-partner',
    reviewOwner: 'app-partner',
    label: 'انتظار موافقة الشريك على إدراج العنصر',
    fieldAgentFeedback: 'طلب التأهيل أُرسل — ينتظر الشريك مراجعته',
    partnerFeedback: 'طلب إدراج جديد من الميداني — يجب الموافقة',
    controlPanelFeedback: 'لا إجراء بعد — ينتظر تأكيد الشريك',
    signalKind: 'partner_submitted',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    intakeStage: 'pending-marketing',
    reviewOwner: 'control-panel',
    label: 'انتظار موافقة التسويق على النشر',
    fieldAgentFeedback: 'الشريك وافق — ينتظر مراجعة التسويق',
    partnerFeedback: 'أُحيل للتسويق',
    controlPanelFeedback: 'بنود جديدة في قائمة مراجعة التسويق',
    signalKind: 'catalog_item_approved',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    intakeStage: 'published',
    reviewOwner: 'control-panel',
    label: 'تم النشر — العنصر مرئي للعملاء',
    fieldAgentFeedback: 'تم إدراج العنصر ونشره في الكتالوج',
    partnerFeedback: 'العنصر نشط في الكتالوج',
    controlPanelFeedback: 'العنصر منشور في الكتالوج المباشر',
    signalKind: 'catalog_published',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
] as const;

export type DshFieldReadinessEscalationContext = {
  readonly escalationReason: string;
  readonly fieldRoute: DshFieldRoute;
  readonly controlPanelSection: 'operations' | 'support';
  readonly controlPanelWorkspace: string;
  readonly signalKind: DshSignalEventKind;
  readonly priority: 'normal' | 'important' | 'urgent';
  readonly label: string;
  readonly previewOnly: true;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
};

export const DSH_FIELD_READINESS_ESCALATION_MAP: readonly DshFieldReadinessEscalationContext[] = [
  {
    escalationReason: 'store_not_ready',
    fieldRoute: 'readiness-escalation',
    controlPanelSection: 'operations',
    controlPanelWorkspace: 'partner-capacity',
    signalKind: 'partner_capacity_degraded',
    priority: 'important',
    label: 'المتجر غير جاهز — تصعيد لعمليات المنصة',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    escalationReason: 'missing_documents',
    fieldRoute: 'readiness-escalation',
    controlPanelSection: 'operations',
    controlPanelWorkspace: 'partner-onboarding',
    signalKind: 'partner_docs_missing',
    priority: 'important',
    label: 'وثائق ناقصة — تصعيد لفريق الإدراج',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    escalationReason: 'store_capacity_degraded',
    fieldRoute: 'readiness-escalation',
    controlPanelSection: 'operations',
    controlPanelWorkspace: 'operations-overview',
    signalKind: 'partner_capacity_degraded',
    priority: 'urgent',
    label: 'طاقة المتجر منخفضة — تصعيد عاجل',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    escalationReason: 'compliance_gap',
    fieldRoute: 'readiness-escalation',
    controlPanelSection: 'support',
    controlPanelWorkspace: 'partner-compliance',
    signalKind: 'ticket_escalated',
    priority: 'important',
    label: 'فجوة امتثال — تصعيد للدعم والمراجعة',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
] as const;

export function getFieldReadinessEscalationContext(
  reason: string,
): DshFieldReadinessEscalationContext | undefined {
  return DSH_FIELD_READINESS_ESCALATION_MAP.find((e) => e.escalationReason === reason);
}

export type DshFieldFinanceWltIntent = {
  readonly intentKind: 'commission_display' | 'payout_display' | 'settlement_display';
  readonly label: string;
  readonly displayOnly: true;
  readonly mutationForbidden: true;
  readonly wltOwner: 'wlt';
  readonly dshRole: 'view_only';
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly routeHint: string;
};

export const DSH_FIELD_FINANCE_WLT_INTENTS: readonly DshFieldFinanceWltIntent[] = [
  {
    intentKind: 'commission_display',
    label: 'عمولة الميداني — عرض فقط من WLT',
    displayOnly: true,
    mutationForbidden: true,
    wltOwner: 'wlt',
    dshRole: 'view_only',
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    routeHint: 'wlt/frontend/dsh/control-panel/screens/WltDshFieldCommissionStatement',
  },
  {
    intentKind: 'payout_display',
    label: 'دفعة الميداني — عرض فقط من WLT',
    displayOnly: true,
    mutationForbidden: true,
    wltOwner: 'wlt',
    dshRole: 'view_only',
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    routeHint: 'wlt/frontend/dsh/control-panel/screens/CaptainPayoutWorkspace',
  },
  {
    intentKind: 'settlement_display',
    label: 'تسوية الميداني — عرض فقط من WLT',
    displayOnly: true,
    mutationForbidden: true,
    wltOwner: 'wlt',
    dshRole: 'view_only',
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    routeHint: 'wlt/frontend/dsh/control-panel/screens/WltDshSettlementCalendar',
  },
] as const;

export function getFieldObservableHandoffs(): readonly DshOrderLifecycleHandoff[] {
  return getHandoffsForSurface('app-field');
}
