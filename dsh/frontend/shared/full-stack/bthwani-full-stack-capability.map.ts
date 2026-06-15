import type { DshControlPanelSectionId } from '../control-panel/dsh-governance.map';
import type { DshSurfaceId } from '../runtime/dsh-flow-registry';
import type { BthwaniFullStackCapabilityId, DshSharedTopicId } from './bthwani-full-stack-capabilities';

export type BthwaniFullStackClosureStatus =
  | 'contract-required'       // backend/OpenAPI contracts not yet implemented
  | 'needs-runtime-evidence'  // code complete, runtime evidence collection pending
  | 'blocked-by-policy'       // blocked on external dependency or policy decision
  | 'needs-visual-evidence'   // runtime/code evidence exists, visual evidence collection pending
  | 'closed';                 // all required current evidence collected

export type BthwaniFullStackEvidencePack = {
  /** ISO date when this evidence was last verified */
  readonly verifiedAt?: string;
  readonly gitDiff?: string;
  readonly guardRun?: string;
  readonly typecheckRun?: string;
  readonly runtimeOutput?: string;
  readonly visualOutput?: string;
};

export type BthwaniFullStackCapabilityBinding = {
  readonly id: BthwaniFullStackCapabilityId;
  readonly backendRequired: boolean;
  readonly openapiRequired: boolean;
  /** Topics in dsh/frontend/shared that own this capability's contracts, adapters, and view-models. */
  readonly sharedTopics: readonly DshSharedTopicId[];
  readonly controlPanelSections: readonly DshControlPanelSectionId[];
  readonly mobileSurfaces: readonly DshSurfaceId[];
  readonly wltRequired: boolean;
  readonly mediaRequired: boolean;
  readonly evidenceRequired: readonly ('git-diff' | 'guard' | 'typecheck' | 'runtime' | 'visual')[];
  readonly closureStatus: BthwaniFullStackClosureStatus;
  readonly evidencePack?: BthwaniFullStackEvidencePack;
  /** Only set when closureStatus === 'blocked-by-policy'. Explains the policy blocker. */
  readonly blockedByPolicyReason?: string;
  readonly policyRef?: string;
  readonly blockers?: readonly string[];
  readonly verifiedDate?: string;
};

