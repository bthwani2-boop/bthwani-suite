// Re-export from canonical locations.
export type {
  DshPartnerDocumentKind,
  DshPartnerDocumentVerification,
  DshPartnerCatalogOverride,
  DshPromotionCandidate,
} from '../../shared';
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
  dshPartnerIntakeMetrics,
  dshPartnerIntakeItems,
} from '../../shared';
