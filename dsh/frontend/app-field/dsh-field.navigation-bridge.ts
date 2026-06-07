/**
 * DSH Field Navigation Bridge
 * UI_PREVIEW_ONLY â€” CONTRACT_SCAFFOLD_PREVIEW_ONLY
 *
 * Maps field agent operational state to:
 *   - which route/screen the field surface should show
 *   - what happens after a visit completes (catalog update trigger â†’ partner intake)
 *   - how onboarding completion feeds the partner intake pipeline
 *   - how readiness escalation maps to control-panel context
 *   - field finance â†’ WLT settlement preview intent
 *
 * No API calls, no backend mutations. All WLT interaction is display-only.
 */

import type { DshFieldRoute } from './dsh-field.types';
import type { DshSignalEventKind } from '../shared/dsh-signal-layer.model';
import type { DshPartnerIntakeStage } from '../shared/workflow';
import { getHandoffsForSurface, type DshOrderLifecycleHandoff } from '../shared/dsh-order-lifecycle-handoffs';

// â”€â”€â”€ Field agent lifecycle state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type DshFieldAgentLifecycleState =
  | 'idle'                    // No active task
  | 'store_list_browsing'     // Reviewing store list
  | 'onboarding_in_progress'  // Onboarding a new store
  | 'onboarding_submitted'    // Onboarding form submitted â€” pending approval
  | 'visit_in_progress'       // Active visit to a store
  | 'visit_completed'         // Visit done â€” report submitted
  | 'readiness_check'         // Checking store readiness
  | 'readiness_escalating'    // Escalating readiness issue
  | 'finance_reviewing';      // Reviewing own commission/finance

// â”€â”€â”€ Route mapping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type DshFieldRouteMapping = {
  readonly lifecycleState: DshFieldAgentLifecycleState;
  readonly primaryRoute: DshFieldRoute;
  readonly label: string;
  readonly nextExpectedState?: DshFieldAgentLifecycleState;
};

export const DSH_FIELD_ROUTE_MAP: readonly DshFieldRouteMapping[] = [
  { lifecycleState: 'idle',                   primaryRoute: 'stores',               label: 'Ø§Ø³ØªØ¹Ø±Ø§Ø¶ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…ØªØ§Ø¬Ø±',       nextExpectedState: 'store_list_browsing' },
  { lifecycleState: 'store_list_browsing',    primaryRoute: 'stores',               label: 'ÙŠØ³ØªØ¹Ø±Ø¶ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…ØªØ§Ø¬Ø±',       nextExpectedState: 'visit_in_progress' },
  { lifecycleState: 'onboarding_in_progress', primaryRoute: 'onboarding',           label: 'ØªØ£Ù‡ÙŠÙ„ Ù…ØªØ¬Ø± Ø¬Ø¯ÙŠØ¯ Ø¬Ø§Ø±Ù',       nextExpectedState: 'onboarding_submitted' },
  { lifecycleState: 'onboarding_submitted',   primaryRoute: 'stores',               label: 'Ø·Ù„Ø¨ Ø§Ù„ØªØ£Ù‡ÙŠÙ„ Ù…ÙØ±Ø³ÙŽÙ„',          nextExpectedState: 'idle' },
  { lifecycleState: 'visit_in_progress',      primaryRoute: 'visit',                label: 'Ø²ÙŠØ§Ø±Ø© Ù†Ø´Ø·Ø© Ù„Ù„Ù…ØªØ¬Ø±',          nextExpectedState: 'visit_completed' },
  { lifecycleState: 'visit_completed',        primaryRoute: 'history',              label: 'Ø§Ù„Ø²ÙŠØ§Ø±Ø© Ù…ÙƒØªÙ…Ù„Ø© â€” Ø³Ø¬Ù„ Ø§Ù„Ø²ÙŠØ§Ø±Ø§Øª', nextExpectedState: 'idle' },
  { lifecycleState: 'readiness_check',        primaryRoute: 'visit',                label: 'ÙØ­Øµ Ø¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„Ù…ØªØ¬Ø±',          nextExpectedState: 'readiness_escalating' },
  { lifecycleState: 'readiness_escalating',   primaryRoute: 'readiness-escalation', label: 'ØªØµØ¹ÙŠØ¯ Ø§Ù„Ø¬Ø§Ù‡Ø²ÙŠØ©',              nextExpectedState: 'idle' },
  { lifecycleState: 'finance_reviewing',      primaryRoute: 'finance',              label: 'Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© ÙˆØ§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª',    nextExpectedState: 'idle' },
] as const;

export function getFieldRouteForLifecycle(
  state: DshFieldAgentLifecycleState,
): DshFieldRouteMapping {
  return DSH_FIELD_ROUTE_MAP.find((m) => m.lifecycleState === state)
    ?? DSH_FIELD_ROUTE_MAP[0]!;
}

