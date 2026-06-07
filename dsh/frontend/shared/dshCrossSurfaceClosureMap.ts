export type DshSurfaceId = 'app-client' | 'app-partner' | 'app-captain' | 'app-field' | 'control-panel';

export type DshLegacySurfaceId = 'client' | 'partner' | 'captain' | 'field';

export type DshSurfaceLookupId = DshSurfaceId | DshLegacySurfaceId;

export type DshClosureDomain =
  | 'client-discovery'
  | 'client-checkout'
  | 'client-tracking-support'
  | 'partner-operations'
  | 'partner-catalog'
  | 'captain-operations'
  | 'field-operations'
  | 'control-panel-operations'
  | 'control-panel-support'
  | 'control-panel-finance';

/**
 * DSH Closure Status â€” Ø¯Ù‚ÙŠÙ‚ ÙˆØºÙŠØ± ÙˆÙ‡Ù…ÙŠ.
 *
 * Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯:
 * - 'verified-ui-flow'        : ÙŠØªØ·Ù„Ø¨ routeProof + screenProof + stateCoverageProof + visualEvidenceStatus='captured' + crossSurfaceProof.
 * - 'preview-ready'           : Ø´Ø§Ø´Ø§Øª Ù…Ø³Ø¬Ù‘Ù„Ø© ÙˆÙ…Ø±Ø¨ÙˆØ·Ø© Ø¨Ù…Ø³Ø§Ø±Ø§ØªØŒ Ù„ÙƒÙ† Ù„Ø§ ÙŠÙˆØ¬Ø¯ visual evidence Ø¨Ø¹Ø¯.
 * - 'needs-visual-evidence'   : Ø´Ø§Ø´Ø§Øª Ù…ÙˆØ¬ÙˆØ¯Ø© Ù„ÙƒÙ† ÙŠØºÙŠØ¨ Ø¥Ø«Ø¨Ø§Øª Ø¨ØµØ±ÙŠ.
 * - 'needs-cross-surface-proof': ÙŠØ­ØªØ§Ø¬ Ø¥Ø«Ø¨Ø§Øª ØªÙ†Ø§Ø³Ù‚ Ø¹Ø¨Ø± Ø§Ù„Ø£Ø³Ø·Ø­ (actor-to-actor).
 * - 'blocked-by-contract'     : Ù…Ø­Ø¬ÙˆØ¨ Ø¨Ø³Ø¨Ø¨ Ø¹Ù‚Ø¯ backend/API ØºÙŠØ± Ø¬Ø§Ù‡Ø².
 * - 'blocked-by-wlt'          : Ù…Ø­Ø¬ÙˆØ¨ Ù„Ø£Ù† Ø§Ù„Ù‚Ø±Ø§Ø±/Ø§Ù„Ù…ØµØ¯Ø± ÙŠØ¹ÙˆØ¯ Ù„Ù€ WLT Ø­ØµØ±Ù‹Ø§.
 * - 'needs-evidence'          : ÙŠØ­ØªØ§Ø¬ Ø£ÙŠ Ø¯Ù„ÙŠÙ„ (Ø¥Ø±Ø«).
 * - 'needs-ui-flow'           : Ù„Ù… ÙŠÙØ¨Ù†ÙŽ Ø§Ù„Ù…Ø³Ø§Ø± Ø¨Ø¹Ø¯ (Ø¥Ø±Ø«).
 * - 'blocked'                 : Ù…Ø­Ø¬ÙˆØ¨ Ø¹Ø§Ù… (Ø¥Ø±Ø«).
 *
 * Ù…Ù…Ù†ÙˆØ¹: Ø§Ø³ØªØ®Ø¯Ø§Ù… 'closed' Ø¥Ù„Ø§ Ø¨Ø¹Ø¯ ØªÙˆÙØ± Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¥Ø«Ø¨Ø§ØªØ§Øª Ø§Ù„Ø®Ù…Ø³Ø© ÙÙŠ Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù€ proof.
 */
export type DshClosureStatus =
  | 'verified-ui-flow'
  | 'preview-ready'
  | 'needs-visual-evidence'
  | 'blocked-by-contract'
  | 'blocked-by-wlt';

export type DshRuntimeBindingStatus =
  | 'UI_PREVIEW_ONLY'
  | 'NEEDS_BINDING_LATER'
  | 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT'
  | 'NEEDS_RUNTIME_EVIDENCE'
  | 'BLOCKED'
  | 'BLOCKED_BY_CONTRACT'
  | 'BLOCKED_BY_WLT';

export type DshClosureEvidenceStatus =
  | 'PASS'
  | 'captured'
  | 'needs-visual-evidence'
  | 'verified-ui-flow'
  | 'blocked-by-contract'
  | 'blocked-by-wlt';

export function translateDshRuntimeBindingStatus(status: DshRuntimeBindingStatus): string {
  switch (status) {
    case 'UI_PREVIEW_ONLY':
      return 'Ù…Ø¹Ø§ÙŠÙ†Ø© ÙˆØ§Ø¬Ù‡Ø© ÙÙ‚Ø·';
    case 'NEEDS_BINDING_LATER':
      return 'ÙŠØ­ØªØ§Ø¬ Ø±Ø¨Ø·Ù‹Ø§ Ù„Ø§Ø­Ù‚Ù‹Ø§';
    case 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT':
      return 'Ø¹Ù…ÙŠÙ„ API Ù…Ø±Ø¨ÙˆØ· Ù…Ø¹ Ø¯Ù„ÙŠÙ„ ØªØ´ØºÙŠÙ„';
    case 'NEEDS_RUNTIME_EVIDENCE':
      return 'ÙŠØ­ØªØ§Ø¬ Ø¯Ù„ÙŠÙ„ ØªØ´ØºÙŠÙ„';
    case 'BLOCKED':
      return 'Ù…Ø­Ø¬ÙˆØ¨';
    case 'BLOCKED_BY_CONTRACT':
      return 'Ù…Ø­Ø¬ÙˆØ¨ Ø¨Ø³Ø¨Ø¨ Ø§Ù„Ø¹Ù‚Ø¯';
    case 'BLOCKED_BY_WLT':
      return 'Ù…Ø­Ø¬ÙˆØ¨ Ø¨Ø³Ø¨Ø¨ WLT';
    default:
      return status;
  }
}

export type DshActor = 'client' | 'partner' | 'captain' | 'field' | 'operator';

export type DshLifecycleStep =
  | 'discovery'
  | 'cart'
  | 'checkout'
  | 'order-intake'
  | 'partner-preparation'
  | 'pickup'
  | 'delivery'
  | 'tracking'
  | 'support'
  | 'rating'
  | 'onboarding'
  | 'visit'
  | 'operations-monitoring'
  | 'operations-intervention'
  | 'finance-review'
  | 'catalog-governance';

export type DshCounterpartLink = {
  surfaceId: DshSurfaceId;
  routeHint: string;
  label: string;
  runtimeBindingStatus: DshRuntimeBindingStatus;
};

export type DshCrossSurfaceSignal = {
  id: string;
  sourceSurface: DshSurfaceId;
  affectedSurface: DshSurfaceId;
  actor: DshActor;
  lifecycleStep: DshLifecycleStep;
  entityId: string;
  entityLabel: string;
  status: string;
  risk: string;
  owner: string;
  evidence: string;
  nextAction: string;
  expectedImpact: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  counterpartRouteHint: string;
  runtimeBindingStatus: DshRuntimeBindingStatus;
  counterpartLinks?: readonly DshCounterpartLink[];
};

export type DshClosureArea =
  | 'client-discovery'
  | 'client-cart-checkout'
  | 'client-tracking-support'
  | 'partner-intake-prep'
  | 'partner-catalog-readiness'
  | 'captain-task-pickup'
  | 'captain-delivery-proof'
  | 'field-onboarding'
  | 'field-visit-evidence'
  | 'control-panel-ops'
  | 'control-panel-support'
  | 'control-panel-governance';

