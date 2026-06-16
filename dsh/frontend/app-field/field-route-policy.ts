/**
 * DSH Field Navigation Bridge
 * CONTRACT_SCAFFOLD — Not UI preview. This file is live runtime code.
 * contractState 'CONTRACT_SCAFFOLD_PREVIEW_ONLY' means the WLT field-visit settlement binding is scaffolded (J-010).
 *
 * Maps field agent operational state to:
 *   - which route/screen the field surface should show
 *   - what happens after a visit completes (catalog update trigger → partner intake)
 *   - how onboarding completion feeds the partner intake pipeline
 *   - how readiness escalation maps to control-panel context
 *   - field finance → WLT settlement preview intent
 *
 * No API calls, no backend mutations. All WLT interaction is display-only.
 */

import type { DshFieldRoute } from './dsh-field.types';
import type { DshSignalEventKind } from '../shared';
import type { DshPartnerIntakeStage } from '../shared';
import { getHandoffsForSurface, type DshOrderLifecycleHandoff } from '../shared';

// ─── Field agent lifecycle state ──────────────────────────────────────────────

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

// ─── Route mapping ────────────────────────────────────────────────────────────

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

// ─── Visit outcome model ──────────────────────────────────────────────────────

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

// ─── Onboarding → partner intake pipeline ────────────────────────────────────

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

// ─── Readiness escalation context ────────────────────────────────────────────

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

// ─── Field finance WLT intent ─────────────────────────────────────────────────

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

// ─── Lifecycle handoff integration ────────────────────────────────────────────

/**
 * Returns all lifecycle handoffs visible to the field surface.
 * Field agent observes but rarely triggers order transitions directly.
 */
export function getFieldObservableHandoffs(): readonly DshOrderLifecycleHandoff[] {
  return getHandoffsForSurface('app-field');
}