export const BTHWANI_FULL_STACK_CAPABILITY_MAP: Readonly<Record<BthwaniFullStackCapabilityId, BthwaniFullStackCapabilityBinding>> = {
  foundation: {
    id: 'foundation',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['runtime', 'identity-access', 'platform'],
    controlPanelSections: ['dashboard', 'platform', 'administration'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck'],
    closureStatus: 'needs-runtime-evidence',
    evidencePack: {
      verifiedAt: '2026-06-16',
      gitDiff: 'tools/registry/runs/DSH_WLT_BRANCH_TRUTH_RESET-20260616-022353/ahead-behind.txt — origin/main...origin/feat/dsh-surface-refactor = 0 behind / 67 ahead at 88840dde47c5e5c491b10084fc897a5f2a3e0f82',
      guardRun: 'node tools/guards/guard-ui-only-roots-ownership.mjs --strict-meta PASS; full-stack/runtime/type evidence still requires current rerun',
      typecheckRun: 'NEEDS_CURRENT_TYPECHECK_EVIDENCE',
    },
    blockers: ['current-full-stack-guard-required', 'current-typecheck-required'],
  },
  'actor-auth-permissions': {
    id: 'actor-auth-permissions',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['identity-access', 'platform'],
    controlPanelSections: ['administration', 'platform'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime'],
    closureStatus: 'blocked-by-policy',
    blockedByPolicyReason: 'Backend auth contract not yet implemented — requires OpenAPI definition, JWT/session strategy, and RBAC role matrix before runtime closure is possible.',
    policyRef: 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md',
    blockers: ['backend-auth-contract-required', 'openapi-auth-spec-required'],
    verifiedDate: '2026-06-16',
  },
  'catalog-store': {
    id: 'catalog-store',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['catalog', 'stores', 'products', 'media'],
    controlPanelSections: ['catalogs', 'partners', 'marketing'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'needs-runtime-evidence',
    evidencePack: {
      verifiedAt: '2026-06-16',
      gitDiff: 'tools/registry/runs/DSH_WLT_BRANCH_TRUTH_RESET-20260616-022353/ahead-behind.txt — origin/main...origin/feat/dsh-surface-refactor = 0 behind / 67 ahead at 88840dde47c5e5c491b10084fc897a5f2a3e0f82',
      guardRun: 'NEEDS_CURRENT_CATALOG_GUARD_EVIDENCE',
      typecheckRun: 'NEEDS_CURRENT_TYPECHECK_EVIDENCE',
      runtimeOutput: 'NEEDS_CURRENT_RUNTIME_EVIDENCE',
      visualOutput: 'NEEDS_CURRENT_VISUAL_EVIDENCE',
    },
    blockers: ['current-catalog-runtime-evidence-required', 'current-catalog-visual-evidence-required'],
  },
  'media-runtime': {
    id: 'media-runtime',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['media', 'platform'],
    controlPanelSections: ['catalogs', 'support', 'marketing', 'platform'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'needs-runtime-evidence',
    evidencePack: {
      verifiedAt: '2026-06-16',
      gitDiff: 'tools/registry/runs/DSH_WLT_BRANCH_TRUTH_RESET-20260616-022353/ahead-behind.txt — origin/main...origin/feat/dsh-surface-refactor = 0 behind / 67 ahead at 88840dde47c5e5c491b10084fc897a5f2a3e0f82',
      guardRun: 'NEEDS_CURRENT_REAL_MEDIA_RUNTIME_GUARD_EVIDENCE',
      typecheckRun: 'NEEDS_CURRENT_TYPECHECK_EVIDENCE',
      runtimeOutput: 'NEEDS_CURRENT_RUNTIME_EVIDENCE',
      visualOutput: 'NEEDS_CURRENT_VISUAL_EVIDENCE',
    },
    blockers: ['current-media-runtime-evidence-required', 'current-media-visual-evidence-required'],
  },
  'cart-checkout': {
    id: 'cart-checkout',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['cart', 'checkout', 'orders'],
    controlPanelSections: ['operations', 'finance', 'platform'],
    mobileSurfaces: ['app-client', 'control-panel'],
    wltRequired: true,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'blocked-by-policy',
    blockedByPolicyReason: 'Payment backend contract and WLT checkout integration contract not yet implemented. Requires OpenAPI spec for /checkout endpoints and WLT payment session handoff before runtime closure.',
    policyRef: 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md',
    blockers: ['backend-checkout-contract-required', 'wlt-payment-integration-required', 'openapi-checkout-spec-required'],
    verifiedDate: '2026-06-16',
  },
  'order-lifecycle': {
    id: 'order-lifecycle',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['orders', 'operations', 'delivery'],
    controlPanelSections: ['operations', 'support', 'finance'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    wltRequired: true,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'blocked-by-policy',
    blockedByPolicyReason: 'Order lifecycle backend contract not yet implemented. Requires OpenAPI spec for /orders endpoints, order-status state machine backend, and WLT finance read-model for order settlements.',
    policyRef: 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md',
    blockers: ['backend-orders-contract-required', 'wlt-order-settlement-required', 'openapi-orders-spec-required'],
    verifiedDate: '2026-06-16',
  },
  'captain-delivery': {
    id: 'captain-delivery',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['captain', 'delivery', 'orders', 'media'],
    controlPanelSections: ['operations', 'support', 'finance'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    wltRequired: true,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'needs-runtime-evidence',
    evidencePack: {
      verifiedAt: '2026-06-16',
      gitDiff: 'tools/registry/runs/DSH_WLT_BRANCH_TRUTH_RESET-20260616-022353/ahead-behind.txt — origin/main...origin/feat/dsh-surface-refactor = 0 behind / 67 ahead at 88840dde47c5e5c491b10084fc897a5f2a3e0f82',
      guardRun: 'NEEDS_CURRENT_CAPTAIN_DELIVERY_GUARD_EVIDENCE',
      typecheckRun: 'NEEDS_CURRENT_TYPECHECK_EVIDENCE',
      runtimeOutput: 'NEEDS_CURRENT_RUNTIME_EVIDENCE',
      visualOutput: 'NEEDS_CURRENT_VISUAL_EVIDENCE',
    },
    blockers: ['captain-surface-debrain-required', 'current-captain-runtime-evidence-required'],
  },
  'partner-operations': {
    id: 'partner-operations',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['partner', 'stores', 'products', 'media', 'operations'],
    controlPanelSections: ['operations', 'catalogs', 'partners', 'support'],
    mobileSurfaces: ['app-partner', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'blocked-by-policy',
    blockedByPolicyReason: 'Partner operations backend contract not yet implemented. Requires OpenAPI spec for /partner/stores, /partner/inventory endpoints, and partner activation/approval workflow backend.',
    policyRef: 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md',
    blockers: ['backend-partner-contract-required', 'openapi-partner-spec-required', 'partner-activation-workflow-required'],
    verifiedDate: '2026-06-16',
  },
  'field-readiness': {
    id: 'field-readiness',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['field', 'media', 'operations'],
    controlPanelSections: ['partners', 'catalogs', 'support'],
    mobileSurfaces: ['app-field', 'app-partner', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'needs-runtime-evidence',
    evidencePack: {
      verifiedAt: '2026-06-16',
      gitDiff: 'tools/registry/runs/DSH_WLT_BRANCH_TRUTH_RESET-20260616-022353/ahead-behind.txt — origin/main...origin/feat/dsh-surface-refactor = 0 behind / 67 ahead at 88840dde47c5e5c491b10084fc897a5f2a3e0f82',
      guardRun: 'NEEDS_CURRENT_FIELD_READINESS_GUARD_EVIDENCE',
      typecheckRun: 'NEEDS_CURRENT_TYPECHECK_EVIDENCE',
      runtimeOutput: 'NEEDS_CURRENT_RUNTIME_EVIDENCE; visit contract still contains runtimeTruth:false until P0-08 is implemented',
      visualOutput: 'NEEDS_CURRENT_VISUAL_EVIDENCE',
    },
    blockers: ['field-backend-id-route-boundary-required', 'field-visit-runtime-truth-required'],
  },
  'support-escalation': {
    id: 'support-escalation',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['support', 'operations', 'media'],
    controlPanelSections: ['support', 'operations'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: true,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'blocked-by-policy',
    blockedByPolicyReason: 'Support escalation backend contract not yet implemented. Requires OpenAPI spec for /support/tickets endpoints, ticket lifecycle backend, and messaging/chat backend infrastructure.',
    policyRef: 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md',
    blockers: ['backend-support-contract-required', 'openapi-support-spec-required', 'messaging-backend-required'],
    verifiedDate: '2026-06-16',
  },
  'wlt-finance-read-model': {
    id: 'wlt-finance-read-model',
    backendRequired: false,
    openapiRequired: true,
    sharedTopics: ['finance-boundary'],
    controlPanelSections: ['finance', 'dashboard'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel', 'wlt-finance'],
    wltRequired: true,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime'],
    closureStatus: 'blocked-by-policy',
    blockedByPolicyReason: 'WLT finance read model is runtime-unbound. WLT backend is live (port 8083) but DSH→WLT OpenAPI contract and actor-scoped read model binding are not yet complete. No preview/fallback data is shown — display is gated until runtime binding is established.',
    policyRef: 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md',
    blockers: ['wlt-dsh-openapi-contract-required', 'actor-scoped-read-model-binding-required'],
    verifiedDate: '2026-06-16',
  },
  'control-panel-governance': {
    id: 'control-panel-governance',
    backendRequired: false,
    openapiRequired: false,
    sharedTopics: ['identity-access', 'platform', 'control-panel'],
    controlPanelSections: ['dashboard', 'operations', 'support', 'finance', 'catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'],
    mobileSurfaces: ['control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'visual'],
    closureStatus: 'needs-visual-evidence',
    evidencePack: {
      verifiedAt: '2026-06-16',
      gitDiff: 'tools/registry/runs/DSH_WLT_BRANCH_TRUTH_RESET-20260616-022353/ahead-behind.txt — origin/main...origin/feat/dsh-surface-refactor = 0 behind / 67 ahead at 88840dde47c5e5c491b10084fc897a5f2a3e0f82',
      guardRun: 'NEEDS_CURRENT_CONTROL_PANEL_GUARD_EVIDENCE',
      typecheckRun: 'NEEDS_CURRENT_TYPECHECK_EVIDENCE',
      visualOutput: 'NEEDS_CURRENT_VISUAL_EVIDENCE',
    },
    blockers: ['current-control-panel-visual-evidence-required'],
  },
  notifications: {
    id: 'notifications',
    backendRequired: true,
    openapiRequired: true,
    sharedTopics: ['notifications', 'platform'],
    controlPanelSections: ['operations', 'support', 'platform'],
    mobileSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
    wltRequired: false,
    mediaRequired: false,
    evidenceRequired: ['git-diff', 'guard', 'typecheck', 'runtime', 'visual'],
    closureStatus: 'blocked-by-policy',
    blockedByPolicyReason: 'Push and in-app notification backend contract not yet implemented. Requires FCM/APNs integration contract, OpenAPI spec for /notifications endpoints, and actor-subscription model before runtime closure.',
    policyRef: 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md',
    blockers: ['backend-notifications-contract-required', 'push-infrastructure-required', 'openapi-notifications-spec-required'],
    verifiedDate: '2026-06-16',
  },
} as const;

export const BTHWANI_FULL_STACK_CAPABILITY_LIST = Object.values(BTHWANI_FULL_STACK_CAPABILITY_MAP);

export function getBthwaniFullStackCapability(id: BthwaniFullStackCapabilityId): BthwaniFullStackCapabilityBinding {
  return BTHWANI_FULL_STACK_CAPABILITY_MAP[id];
}