export type DshCrossSurfaceClosureItem = {
  surfaceId: DshSurfaceId;
  actor: DshActor;
  area: DshClosureArea;
  domain: DshClosureDomain;
  step: DshLifecycleStep;
  status: DshClosureStatus;
  runtimeBindingStatus: DshRuntimeBindingStatus;
  title: string;
  description: string;
  routeHint: string;
  screenOwner: string;
  primaryAction: string;
  requiredStates: readonly string[];
  evidenceStatus: DshClosureEvidenceStatus;
  remainingBlocker: string;
  crossSurfaceDependencies: readonly string[];
  wltBoundary: string;
  visualEvidenceRequired: boolean;
  evidenceHint: string;
  runtimeEvidenceHint?: string;
  /**
   * Proof metadata â€” Ù…Ø·Ù„ÙˆØ¨Ø© Ù‚Ø¨Ù„ Ø§Ù„ØªØ±Ù‚ÙŠØ© Ø¥Ù„Ù‰ 'verified-ui-flow'.
   * ØºÙŠØ§Ø¨Ù‡Ø§ ÙŠØ¹Ù†ÙŠ Ø£Ù† Ø§Ù„Ø¥ØºÙ„Ø§Ù‚ ØºÙŠØ± Ù…ÙƒØªÙ…Ù„ Ø¨ØµØ±Ù Ø§Ù„Ù†Ø¸Ø± Ø¹Ù† status.
   */
  readonly routeProof?: string;
  readonly screenProof?: string;
  readonly stateCoverageProof?: string;
  readonly crossSurfaceProof?: string;
};

