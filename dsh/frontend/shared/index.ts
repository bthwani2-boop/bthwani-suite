// ── BThwani Full-Stack DSH Shared — Topic-First SSOT ─────────────────────────
// Rule: no JSX, no ui-kit, no Tamagui. Design authority: @bthwani/ui-kit only.
// WLT finance mutations: wlt/frontend/dsh/shared only.
// Import order: topic-first, then layer-compat re-exports.
// ─────────────────────────────────────────────────────────────────────────────

// ── Topics ────────────────────────────────────────────────────────────────────

export * from './full-stack';
export * from './catalog';
export * from './marketing';
export * from './notifications';
export * from './support';
export * from './operations';
export * from './products';
export * from './orders';
export * from './stores';
export * from './cart';
export * from './checkout';
export * from './delivery';
export * from './finance-boundary';
export * from './presentation-models';

// Identity-Access Topic — roles, permissions, surface visibility, audit
export * from './identity-access';

// Discovery Topic — home feed, store list, service dial, category rails
export * from './discovery';

// Platform Topic — feature flags, platform vars, runtime env config
export * from './platform';

// Media Topic — media API client, image resolution, entity media hooks, captain-pod downstream
export * from './media';

// Runtime Topic — auth client, flow registry, surface binding, price formatting, runtime contracts
export * from './runtime';

// Approval Workflow — shared pipeline types, stage transitions, and in-memory store
// Used across control-panel/catalogs, control-panel/marketing, control-panel/partners, control-panel/operations
export type {
  ApprovalRecord,
  ApprovalStage,
  ApprovalEntityType,
  ApprovalSourceSurface,
  AuditTrailEntry,
  ApprovalRecordMetadata,
  ApprovalStageTone,
  DshPromotionCandidate,
  DshPromotionIntentStatus,
} from '../app-partner/domain/partner.workflow';
export {
  translateStage,
  translateEntityType,
  translateOwner,
  resolveApprovalStageMeta,
  resolveNextOwner,
  isPartnerOwnedException,
  transitionApprovalStage,
  getAllApprovalRecords,
  getPartnerQueueRecords,
  getMarketingQueueRecords,
  getCatalogQueueRecords,
  getClientVisibleRecords,
  moveApprovalRecordToStage,
  upsertApprovalRecord,
  getDynamicUiAudits,
  getLiveOrderDecisions,
  updateLiveOrderDecision,
  dshPromotionCandidates,
  getPromotionCandidates,
  getPartnerIntakeItems,
} from '../app-partner/domain/partner.workflow';