// â”€â”€â”€ Visit outcome model â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type DshFieldVisitOutcome =
  | 'visit_ok'                    // Store is healthy â€” no action needed
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
    label: 'Ø²ÙŠØ§Ø±Ø© Ù…ÙƒØªÙ…Ù„Ø© â€” Ù„Ø§ Ù…ØªØ§Ø¨Ø¹Ø© Ù…Ø·Ù„ÙˆØ¨Ø©',
    nextRoute: 'history',
    nextLifecycleState: 'idle',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: false,
    signalKind: undefined,
    auditRequired: false,
  },
  {
    outcome: 'catalog_update_needed',
    label: 'ÙŠØ­ØªØ§Ø¬ ØªØ­Ø¯ÙŠØ« Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬ â€” Ù…ÙØ´ØºÙŽÙ‘Ù„ Ø·Ù„Ø¨ ØªØ­Ø¯ÙŠØ«',
    nextRoute: 'stores',
    nextLifecycleState: 'visit_completed',
    triggersCatalogUpdate: true,
    triggersControlPanelAlert: false,
    signalKind: 'catalog_item_approved',
    auditRequired: false,
  },
  {
    outcome: 'store_readiness_issue',
    label: 'Ù…Ø´ÙƒÙ„Ø© Ø¬Ø§Ù‡Ø²ÙŠØ© â€” ÙŠØ­ØªØ§Ø¬ ØªØµØ¹ÙŠØ¯',
    nextRoute: 'readiness-escalation',
    nextLifecycleState: 'readiness_escalating',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: true,
    signalKind: 'partner_capacity_degraded',
    auditRequired: true,
  },
  {
    outcome: 'compliance_issue',
    label: 'Ù…Ø´ÙƒÙ„Ø© Ø§Ù…ØªØ«Ø§Ù„ â€” ÙŠØ­ØªØ§Ø¬ ÙˆØ«Ø§Ø¦Ù‚',
    nextRoute: 'visit',
    nextLifecycleState: 'readiness_escalating',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: true,
    signalKind: 'partner_docs_missing',
    auditRequired: true,
  },
  {
    outcome: 'escalation_required',
    label: 'ØªØµØ¹ÙŠØ¯ Ù…Ø·Ù„ÙˆØ¨ â€” control-panel ÙŠØªÙˆÙ„Ù‰',
    nextRoute: 'readiness-escalation',
    nextLifecycleState: 'readiness_escalating',
    triggersCatalogUpdate: false,
    triggersControlPanelAlert: true,
    signalKind: 'ticket_escalated',
    auditRequired: true,
  },
  {
    outcome: 'onboarding_follow_up',
    label: 'Ù…ØªØ¬Ø± Ø¬Ø¯ÙŠØ¯ ÙŠØ­ØªØ§Ø¬ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¥Ø¯Ø±Ø§Ø¬',
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

// â”€â”€â”€ Onboarding â†’ partner intake pipeline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    label: 'Ø§Ù†ØªØ¸Ø§Ø± Ù…ÙˆØ§ÙÙ‚Ø© Ø§Ù„Ø´Ø±ÙŠÙƒ Ø¹Ù„Ù‰ Ø¥Ø¯Ø±Ø§Ø¬ Ø§Ù„Ø¹Ù†ØµØ±',
    fieldAgentFeedback: 'Ø·Ù„Ø¨ Ø§Ù„ØªØ£Ù‡ÙŠÙ„ Ø£ÙØ±Ø³Ù„ â€” ÙŠÙ†ØªØ¸Ø± Ø§Ù„Ø´Ø±ÙŠÙƒ Ù…Ø±Ø§Ø¬Ø¹ØªÙ‡',
    partnerFeedback: 'Ø·Ù„Ø¨ Ø¥Ø¯Ø±Ø§Ø¬ Ø¬Ø¯ÙŠØ¯ Ù…Ù† Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠ â€” ÙŠØ¬Ø¨ Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø©',
    controlPanelFeedback: 'Ù„Ø§ Ø¥Ø¬Ø±Ø§Ø¡ Ø¨Ø¹Ø¯ â€” ÙŠÙ†ØªØ¸Ø± ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø´Ø±ÙŠÙƒ',
    signalKind: 'partner_submitted',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    intakeStage: 'pending-marketing',
    reviewOwner: 'control-panel',
    label: 'Ø§Ù†ØªØ¸Ø§Ø± Ù…ÙˆØ§ÙÙ‚Ø© Ø§Ù„ØªØ³ÙˆÙŠÙ‚ Ø¹Ù„Ù‰ Ø§Ù„Ù†Ø´Ø±',
    fieldAgentFeedback: 'Ø§Ù„Ø´Ø±ÙŠÙƒ ÙˆØ§ÙÙ‚ â€” ÙŠÙ†ØªØ¸Ø± Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØªØ³ÙˆÙŠÙ‚',
    partnerFeedback: 'Ø£ÙØ­ÙŠÙ„ Ù„Ù„ØªØ³ÙˆÙŠÙ‚',
    controlPanelFeedback: 'Ø¨Ù†ÙˆØ¯ Ø¬Ø¯ÙŠØ¯Ø© ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØªØ³ÙˆÙŠÙ‚',
    signalKind: 'catalog_item_approved',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
  {
    intakeStage: 'published',
    reviewOwner: 'control-panel',
    label: 'ØªÙ… Ø§Ù„Ù†Ø´Ø± â€” Ø§Ù„Ø¹Ù†ØµØ± Ù…Ø±Ø¦ÙŠ Ù„Ù„Ø¹Ù…Ù„Ø§Ø¡',
    fieldAgentFeedback: 'ØªÙ… Ø¥Ø¯Ø±Ø§Ø¬ Ø§Ù„Ø¹Ù†ØµØ± ÙˆÙ†Ø´Ø±Ù‡ ÙÙŠ Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬',
    partnerFeedback: 'Ø§Ù„Ø¹Ù†ØµØ± Ù†Ø´Ø· ÙÙŠ Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬',
    controlPanelFeedback: 'Ø§Ù„Ø¹Ù†ØµØ± Ù…Ù†Ø´ÙˆØ± ÙÙŠ Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬ Ø§Ù„Ù…Ø¨Ø§Ø´Ø±',
    signalKind: 'catalog_published',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
] as const;

// â”€â”€â”€ Readiness escalation context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    label: 'Ø§Ù„Ù…ØªØ¬Ø± ØºÙŠØ± Ø¬Ø§Ù‡Ø² â€” ØªØµØ¹ÙŠØ¯ Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ù…Ù†ØµØ©',
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
    label: 'ÙˆØ«Ø§Ø¦Ù‚ Ù†Ø§Ù‚ØµØ© â€” ØªØµØ¹ÙŠØ¯ Ù„ÙØ±ÙŠÙ‚ Ø§Ù„Ø¥Ø¯Ø±Ø§Ø¬',
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
    label: 'Ø·Ø§Ù‚Ø© Ø§Ù„Ù…ØªØ¬Ø± Ù…Ù†Ø®ÙØ¶Ø© â€” ØªØµØ¹ÙŠØ¯ Ø¹Ø§Ø¬Ù„',
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
    label: 'ÙØ¬ÙˆØ© Ø§Ù…ØªØ«Ø§Ù„ â€” ØªØµØ¹ÙŠØ¯ Ù„Ù„Ø¯Ø¹Ù… ÙˆØ§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©',
    previewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  },
] as const;

