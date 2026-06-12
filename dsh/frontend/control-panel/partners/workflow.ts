import type { DshCanonicalPublishStage, DshCanonicalSource } from '../../shared/dshStoreProductCardModel';
import type { DshFulfillmentDeliveryMode } from '../../app-client/contracts/dsh-client-binding.contracts';

export type DshPartnerIntakeSource = 'app-field' | 'app-partner';
export type DshPartnerIntakeQueue = 'offer-approval' | 'partner-review' | 'marketing-review';

export type DshPartnerIntakeItem = {
  storeName: string;
  categoryLabel: string;
  source: DshPartnerIntakeSource;
  queue: DshPartnerIntakeQueue;
  ownerLabel: string;
  fieldStatusLabel: string;
  note: string;
  nextStep: string;
  submittedAt: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  canonicalStage?: DshCanonicalPublishStage;
  canonicalSource?: DshCanonicalSource;
} & {
  id: string;
};

export type DshPartnerIntakeMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

// Data moved to central preview data

// Data moved to central preview data

// SCAFFOLD — commission and settlement figures are WLT-owned, not authoritative here
export type DshPartnerFulfillmentMode = DshFulfillmentDeliveryMode;

export type DshPartnerModeAgreement = {
  mode: DshPartnerFulfillmentMode;
  modeLabel: string;
  enabled: boolean;
  /** SCAFFOLD — actual rate lives in WLT commission engine */
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

// Data moved to central preview data

export {
  dshPartnerIntakeMetrics,
  dshPartnerIntakeItems,
  dshPartnerApprovalLanes,
} from '../../data/legacy-preview/partner.preview-data';

// Re-export centralized models and getters/setters from shared workflow store
export type {
  DshPartnerDocumentKind,
  DshPartnerDocumentVerification,
  DshPartnerCatalogOverride,
  DshPromotionCandidate,
} from '../../shared/workflow';

export {
  resolvePartnerIdForStore,
  getPartnerActivationStatus,
  updatePartnerActivationStatus,
  getAllPartnerActivationStatuses,
  getPartnerDocuments,
  updatePartnerDocumentStatus,
  getPartnerCatalogOverrides,
  upsertPartnerCatalogOverride,
  deletePartnerCatalogOverride,
  PARTNER_FULFILLMENT_AGREEMENTS,
  getPartnerComplaints,
  updatePartnerComplaintStatus,
  getPartnerModifications,
  updatePartnerModificationStatus,
  getPartnerDisputes,
  updatePartnerDisputeStatus,
  getPromotionCandidates,
  updatePromotionCandidateStatus,
} from '../../shared/workflow';
