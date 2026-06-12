import type { DshProductIdentityApprovalStatus, DshProductCategoryMappingStatus, DshProductDuplicateStatus } from '../../shared/dsh-product-identity.model';
import type { DshPartnerActivationStatus } from '../../shared/dsh-partner-activation.model';

export type PublishGateStatus = 'not-started' | 'in-review' | 'approved' | 'rejected' | 'published';

export type CatalogPublishGateRecord = {
  id: string;
  catalogLabel: string;
  partnerLabel: string;
  itemCount: number;
  approvedItemCount: number;
  status: PublishGateStatus;
  /** Canonical approval status for prerequisite evaluation */
  approvalStatus?: DshProductIdentityApprovalStatus;
  /** Partner activation status that owns the store-side visibility gate */
  partnerActivationStatus?: DshPartnerActivationStatus;
  /** Whether at least one delivery mode is active for this store */
  deliveryModesReady?: boolean;
  /** Whether the store is serviceable for the current client area */
  serviceabilityAvailable?: boolean;
  /** Whether the store catalog is already published from the partner gate perspective */
  catalogPublished?: boolean;
  /** Category mapping status for prerequisite evaluation */
  categoryMappingStatus?: DshProductCategoryMappingStatus;
  /** Duplicate status for prerequisite evaluation */
  duplicateStatus?: DshProductDuplicateStatus;
  /** Whether media policy is satisfied */
  mediaPolicySatisfied?: boolean;
  /** Whether an audit trail is required for this gate transition */
  auditRequired?: boolean;
};

export const demoPublishGateRecord: CatalogPublishGateRecord = {
  id: 'catalog-001',
  catalogLabel: 'قائمة الطعام الرئيسية — الموسم الصيفي',
  partnerLabel: 'مطعم النجوم',
  itemCount: 42,
  approvedItemCount: 38,
  status: 'in-review',
  approvalStatus: 'catalog_adopted',
  partnerActivationStatus: 'partner_active',
  deliveryModesReady: true,
  serviceabilityAvailable: true,
  catalogPublished: true,
  categoryMappingStatus: 'mapped',
  duplicateStatus: 'clean',
  mediaPolicySatisfied: false, // still pending — demonstrates blocked gate
  auditRequired: false,
};