export function getFieldReadinessEscalationContext(
  reason: string,
): DshFieldReadinessEscalationContext | undefined {
  return DSH_FIELD_READINESS_ESCALATION_MAP.find((e) => e.escalationReason === reason);
}

// â”€â”€â”€ Field finance WLT intent â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    label: 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠ â€” Ø¹Ø±Ø¶ ÙÙ‚Ø· Ù…Ù† WLT',
    displayOnly: true,
    mutationForbidden: true,
    wltOwner: 'wlt',
    dshRole: 'view_only',
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    routeHint: 'wlt/frontend/dsh/control-panel/screens/WltDshFieldCommissionStatement',
  },
  {
    intentKind: 'payout_display',
    label: 'Ø¯ÙØ¹Ø© Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠ â€” Ø¹Ø±Ø¶ ÙÙ‚Ø· Ù…Ù† WLT',
    displayOnly: true,
    mutationForbidden: true,
    wltOwner: 'wlt',
    dshRole: 'view_only',
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    routeHint: 'wlt/frontend/dsh/control-panel/screens/CaptainPayoutWorkspace',
  },
  {
    intentKind: 'settlement_display',
    label: 'ØªØ³ÙˆÙŠØ© Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠ â€” Ø¹Ø±Ø¶ ÙÙ‚Ø· Ù…Ù† WLT',
    displayOnly: true,
    mutationForbidden: true,
    wltOwner: 'wlt',
    dshRole: 'view_only',
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    routeHint: 'wlt/frontend/dsh/control-panel/screens/WltDshSettlementCalendar',
  },
] as const;

// â”€â”€â”€ Lifecycle handoff integration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Returns all lifecycle handoffs visible to the field surface.
 * Field agent observes but rarely triggers order transitions directly.
 */
export function getFieldObservableHandoffs(): readonly DshOrderLifecycleHandoff[] {
  return getHandoffsForSurface('app-field');
}