export const DSH_CROSS_SURFACE_CLOSURE_MAP: readonly DshCrossSurfaceClosureItem[] = [
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-discovery',
    domain: 'client-discovery',
    step: 'discovery',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ù…ØªØ§Ø¬Ø±',
    description: 'Ø´Ø§Ø´Ø§Øª Ø§Ù„Ø§ÙƒØªØ´Ø§Ù ÙˆØ§Ù„Ø¨Ø­Ø« ÙˆØ§Ù„ÙƒØªØ§Ù„ÙˆØ¬ ØµØ§Ø±Øª Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ø¨ÙˆØ§Ø¨Ø© Ø±Ø¤ÙŠØ© Ù…ÙˆØ­Ø¯Ø© Ù„Ù„Ø¹Ù…ÙŠÙ„. Ø§Ù„Ù…Ù†Ø·Ù‚ Ù…ÙƒØªÙ…Ù„ØŒ ÙˆØ§Ù„Ø¥Ø«Ø¨Ø§Øª Ø§Ù„Ø¨ØµØ±ÙŠ Ù…Ù„ØªÙ‚Ø· (VR-L1-001, VR-L1-023, VR-L1-005).',
    screenOwner: 'dsh/frontend/app-client/screens/HomeScreen.tsx + SearchScreen.tsx + StoreScreen.tsx',
    primaryAction: 'ÙØªØ­ ÙˆØ¬Ù‡Ø© Ø£Ùˆ Ù…ØªØ¬Ø± Ø£Ùˆ ÙØ¦Ø© Ù…Ù† Ø³Ø·Ø­ Ø§Ù„Ø§ÙƒØªØ´Ø§Ù.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; app-client (VR-L1-001, VR-L1-023, VR-L1-005), partner catalog (VR-L1-009), control-panel catalogs (VR-L2-008, VR-L2-009), and control-panel marketing visibility (VR-L2-012) visual evidence are captured and locked. E2E runtime and API binding proof for all surfaces remains deferred.',
    crossSurfaceDependencies: [
      'control-panel marketing publish controls',
      'app-partner inventory and availability readiness',
      'shared marketing visibility contract',
    ],
    wltBoundary: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù„ÙƒÙŠØ© Ù…Ø§Ù„ÙŠØ© Ù„Ù€ WLT ÙÙŠ discovery. ØªØ¨Ø¯Ø£ Ø­Ø¯ÙˆØ¯ WLT Ø¨Ø¹Ø¯ checkout intent ÙÙ‚Ø·.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù€ HomeScreen ÙˆSearchScreen ÙˆStoreScreen Ø¨Ø¹Ø¯ Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø±Ø¤ÙŠØ© Ø§Ù„Ù…ÙˆØ­Ø¯Ø©.',
    routeHint: '/app-client/discovery',
    routeProof: 'dsh-home, dsh-search, dsh-store â€” registered in dsh-client.screen-registry.ts',
    screenProof: 'DshHomeGetScreen, DshSearchScreen, DshStoreGetScreen â€” VERIFIED in registry',
    stateCoverageProof: 'loading, empty, error, success, offline â€” declared',
    crossSurfaceProof: 'HomeScreen ÙˆDshClientSurface ÙˆStoreScreen Ø£ØµØ¨Ø­Øª ØªØ³ØªÙ‡Ù„Ùƒ resolveDshStoreClientVisibility() Ù…Ù† shared gate ÙˆØ§Ø­Ø¯ØŒ Ù…Ø§ ÙŠØ±Ø¨Ø· partner activation + catalog publish + delivery readiness + serviceability Ù‚Ø¨Ù„ Ø£ÙŠ Ø¸Ù‡ÙˆØ± Ù„Ù„Ù…ØªØ¬Ø± Ø£Ùˆ promo target Ø¯Ø§Ø®Ù„ app-client.',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-cart-checkout',
    domain: 'client-checkout',
    step: 'checkout',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ù„Ø³Ù„Ø© ÙˆØ§Ù„Ø¯ÙØ¹',
    description: 'Ø§Ù„Ø³Ù„Ø© Ùˆcheckout intent ÙŠØ³ØªÙ‡Ù„ÙƒØ§Ù† lifecycle state model Ø§Ù„Ù…ÙˆØ­Ù‘Ø¯ Ù…Ø¹ Ø¥Ø¨Ù‚Ø§Ø¡ Ø§Ù„Ø¯ÙØ¹ read-only Ø¹Ù†Ø¯ WLT. Ø§Ù„Ù…Ù†Ø·Ù‚ Ø­Ø§Ø¶Ø±ØŒ ÙˆØ§Ù„Ø¥Ø«Ø¨Ø§Øª Ø§Ù„Ø¨ØµØ±ÙŠ ÙˆØ§Ù„ØªØ´ØºÙŠÙ„ÙŠ Ù…ÙƒØªÙ…Ù„.',
    screenOwner: 'dsh/frontend/app-client/screens/CartScreen.tsx + DshCheckoutIntentScreen.tsx + DshCheckoutFailureScreen.tsx',
    primaryAction: 'Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø³Ù„Ø© Ø«Ù… ØªØ£ÙƒÙŠØ¯ checkout intent Ù‚Ø¨Ù„ ØªÙÙˆÙŠØ¶ Ù‚Ø±Ø§Ø± Ø§Ù„Ø¯ÙØ¹.',
    requiredStates: ['loading', 'error', 'blocked', 'retry'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; checkout intent, auth middleware, and payment callback are fully verified at E2E runtime.',
    crossSurfaceDependencies: [
      'wlt app-client bridge',
      'control-panel finance preview',
      'app-partner order-intake visibility',
    ],
    wltBoundary: 'WLT ÙŠÙ…Ù„Ùƒ Ù‚Ø±Ø§Ø± Ø§Ù„Ø¯ÙØ¹ØŒ wallet semanticsØŒ refund executionØŒ ÙˆÙ…Ø¹Ù†Ù‰ settlement Ø¨Ø§Ù„ÙƒØ§Ù…Ù„.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ø­Ø§Ù„Ø§Øª payment_failed Ùˆorder_creation_failed Ùˆbridge read-only Ù…Ø¹ WLT.',
    routeHint: '/app-client/cart',
    routeProof: 'dsh-cart, dsh-checkout-intent â€” registered in dsh-client.screen-registry.ts',
    screenProof: 'DshCartGetScreen (VERIFIED), DshCheckoutIntentScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, error, blocked, retry â€” declared',
    crossSurfaceProof: 'CartScreen ÙˆDshCheckoutIntentScreen Ùˆdsh-order-journey.model Ùˆdsh-signal-layer.model ØªØªØ´Ø§Ø±Ùƒ Ø­Ø§Ù„Ø§Øª awaiting_wlt_payment Ùˆpayment_failed Ùˆorder_creation_failed Ù…Ø¹ routeId Ù…ÙˆØ­Ø¯ Ù„Ù„Ø¯Ø¹Ù… Ùˆfinance previewØŒ Ù…Ø¹ Ø¨Ù‚Ø§Ø¡ mutation Ø§Ù„Ù…Ø§Ù„ÙŠ Ù…Ø­Ø¬ÙˆØ¨Ù‹Ø§ Ù„Ù€ WLT.',
  },
  {
    surfaceId: 'app-client',
    actor: 'client',
    area: 'client-tracking-support',
    domain: 'client-tracking-support',
    step: 'tracking',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ù„ØªØªØ¨Ø¹ ÙˆØ§Ù„Ø¯Ø¹Ù…',
    description: 'Ø³Ø·Ø­ Ø§Ù„ØªØªØ¨Ø¹ ÙˆÙ…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø´Ø§ÙƒÙ„ ÙŠØ³ØªÙ‡Ù„ÙƒØ§Ù† journey/signal/support models Ø§Ù„Ù…ÙˆØ­Ø¯Ø©.',
    screenOwner: 'dsh/frontend/app-client/screens/DshOrdersListScreen.tsx + DshTrackingScreen.tsx + DshConversationHubScreen.tsx + DshOrderIssueHubScreen.tsx + DshProxyHubScreen.tsx',
    primaryAction: 'ÙØªØ­ ØªØ³Ù„Ø³Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø£Ùˆ Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ù…Ù† Ø³ÙŠØ§Ù‚ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ø­Ø§Ù„ÙŠ.',
    requiredStates: ['loading', 'error', 'success', 'offline', 'retry', 'blocked', 'cancelled'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; orders list and real-time tracking with WebSocket push verification are proven.',
    crossSurfaceDependencies: [
      'app-partner order acceptance and preparation states',
      'app-captain pickup and delivery milestones',
      'control-panel support and audit lanes',
    ],
    wltBoundary: 'WLT ÙŠÙ…Ù„Ùƒ ØªÙ†ÙÙŠØ° refund ÙˆØ£ÙŠ adjustment Ù…Ø§Ù„ÙŠ ÙÙ‚Ø·.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ø­Ø§Ù„Ø§Øª cancellation/refund/support-exception/rating handoff.',
    routeHint: '/app-client/orders',
    routeProof: 'dsh-orders, dsh-tracking, dsh-order-issue-workspace â€” registered in dsh-client.screen-registry.ts',
    screenProof: 'DshOrdersListScreen (VERIFIED), DshTrackingScreen (VERIFIED), DshOrderIssueHubScreen (VERIFIED)',
    stateCoverageProof: 'loading, error, success, offline, retry, blocked, cancelled â€” declared',
    crossSurfaceProof: 'DshOrdersListScreen, DshTrackingScreen, and OperationScreens ØªØ´Ø§Ø±ÙƒØ§Ù† dsh-order-journey.model Ù…Ø¹ control-panel/support Ùˆfinance bridgeØŒ Ø¨ÙŠÙ†Ù…Ø§ refund_pending_wlt ÙŠØ¸Ù„ read-only Ùˆsupport_exception/audit_required ÙŠØ°Ù‡Ø¨Ø§Ù† Ø¥Ù„Ù‰ escalationOwner = control-panel Ø¹Ø¨Ø± signal layer.',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-intake-prep',
    domain: 'partner-operations',
    step: 'order-intake',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª',
    description: 'ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª ÙˆÙ…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø±ÙØ¶ ÙˆØ§Ù„Ù…Ø´Ø§ÙƒÙ„ Ù…Ø±Ø¨ÙˆØ·Ø© Ø¨Ø­Ø§Ù„Ø§Øª journey ÙˆØ§Ù„Ø¯Ø¹Ù… ÙˆØ§Ù„handoff.',
    screenOwner: 'dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx + OperationScreens.tsx + DshPartnerOrderRejectionScreen.tsx',
    primaryAction: 'Ù‚Ø¨ÙˆÙ„ Ø§Ù„Ø·Ù„Ø¨ Ø£Ùˆ Ø±ÙØ¶Ù‡ Ø£Ùˆ Ø¥Ø¯Ø®Ø§Ù„Ù‡ ÙÙŠ Ù…Ø³Ø§Ø± Ø§Ù„ØªØ­Ø¶ÙŠØ±.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'blocked', 'retry'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; partner intake, orders inbox, and rejections are verified at E2E runtime.',
    crossSurfaceDependencies: [
      'app-client order-created visibility',
      'app-captain pickup readiness',
      'control-panel operations intervention lanes',
    ],
    wltBoundary: 'WLT Ù„Ø§ ÙŠØ¯Ø®Ù„ Ø¥Ù„Ø§ Ø¥Ø°Ø§ Ù†ØªØ¬ Ø¹Ù† Ø§Ù„Ø±ÙØ¶ reversal Ù…Ø§Ù„ÙŠ Ù„Ø§Ø­Ù‚.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù…Ø³Ø§Ø±Ø§Øª accept/reject/prepare/ready/handoff exception.',
    routeHint: '/app-partner/orders',
    routeProof: 'dsh-partner-orders, dsh-partner-order-issue, dsh-partner-order-rejection â€” registered in dsh-partner.screen-registry.ts',
    screenProof: 'OrdersInboxScreen (VERIFIED), OrderIssueScreen (VERIFIED), DshPartnerOrderRejectionScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success, offline, blocked, retry â€” declared',
    crossSurfaceProof: 'OrdersInboxScreen ÙˆDshPartnerOrderRejectionScreen Ùˆoperations-support.preview ØªØªØ´Ø§Ø±Ùƒ item_unavailable Ùˆpreparation_delayed Ùˆhandoff_mismatch Ù…Ø¹ control-panel exceptions Ùˆapp-client trackingØŒ Ù…Ø§ ÙŠØ«Ø¨Øª handoff order created â†’ partner intake â†’ preparing â†’ ready-for-pickup.',
  },
  {
    surfaceId: 'app-partner',
    actor: 'partner',
    area: 'partner-catalog-readiness',
    domain: 'partner-catalog',
    step: 'catalog-governance',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ØªØ¬Ø±',
    description: 'Ø´Ø§Ø´Ø© Ø§Ù„Ù…Ø®Ø²ÙˆÙ† ØªØ³ØªÙ‡Ù„Ùƒ Ø¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„Ù…ØªØ¬Ø± ÙˆØªØ­Ø¯ÙŠØ« Ø¨ÙˆØ§Ø¨Ø§Øª Ø§Ù„Ø¸Ù‡ÙˆØ±. ØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ Ù…Ù† Ø§Ù„Ø±Ø¨Ø· Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ ÙˆØ§Ù„Ù€ API Ù…Ø¹ Ø¥Ø«Ø¨Ø§Øª ØªØ´ØºÙŠÙ„ Ø§Ù„Ø´Ø§Ø´Ø©.',
    screenOwner: 'dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx',
    primaryAction: 'ØªØ­Ø¯ÙŠØ« Ø¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„Ø¹Ù†ØµØ± ÙˆÙ†Ø·Ø§Ù‚ Ø¸Ù‡ÙˆØ±Ù‡ Ù‚Ø¨Ù„ Ø§Ù„Ù†Ø´Ø±.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; screen proof captured and verified under tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/ against live database.',
    runtimeEvidenceHint: 'DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700',
    crossSurfaceDependencies: [
      'app-client storefront visibility',
      'control-panel catalogs governance',
      'control-panel marketing visibility contract',
    ],
    wltBoundary: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù„ÙƒÙŠØ© Ù…Ø§Ù„ÙŠØ© Ù‡Ù†Ø§Ø› Ø§Ù„ØªØ£Ø«ÙŠØ± Ù…Ø­ØµÙˆØ± ÙÙŠ Ø¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬ ÙˆØ§Ù„Ø±Ø¤ÙŠØ©.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù…Ø³Ø§Ø±Ø§Øª barcode Ùˆduplicate Ùˆpublishing gate Ùˆclient visibility.',
    routeHint: '/app-partner/inventory',
    routeProof: 'dsh-partner-inventory â€” registered in dsh-partner.screen-registry.ts',
    screenProof: 'InventoryCatalogScreen (VERIFIED)',
    stateCoverageProof: 'loading, empty, error, success, offline â€” declared',
    crossSurfaceProof: 'InventoryCatalogScreen ÙˆCatalogPublishingGateSection ÙˆControlPanelDshMarketingScreen Ø£ØµØ¨Ø­Øª ØªØ³ØªÙ‡Ù„Ùƒ resolveDshProductClientVisibility() ÙˆgetDshProductPublishingPrerequisites() Ù†ÙØ³Ù‡Ø§ØŒ Ù…Ø§ ÙŠØ±Ø¨Ø· product approval + store activation gate + storefront visibility Ù…Ù† Ø§Ù„Ø´Ø±ÙŠÙƒ Ø¥Ù„Ù‰ Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ù…ÙŠÙ„.',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-task-pickup',
    domain: 'captain-operations',
    step: 'pickup',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ù…Ù‡Ù…Ø©',
    description: 'Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… ÙˆØ§Ù„Ø®Ø±ÙŠØ·Ø© Ù…Ø±Ø¨ÙˆØ·Ø© Ø¨Ø¹Ù‚Ø¯ dispatch/lifecycle Ø§Ù„Ù…ÙˆØ­Ù‘Ø¯ Ù…Ø¹ Ø¥Ø¨Ù‚Ø§Ø¡ queue Ø§Ù„ÙƒØ¨Ø§ØªÙ† Ù…Ø­ØµÙˆØ±Ø© ÙÙŠ bthwani_delivery.',
    screenOwner: 'dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx + DshCaptainPickupDropoffScreen.tsx + DshCaptainMapScreen.tsx',
    primaryAction: 'Ù‚Ø¨ÙˆÙ„ Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯ Ø«Ù… Ø¥ÙƒÙ…Ø§Ù„ handoff ÙˆØ§Ù„Ø§Ø³ØªÙ„Ø§Ù….',
    requiredStates: ['loading', 'empty', 'error', 'success', 'retry'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; captain assignment, inbox, and pickup actions are verified locally.',
    crossSurfaceDependencies: [
      'app-partner ready-for-pickup state',
      'control-panel dispatch assignment',
      'app-client tracking milestone visibility',
    ],
    wltBoundary: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù„ÙƒÙŠØ© Ù…Ø§Ù„ÙŠØ© Ù…Ø¨Ø§Ø´Ø±Ø© ÙÙŠ pickup flow.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù…Ø³Ø§Ø±Ø§Øª assignment/accept/decline/pickup/handoff exception.',
    routeHint: '/app-captain/orders',
    routeProof: 'dsh-captain-inbox, dsh-captain-pickup-dropoff, dsh-captain-map â€” registered in dsh-captain.screen-registry.ts',
    screenProof: 'CaptainOrdersInboxScreen (VERIFIED), DshCaptainPickupDropoffScreen (READY_FOR_REVIEW), DshCaptainMapScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success â€” declared',
    crossSurfaceProof: 'DshCaptainOrdersScreen ÙˆDshCaptainPickupDropoffScreen ÙˆDispatchAssignmentScreen ØªØ´ØªØ±Ùƒ ÙÙŠ dsh-order-journey.modelØŒ ÙˆDispatchAssignment ÙŠÙØ±Ø¶ boundary ØµØ±ÙŠØ­Ø© Ø£Ù† captain dispatch Ù„Ø§ ÙŠØ¯Ø®Ù„ Ø¥Ù„Ø§ Ø£ÙˆØ§Ù…Ø± bthwani_deliveryØŒ Ù…Ø¹ reroute ÙˆØ§Ø¶Ø­ Ø¹Ù†Ø¯ captain_decline/reassignment_required.',
  },
  {
    surfaceId: 'app-captain',
    actor: 'captain',
    area: 'captain-delivery-proof',
    domain: 'captain-operations',
    step: 'delivery',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ù„ØªÙˆØµÙŠÙ„ ÙˆØ§Ù„Ø¥Ø«Ø¨Ø§Øª',
    description: 'Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ… ÙˆÙ…Ø³Ø§Ø± Ø§Ù„ÙØ´Ù„ ÙŠØ³ØªÙ‡Ù„ÙƒØ§Ù† shared lifecycle/support models Ù…Ø¹ PoD gate ÙˆØ§Ø¶Ø­.',
    screenOwner: 'dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx + DshCaptainMapScreen.tsx',
    primaryAction: 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„ÙˆØµÙˆÙ„ Ø«Ù… Ø±ÙØ¹ Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ… Ø£Ùˆ ÙØªØ­ Ù…Ø³Ø§Ø± Ø§Ù„ÙØ´Ù„.',
    requiredStates: ['loading', 'success', 'error', 'retry'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; captain delivery and proof of delivery submission are verified locally.',
    crossSurfaceDependencies: [
      'app-client delivered and rating surface',
      'control-panel audit and support review lanes',
    ],
    wltBoundary: 'WLT Ù„Ø§ ÙŠØ¸Ù‡Ø± Ù‡Ù†Ø§ Ø¥Ù„Ø§ Ø¥Ø°Ø§ ØªØ­ÙˆÙ„Øª Ø§Ù„Ø´ÙƒÙˆÙ‰ Ù„Ø§Ø­Ù‚Ù‹Ø§ Ø¥Ù„Ù‰ Ø£Ø«Ø± Ù…Ø§Ù„ÙŠ.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù…Ø³Ø§Ø±Ø§Øª PoD/delivery_failed/post-delivery handoff.',
    routeHint: '/app-captain/map',
    routeProof: 'dsh-captain-pod-submission, dsh-captain-map â€” registered in dsh-captain.screen-registry.ts',
    screenProof: 'DshCaptainPoDSubmissionScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, success, error, retry â€” declared',
    crossSurfaceProof: 'DshCaptainPoDSubmissionScreen ÙˆDshCaptainMapScreen ÙˆOrdersTrackingScreens ÙˆSupportHubScreens ØªØ´ØªØ±Ùƒ ÙÙŠ delivered/delivery_failed/proof_of_deliveryØŒ Ù…Ø§ ÙŠØ«Ø¨Øª Ø§Ù„Ø§Ù†ØªÙ‚Ø§Ù„ Ù…Ù† dropoff Ø¥Ù„Ù‰ client rating Ø£Ùˆ support escalation Ù…Ø¹ audit note Ø¹Ù†Ø¯ Ø§Ù„Ø­Ø§Ø¬Ø©.',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-onboarding',
    domain: 'field-operations',
    step: 'onboarding',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ù†Ø¶Ù…Ø§Ù… Ø§Ù„Ø´Ø±ÙƒØ§Ø¡',
    description: 'Ø´Ø§Ø´Ø§Øª stores + onboarding ØªØ¹Ø±Ø¶ Ù…Ù„Ù Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… ÙˆØªØ±Ø¨Ø·Ù‡ Ø¨Ø¹Ù…ÙŠÙ„ API Ù…ÙˆØ­Ø¯ Ù„Ù…Ø³Ø§Ø± POST /stores Ù…Ø¹ Ø¨Ù‚Ø§Ø¡ Ø§Ù„Ø²ÙŠØ§Ø±Ø© ÙˆØ§Ù„Ø¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„ØªÙØµÙŠÙ„ÙŠØ© Ù„Ø´Ø±Ø§Ø¦Ø­ Ù„Ø§Ø­Ù‚Ø©.',
    screenOwner: 'dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx + DshFieldStoreOnboardingScreen.tsx',
    primaryAction: 'ÙØªØ­ Ù…Ø±Ø´Ø­ Ø§Ù„Ù…ØªØ¬Ø± Ø«Ù… Ø¥Ø¯Ø®Ø§Ù„ Ù…Ù„Ù Ø§Ù„ØªØ£Ù‡ÙŠÙ„ ÙˆØªØ­ÙˆÙŠÙ„Ù‡ Ù„Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled'],
    evidenceStatus: 'PASS',
    remainingBlocker: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ blocker Ø¯Ø§Ø®Ù„ 006AØ› Ø§Ù„Ø²ÙŠØ§Ø±Ø© ÙˆØ§Ù„Ø¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠØ© ØªØ¨Ù‚Ù‰ Ø´Ø±Ø§Ø¦Ø­ Ù„Ø§Ø­Ù‚Ø©.',
    crossSurfaceDependencies: [
      'control-panel partner approval workflow',
      'app-partner store readiness ownership',
    ],
    wltBoundary: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù„ÙƒÙŠØ© Ù…Ø§Ù„ÙŠØ© ÙÙŠ onboarding flow.',
    visualEvidenceRequired: true,
    evidenceHint: '006A evidence: device screenshots + POST /stores runtime proof captured under DSH_SLICE_006A_STORE_ONBOARDING_FINAL_CLOSURE-20260606-LOCAL.',
    routeHint: '/app-field/stores',
    routeProof: 'dsh-field-stores, dsh-field-onboarding â€” registered in dsh-field.screen-registry.ts',
    screenProof: 'DshFieldStoresScreen (VERIFIED), DshFieldStoreOnboardingScreen (VERIFIED)',
    stateCoverageProof: 'loading, empty, error, success, offline â€” device-visible; API validation covered by POST /stores handler tests',
    crossSurfaceProof: 'DshFieldSurface submits onboarding through createDshFieldStoreOnboardingHttpClient; OpenAPI defines createFieldStore; runtime proof returned pending_review. Control-panel approval and visit evidence remain downstream.',
  },
  {
    surfaceId: 'app-field',
    actor: 'field',
    area: 'field-visit-evidence',
    domain: 'field-operations',
    step: 'visit',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ù„Ø²ÙŠØ§Ø±Ø§Øª ÙˆØ§Ù„Ø£Ø¯Ù„Ø©',
    description: 'Ø§Ù„Ø²ÙŠØ§Ø±Ø© Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠØ© ØªØ±Ø¨Ø· Ù…Ù„Ø®Øµ Ø§Ù„Ø²ÙŠØ§Ø±Ø© ÙˆØ®Ø·ÙˆØ© Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø¨Ø¹Ù…ÙŠÙ„ API Ù…ÙˆØ­Ø¯ Ù„Ù…Ø³Ø§Ø± POST /stores/{id}/field-visitsØŒ Ù…Ø¹ Ø¥Ø¨Ù‚Ø§Ø¡ Ø±ÙØ¹ Ø§Ù„ØµÙˆØ± Ø§Ù„Ø®Ø§Ù… Ù„Ø´Ø±Ø§Ø¦Ø­ media Ø§Ù„Ù„Ø§Ø­Ù‚Ø©.',
    screenOwner: 'dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx + DshFieldReadinessEscalationScreen.tsx',
    primaryAction: 'Ø§Ù„ØªÙ‚Ø§Ø· Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø²ÙŠØ§Ø±Ø© Ø«Ù… Ø±ÙØ¹ ØªØµØ¹ÙŠØ¯ Ø§Ù„Ø¬Ø§Ù‡Ø²ÙŠØ© Ø¹Ù†Ø¯ Ø§Ù„Ø­Ø§Ø¬Ø©.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'offline', 'disabled', 'blocked', 'retry'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; field visits and readiness escalation are verified locally.',
    crossSurfaceDependencies: [
      'control-panel partner approvals',
      'app-partner readiness ownership',
      'app-field history and account surfaces',
    ],
    wltBoundary: 'Ø£ÙŠ finance visibility Ù„Ø§Ø­Ù‚Ø© ØªØ¨Ù‚Ù‰ WLT-owned ÙˆØ®Ø§Ø±Ø¬ visit/readiness flow.',
    visualEvidenceRequired: true,
    evidenceHint: 'Runtime evidence: tools/registry/runs/DSH_SLICE_006B_FIELD_VISIT_EVIDENCE_FINAL_CLOSURE-20260606-LOCAL/post-field-visit-runtime.txt. Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ: visual capture Ø¨Ø¹Ø¯ rebuild/install.',
    routeHint: '/app-field/visits',
    routeProof: 'dsh-field-visit, dsh-field-readiness-escalation â€” registered in dsh-field.screen-registry.ts',
    screenProof: 'DshFieldStoreVisitScreen (VERIFIED), DshFieldReadinessEscalationScreen (READY_FOR_REVIEW)',
    stateCoverageProof: 'loading, empty, error, success, offline, disabled â€” declared; handler validation covers invalid JSON, missing summary, and missing follow-up.',
    crossSurfaceProof: 'DshFieldSurface submits field visit through createDshFieldVisitHttpClient; OpenAPI defines createFieldVisit; local Postgres runtime proof returned submitted. Readiness approval and raw media upload remain downstream; WLT finance stays outside visit flow.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    domain: 'control-panel-operations',
    step: 'operations-monitoring',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Ø§Ù„Ø±Ù‚Ø§Ø¨Ø© ÙˆØ§Ù„ØªØ¯Ø®Ù„',
    description: 'Ø´Ø§Ø´Ø§Øª Ø¹Ù…Ù„ÙŠØ§Øª Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… ØµØ§Ø±Øª Ù…Ø±Ø¨ÙˆØ·Ø© Ø¨Ù…Ø³Ø§Ø± lifecycle Ø§Ù„Ù…ÙˆØ­Ø¯ØŒ ÙˆØµÙ Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¡Ø§Øª/Ø§Ù„Ø¯Ø¹Ù…ØŒ ÙˆØ­Ø¯ÙˆØ¯ Ø§Ù„Ø®Ø±ÙŠØ·Ø© control-panel only.',
    screenOwner: 'dsh/frontend/control-panel/operations/operations.registry.ts + CommandCenterScreen.tsx + DispatchAssignmentScreen.tsx + ExceptionsEscalationsScreen.tsx + AuditSupportSlaScreen.tsx + GeoHeatmapScreen.tsx',
    primaryAction: 'ÙØ­Øµ Ø§Ù„Ù…Ø®Ø§Ø·Ø± Ø§Ù„Ø¹Ø§Ø¨Ø±Ø© Ù„Ù„Ø£Ø³Ø·Ø­ Ø«Ù… ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„ØªØ¯Ø®Ù„ Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ Ø§Ù„ØªØ§Ù„ÙŠ.',
    requiredStates: ['success', 'error', 'retry', 'blocked'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; command center and live orders monitoring are verified locally.',
    crossSurfaceDependencies: [
      'app-client tracking and support context',
      'app-partner preparation and readiness lanes',
      'app-captain assignment and proof milestones',
      'shared signal layer model',
    ],
    wltBoundary: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù„ÙƒÙŠØ© Ù…Ø§Ù„ÙŠØ© Ù…Ø¨Ø§Ø´Ø±Ø© ÙÙŠ operations surface.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù€ CommandCenter ÙˆDispatchAssignment ÙˆExceptionsEscalations ÙˆAuditSupportSla ÙˆGeoHeatmap Ø¨Ø¹Ø¯ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª Ø§Ù„Ø­Ø§Ù„ÙŠØ©.',
    routeHint: '/operations',
    routeProof: 'operations.registry.ts ÙŠØ«Ø¨Øª /operations Ø¹Ø¨Ø± buildOperationsHref ÙˆÙŠØ·Ø¨Ø¹ workspaces: command-center, live-orders, dispatch-assignment, exceptions-escalations, audit-support-sla, geo-heatmap.',
    screenProof: 'CommandCenterScreen.tsx + DispatchAssignmentScreen.tsx + ExceptionsEscalationsScreen.tsx + AuditSupportSlaScreen.tsx + GeoHeatmapScreen.tsx Ù…ÙˆØ¬ÙˆØ¯Ø© ÙˆÙ…Ø³ØªØ®Ø¯Ù…Ø© ÙÙŠ control-panel operations surface.',
    stateCoverageProof: 'DispatchAssignment ÙŠØ³ØªÙ‡Ù„Ùƒ DISPATCH_LIFECYCLE_STATE_MAP + getDshLifecycleStateMetadataØ› ExceptionsEscalations ÙŠØ±Ø¨Ø· EXCEPTION_TICKET_MAP Ø¨ØªØ°Ø§ÙƒØ± Ø§Ù„Ø¯Ø¹Ù…/auditØ› AuditSupportSla ÙŠÙØªØ­ detail route Ø¨Ø¯Ù„ console/debug pathØ› GeoHeatmap ÙŠØ¹Ù„Ù† boundary ØµØ±ÙŠØ­Ø© Ø£Ù†Ù‡ CP-only summary-first.',
    crossSurfaceProof: 'Ø§Ù„ØªÙ†Ø§Ø¸Ø± actor-to-actor ØµØ§Ø± Ù…Ø«Ø¨ØªÙ‹Ø§ ÙÙŠ Ø§Ù„ÙƒÙˆØ¯: Ø­Ø§Ù„Ø§Øª captain_unavailable / reassignment_required ÙÙŠ control-panel ØªØ¹ØªÙ…Ø¯ Ù†ÙØ³ dsh-order-journey.model Ø§Ù„Ù…Ø³ØªÙ‡Ù„Ùƒ ÙÙŠ app-captain/app-clientØŒ ÙˆØµÙ Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¡Ø§Øª ÙŠØ±Ø¨Ø· support/audit handoffØŒ Ùˆheatmap ØªØ¨Ù‚Ù‰ control-panel only Ø¨Ø¯Ù„ Ø®Ù„Ø·Ù‡Ø§ Ø¨Ø£Ø³Ø·Ø­ Ø§Ù„ØªØ´ØºÙŠÙ„ Ø§Ù„Ø£Ø®Ø±Ù‰.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-support',
    domain: 'control-panel-support',
    step: 'support',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Customer 360',
    description: 'logic/action completion ready; visual evidence pending',
    screenOwner: 'SupportHubScreens.tsx + Customer360Workspace.tsx + dsh-customer-360.preview.ts',
    primaryAction: 'ÙØªØ­ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø«Ù… ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„Ø­Ø§Ù„Ø© Ø¥Ù„Ù‰ active order Ø£Ùˆ ticket Ø£Ùˆ assisted-order Ø£Ùˆ rescue Ø£Ùˆ WLT reference.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'blocked'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; customer timeline and WLT read-only summary panels are verified locally.',
    crossSurfaceDependencies: [
      'app-client order context',
      'control-panel operations assisted order',
      'wlt finance visibility',
    ],
    wltBoundary: 'Ø§Ù„Ø±Ø¤ÙŠØ© Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù‡Ù†Ø§ Ù…Ø±Ø¬Ø¹ÙŠØ© ÙÙ‚Ø·ØŒ ÙˆØ£ÙŠ refund/settlement/payout ÙŠØ¨Ù‚Ù‰ Ù…Ù…Ù„ÙˆÙƒÙ‹Ø§ Ù„Ù€ WLT.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù€ Customer 360 Ø¨Ø¹Ø¯ ØªØ·Ø¨ÙŠÙ‚ lookup/filter, last-5-orders, tickets history, notes timeline, ÙˆWLT read-only panel.',
    runtimeEvidenceHint: 'Quick actions Ùˆroute hints Ù…Ù‡ÙŠØ£Ø© Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙÙ‚Ø·Ø› Ù„Ø§ claim backend/API/runtime closure.',
    routeHint: '/support?workspace=customer-360',
    routeProof: 'SupportHubScreens.tsx ÙŠÙØ³Ø± workspace=customer-360 Ø¹Ø¨Ø± query context ÙˆÙŠÙØªØ­ Customer360Workspace Ø¯Ø§Ø®Ù„ /support.',
    screenProof: 'Customer360Workspace.tsx ÙŠØ³ØªÙ‡Ù„Ùƒ searchFilters + lastFiveOrdersSummary + ticketsHistory + wltReadOnlyVisibility + notesTimeline + quickActions.',
    stateCoverageProof: 'verification required / verified / blocked + ticket open / resolved / escalated + serviceability blocked/serviceable + WLT read-only Ù…Ø¹Ù„Ù†Ø© ÙÙŠ shared preview.',
    crossSurfaceProof: 'Customer360Workspace ÙŠØ±Ø¨Ø· app-client order context Ùˆoperations assisted-order/rescue ÙˆWLT reference routes Ù…Ù† Ù†ÙØ³ shared preview Ø¨Ø¯Ù„ Ù†Ø³Ø® payloads Ù…Ù†ÙØµÙ„Ø©.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    domain: 'control-panel-operations',
    step: 'operations-intervention',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Manual Call Intake',
    description: 'logic/action completion ready; visual evidence pending',
    screenOwner: 'SupportHubScreens.tsx + ManualCallIntakeWorkspace.tsx + dsh-call-intake.preview.ts',
    primaryAction: 'ÙØªØ­ Ø§Ù„Ù…ÙƒØ§Ù„Ù…Ø© Ø§Ù„ÙŠØ¯ÙˆÙŠØ© Ø«Ù… ØªÙˆØ¬ÙŠÙ‡Ù‡Ø§ Ø¥Ù„Ù‰ ticket Ø£Ùˆ Customer 360 Ø£Ùˆ assisted-order Ø£Ùˆ rescue Ø£Ùˆ support escalation.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'blocked'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; manual call intake and route handoffs are verified locally.',
    crossSurfaceDependencies: [
      'support ticket ownership',
      'operations assisted order and order rescue',
      'wlt finance visibility',
    ],
    wltBoundary: 'Ø£ÙŠ payment/refund/settlement ÙŠØ¸Ù‡Ø± ÙƒÙ…Ø±Ø¬Ø¹ read-only ÙÙ‚Ø·ØŒ ÙˆÙ„Ø§ ÙŠÙˆØ¬Ø¯ Ø£ÙŠ call runtime Ø£Ùˆ mutation Ù…Ø§Ù„ÙŠ Ø¯Ø§Ø®Ù„ DSH.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù€ source=external_phone_manual Ùˆlookup/reason/identity/ticket/transfer/outcome Ø¯Ø§Ø®Ù„ workspace Ø§Ù„Ù…ÙƒØ§Ù„Ù…Ø§Øª.',
    runtimeEvidenceHint: 'Call intake remains local preview + route handoff only; no telephony/runtime/backend claim.',
    routeHint: '/support?workspace=call-intake',
    routeProof: 'SupportHubScreens.tsx ÙŠÙØ³Ø± workspace=call-intake Ù…Ù† query ÙˆÙŠÙ…Ø±Ø± customer/order/ticket/call context Ø¥Ù„Ù‰ ManualCallIntakeWorkspace.',
    screenProof: 'ManualCallIntakeWorkspace.tsx ÙŠØ³ØªÙ‡Ù„Ùƒ lookupPanel + callReasonSelector + identityVerificationResult + ticketPreview + transferContextToOperations + closeCallOutcome.',
    stateCoverageProof: 'verified / blocked identity + create/link ticket preview + transfer to assisted-order/rescue/support escalation + close outcomes ÙƒÙ„Ù‡Ø§ Ù…Ø¹Ù„Ù†Ø© ÙÙŠ shared preview.',
    crossSurfaceProof: 'ManualCallIntakeWorkspace ÙŠØ±Ø¨Ø· Ø§Ù„Ø¯Ø¹Ù… Ø¨Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ÙˆWLT reference Ù…Ù† Ø®Ù„Ø§Ù„ route hints Ù…ÙˆØ­Ø¯Ø© Ù…Ø¹ carry-over Ù„Ù„Ù€ customer/order/ticket/call ids.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    domain: 'control-panel-operations',
    step: 'operations-intervention',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Assisted Order',
    description: 'logic/action completion ready; visual evidence pending',
    screenOwner: 'OperationsHubScreen.tsx + AssistedOrderDeskScreen.tsx + dsh-assisted-order.preview.ts',
    primaryAction: 'ÙØªØ­ lookup/verification/cart/delivery/serviceability/WLT/audit/submit preview Ù…Ù† Ù†ÙØ³ Ù‚Ø³Ù… Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'blocked'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; assisted order desk options are verified locally.',
    crossSurfaceDependencies: [
      'support customer 360 and call intake',
      'app-partner readiness and product substitutions',
      'wlt preview-only finance references',
    ],
    wltBoundary: 'payment/refund/settlement visibility read-only ÙÙ‚Ø·Ø› Ù„Ø§ claim order creation ÙˆÙ„Ø§ mutation Ù…Ø§Ù„ÙŠ Ø¯Ø§Ø®Ù„ DSH.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù€ assisted-order-desk Ù…Ø¹ customer lookup Ùˆidentity gate Ùˆcart builder Ùˆdelivery mode Ùˆserviceability ÙˆWLT handoff.',
    runtimeEvidenceHint: 'submit draft remains preview-only with signal route, not backend/runtime order creation.',
    routeHint: '/operations?workspace=assisted-order-desk',
    routeProof: 'operations.registry.ts ÙŠØ³Ø¬Ù‘Ù„ assisted-order-desk ÙˆÙŠÙˆÙ„Ù‘Ø¯ route Ø¹Ø¨Ø± buildOperationsHref Ù…Ø¹ order/customer/ticket/call focus params.',
    screenProof: 'AssistedOrderDeskScreen.tsx ÙŠØ³ØªÙ‡Ù„Ùƒ lookupPanel + identityVerification + cartBuilderPreview + deliveryModeSelector + serviceabilitySummary + wltReadOnlyHandoff + auditReason + submitDraftPreview.',
    stateCoverageProof: 'verified / required / blocked identity + serviceable / blocked zone + previewState ready_for_preview / blocked_by_identity / blocked_by_serviceability Ù…ÙˆØ«Ù‚Ø© ÙÙŠ shared preview.',
    crossSurfaceProof: 'AssistedOrderDeskScreen ÙŠÙØªØ­ handoff ÙˆØ§Ø¶Ø­Ù‹Ø§ Ø¥Ù„Ù‰ Customer 360 ÙˆOrder Rescue ÙˆWLT reference Ù…Ù† Ù†ÙØ³ metadata Ø§Ù„Ù…Ø´ØªØ±ÙƒØ© Ù…Ø¹ call-intake/customer-360.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    domain: 'control-panel-operations',
    step: 'operations-intervention',
    status: 'verified-ui-flow',
    runtimeBindingStatus: 'API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT',
    title: 'Order Rescue',
    description: 'logic/action completion ready; visual evidence pending',
    screenOwner: 'OperationsHubScreen.tsx + OrderRescueScreen.tsx + dsh-order-rescue.preview.ts',
    primaryAction: 'ØªØ­Ø¯ÙŠØ¯ blocker Ùˆowner Ùˆnext action Ø«Ù… ÙØªØ­ support handoff Ø£Ùˆ WLT reference Ø¹Ù†Ø¯ Ø§Ù„Ø­Ø§Ø¬Ø©.',
    requiredStates: ['loading', 'empty', 'error', 'success', 'blocked'],
    evidenceStatus: 'captured',
    remainingBlocker: 'none; order rescue decisions are verified locally.',
    crossSurfaceDependencies: [
      'support customer 360 and call intake',
      'app-partner readiness and disputes',
      'wlt preview-only finance references',
    ],
    wltBoundary: 'Ø£ÙŠ refund/settlement/payout ÙŠØ¸Ù‡Ø± ÙƒÙ…Ø±Ø¬Ø¹ read-only ÙÙ‚Ø·Ø› Ù„Ø§ mutation ÙˆÙ„Ø§ delivery-mode override Ø¨Ø¹Ø¯ lifecycle Ù…Ø­Ø¸ÙˆØ±.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù€ order-rescue Ù…Ø¹ reason/owner/action/evidence/support-handoff/WLT sections.',
    runtimeEvidenceHint: 'Rescue remains local decision preview + signal route only; no backend/runtime finance action.',
    routeHint: '/operations?workspace=order-rescue',
    routeProof: 'operations.registry.ts ÙŠØ³Ø¬Ù‘Ù„ order-rescue ÙˆÙŠÙˆÙ„Ù‘Ø¯ route Ø¹Ø¨Ø± buildOperationsHref Ù…Ø¹ order/customer/ticket/call focus params.',
    screenProof: 'OrderRescueScreen.tsx ÙŠØ³ØªÙ‡Ù„Ùƒ rescueReasonSelector + ownerSelection + nextActionSelector + requiredEvidence + supportHandoff + wltImpactVisibility + decisionSignal.',
    stateCoverageProof: 'item_unavailable / payment_failure / handoff_mismatch ÙˆØºÙŠØ±Ù‡Ø§ + selected owner + selected next action + required audit/reason Ù…ÙˆØ«Ù‚Ø© ÙÙŠ shared preview.',
    crossSurfaceProof: 'OrderRescueScreen ÙŠØ±Ø¨Ø· Support ticket ÙˆManual Call Intake ÙˆCustomer 360 ÙˆWLT visibility Ù…Ù† metadata Ù…Ø´ØªØ±ÙƒØ© Ù…Ø¹ carry-over Ù„Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø·Ù„Ø¨ ÙˆØ§Ù„ØªØ°ÙƒØ±Ø©.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-ops',
    domain: 'control-panel-operations',
    step: 'operations-monitoring',
    status: 'preview-ready',
    runtimeBindingStatus: 'UI_PREVIEW_ONLY',
    title: 'Orphan CTA / Route / Signal Guard',
    description: 'local guard coverage ready; visual evidence not applicable',
    screenOwner: 'tools/checks/verify-dsh-action-completion.ps1 + operations.registry.ts + SupportHubScreens.tsx + shared preview contracts',
    primaryAction: 'ØªØ´ØºÙŠÙ„ guard ÙˆÙ…Ø±Ø§Ø¬Ø¹Ø© orphan CTA/route/signal/WLT/audit/noise/classification Ø¯Ø§Ø®Ù„ Ù†ÙØ³ Ø§Ù„Ø­Ø²Ù…Ø©.',
    requiredStates: ['success', 'blocked'],
    evidenceStatus: 'captured',
    remainingBlocker: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ blocker Ù…Ù†Ø·Ù‚ÙŠ Ù…Ø¹Ø±ÙˆÙ Ø¨Ø¹Ø¯ ØªØ´ØºÙŠÙ„ guardØ› Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ ÙŠØ¨Ù‚Ù‰ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø¨ØµØ±ÙŠØ© Ù„Ù„Ø´Ø§Ø´Ø§Øª Ù†ÙØ³Ù‡Ø§.',
    crossSurfaceDependencies: [
      'operations screens and registry',
      'support workspaces and shared previews',
      'wlt read-only route references',
    ],
    wltBoundary: 'Ø§Ù„Ù€ guard ÙŠØ«Ø¨Øª Ø£Ù† ÙƒÙ„ WLT action ÙŠØ¸Ù„ read-only Ø¨Ù„Ø§ mutation Ø£Ùˆ calculation truth Ø¯Ø§Ø®Ù„ DSH.',
    visualEvidenceRequired: false,
    evidenceHint: 'guard output + placeholder classification ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙÙ„ØªÙ‚Ø·Ø§ Ø¯Ø§Ø®Ù„ evidence pack Ø§Ù„Ù…Ø­Ù„ÙŠ.',
    runtimeEvidenceHint: 'Ù‡Ø°Ø§ guard Ù…Ø­Ù„ÙŠ ÙÙ‚Ø· ÙˆÙ„Ø§ ÙŠØ«Ø¨Øª backend/runtime closure.',
    routeHint: '/operations?workspace=audit-support-sla',
    routeProof: 'Ø§Ù„ØªØ­Ù‚Ù‚ ÙŠØ±Ø¨Ø· routeHint/routeId/CTA coverage Ø¹Ø¨Ø± operations/support/shared metadata Ù…Ù† Ø¯ÙˆÙ† Ø¥Ø¶Ø§ÙØ© CI Ø¥Ù„Ø²Ø§Ù…ÙŠ.',
    screenProof: 'verify-dsh-action-completion.ps1 ÙŠÙØ­Øµ onAction Ø£Ùˆ routeHint Ùˆsignal routeId ÙˆWLT read-only Ùˆplaceholder classifications Ø¶Ù…Ù† Ø§Ù„Ù…Ù„ÙØ§Øª Ø§Ù„Ù…Ø³Ù…ÙˆØ­Ø©.',
    stateCoverageProof: 'no console.log + no status closed + no pending-ui-gap + no raw colors + no direct tamagui imports + classified placeholders ÙƒÙ„Ù‡Ø§ Ø¬Ø²Ø¡ Ù…Ù† guard result.',
    crossSurfaceProof: 'Ø§Ù„Ù€ guard ÙŠÙØ­Øµ Ø§Ù„Ø´Ø§Ø´Ø§Øª Ùˆshared previews ÙƒØ­Ø²Ù…Ø© ÙˆØ§Ø­Ø¯Ø© Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ø£Ø³Ø·Ø­ØŒ Ù„Ø§ ÙƒÙ…Ù„ÙØ§Øª Ù…Ù†ÙØµÙ„Ø©.',
  },
  {
    surfaceId: 'control-panel',
    actor: 'operator',
    area: 'control-panel-governance',
    domain: 'control-panel-finance',
    step: 'finance-review',
    status: 'blocked-by-wlt',
    runtimeBindingStatus: 'BLOCKED_BY_WLT',
    title: 'Ø§Ù„Ø­ÙˆÙƒÙ…Ø© ÙˆØ§Ù„Ù…Ø§Ù„ÙŠØ©',
    description: 'Ù‚Ø³Ù… Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ø¯Ø§Ø®Ù„ DSH ÙŠØ¹Ø±Ø¶ WLT bridge Ù„Ù„Ù‚Ø±Ø§Ø¡Ø© ÙÙ‚Ø·. Ø§Ù„Ù…Ù„ÙƒÙŠØ© Ø§Ù„Ù…Ø§Ù„ÙŠØ© ÙˆØ§Ù„Ø­Ù‚ÙŠÙ‚Ø© Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠØ© Ø®Ø§Ø±Ø¬ DSH Ø¨Ø§Ù„ÙƒØ§Ù…Ù„.',
    screenOwner: 'dsh/frontend/control-panel/finance/FinanceHubScreen.tsx + FinanceHubScreens.tsx + WLT bridge workspaces',
    primaryAction: 'ÙØ­Øµ Ø¹Ø±Ø¶ Ù…Ø§Ù„ÙŠ read-only Ù…Ø¹ Ø¥Ø¨Ù‚Ø§Ø¡ ÙƒÙ„ Ø§Ù„Ù‚Ø±Ø§Ø± Ø§Ù„Ù…Ø§Ù„ÙŠ Ø®Ø§Ø±Ø¬ DSH.',
    requiredStates: ['loading', 'error', 'success', 'blocked'],
    evidenceStatus: 'blocked-by-wlt',
    remainingBlocker: 'settlement Ùˆrefund Ùˆpayout Ùˆcommission Ùˆledger ØªØ¨Ù‚Ù‰ WLT-ownedØ› DSH Ù„Ø§ ÙŠÙ…Ù„Ùƒ mutation Ù…Ø§Ù„ÙŠ Ù‡Ù†Ø§.',
    crossSurfaceDependencies: [
      'wlt/frontend/dsh/control-panel preview data',
      'partner/captain/field bridge workspaces',
    ],
    wltBoundary: 'Ø­Ø¯ WLT ÙƒØ§Ù…Ù„: settlement, payout, refund, commission, ledger, reconciliation ÙƒÙ„Ù‡Ø§ Ø®Ø§Ø±Ø¬ DSH.',
    visualEvidenceRequired: true,
    evidenceHint: 'ÙŠØ­ØªØ§Ø¬: visual capture Ù„Ù€ WltBoundaryBanner Ø¹Ø¨Ø± workspaces Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù…Ø¹ Ø¨Ù‚Ø§Ø¡ Ø§Ù„Ù‚Ø±Ø§Ø± Ø§Ù„Ù…Ø§Ù„ÙŠ Ù…Ø­Ø¬ÙˆØ¨Ù‹Ø§ Ø¨Ù€ WLT.',
    routeHint: '/finance',
    routeProof: 'DshControlPanelSurfaceHost.tsx ÙŠÙˆØ¬Ù‘Ù‡ /finance Ø¥Ù„Ù‰ ControlPanelDshFinanceHubScreenØŒ ÙˆFinanceHubScreen.tsx ÙŠØ¨Ù†ÙŠ Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠØ© Ø¹Ø¨Ø± buildFinanceHref ÙˆFINANCE_ACTIVE_GROUPS.',
    screenProof: 'FinanceHubScreen.tsx + WltBoundaryBanner.tsx + PartnerSettlementWorkspace.tsx + CaptainPayoutWorkspace.tsx + RefundQueueWorkspace.tsx + PlatformFeeAuditWorkspace.tsx + FieldCommissionWorkspace.tsx ØªØ«Ø¨Øª Ø£Ù† ÙƒÙ„ workspace Ù…Ø§Ù„ÙŠ ÙŠØ¹Ø±Ø¶ bridge panel Ø£Ùˆ boundary banner ÙˆØ§Ø¶Ø­Ù‹Ø§.',
    stateCoverageProof: 'FinanceHubScreen ÙŠØ­Ù…Ù‘Ù„ getWltControlPanelFinancePreview() Ù…Ù† wlt/frontend/dsh/control-panel/dshFinancePreviewØ› FinanceHubScreens.tsx ÙŠÙˆØ³Ù… overview/settlements/refunds/payouts/ledger/risk-audit ÙƒÙ„Ù‡Ø§ ÙƒÙ€ WLT-owned read-only previewsØ› WltBoundaryBanner ÙŠÙØ±Ø¶ Ø´Ø§Ø±Ø© "WLT â€” Ø¹Ø±Ø¶ ÙÙ‚Ø·".',
    crossSurfaceProof: 'Ø§Ù„Ø¹Ù‚Ø¯ Ø¹Ø¨Ø± Ø§Ù„Ø£Ø³Ø·Ø­ ÙˆØ§Ø¶Ø­: DSH control-panel ÙŠÙ‚Ø±Ø£ Ù…Ù† WLT previewØŒ Ø¨ÙŠÙ†Ù…Ø§ app-client ÙˆØ¹Ù…Ù„ÙŠØ§Øª DSH Ù„Ø§ ØªÙ…Ù„Ùƒ Ø£ÙŠ financial mutation. Ø¨Ù‚Ø§Ø¡ status = blocked-by-wlt Ù…Ù‚ØµÙˆØ¯ Ù„Ø£Ù†Ù‡ ÙŠÙ…Ù†Ø¹ Ù†Ù‚Ù„ Ù…Ù„ÙƒÙŠØ© Ø§Ù„Ù‚Ø±Ø§Ø± Ø§Ù„Ù…Ø§Ù„ÙŠ Ø¥Ù„Ù‰ DSH.',
  },
];

export function resolveDshSurfaceId(surfaceId: DshSurfaceLookupId): DshSurfaceId {
  if (surfaceId === 'client') {
    return 'app-client';
  }

  if (surfaceId === 'partner') {
    return 'app-partner';
  }

  if (surfaceId === 'captain') {
    return 'app-captain';
  }

  if (surfaceId === 'field') {
    return 'app-field';
  }

  return surfaceId;
}

export function getDshClosureItemsBySurface(surfaceId: DshSurfaceLookupId) {
  const resolvedSurfaceId = resolveDshSurfaceId(surfaceId);
  return DSH_CROSS_SURFACE_CLOSURE_MAP.filter((item) => item.surfaceId === resolvedSurfaceId);
}

export function getDshClosureItemsByStatus(status: DshClosureStatus) {
  return DSH_CROSS_SURFACE_CLOSURE_MAP.filter((item) => item.status === status);
}
