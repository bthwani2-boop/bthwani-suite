import type { ApprovalStage } from '../../app-partner/domain/partner.workflow';
import { getPartnerActivationStatus, resolvePartnerIdForStore } from '../../app-partner/domain/partner.workflow';
import {
  getDshPartnerActivationStateMetadata,
  getDshPartnerReadinessChecklist,
  getDshPartnerVisibilityBadge,
  getDshPartnerVisibilityBadgeLabel,
  type DshPartnerActivationStatus,
  type DshPartnerReadinessCheckItem,
  type DshPartnerVisibilityBadge,
} from '../../app-partner/domain/dsh-partner-activation.model';
import {
  getDshProductApprovalStateMetadata,
  getDshProductPublishingPrerequisites,
  type DshProductCategoryMappingStatus,
  type DshProductClientVisibilityStatus,
  type DshProductDuplicateStatus,
  type DshProductIdentityApprovalStatus,
  type DshProductPublishingPrerequisite,
  type DshProductPublishingStatus,
} from '../products';

export type DshClientVisibilityBlockedCode =
  | 'field_readiness_not_ready'
  | 'documents_not_verified'
  | 'ops_not_approved'
  | 'partner_not_active'
  | 'catalog_not_published'
  | 'delivery_mode_not_available'
  | 'serviceability_not_available'
  | 'product_not_approved'
  | 'category_not_mapped'
  | 'duplicate_detected'
  | 'media_policy_not_satisfied'
  | 'publishing_not_ready';

export type DshStoreClientVisibilityResult = {
  readonly visible: boolean;
  readonly activationStatus: DshPartnerActivationStatus;
  readonly badge: DshPartnerVisibilityBadge;
  readonly badgeLabel: string;
  readonly blockedCode?: DshClientVisibilityBlockedCode;
  readonly blockedReason?: string;
  readonly checklist: ReadonlyArray<DshPartnerReadinessCheckItem>;
  readonly catalogPublished: boolean;
  readonly deliveryModesReady: boolean;
  readonly serviceabilityAvailable: boolean;
};

export type DshProductClientVisibilityResult = {
  readonly visible: boolean;
  readonly approvalStatus: DshProductIdentityApprovalStatus;
  readonly publishingStatus: DshProductPublishingStatus;
  readonly clientVisibilityStatus: DshProductClientVisibilityStatus;
  readonly blockedCode?: DshClientVisibilityBlockedCode;
  readonly blockedReason?: string;
  readonly storeVisibility: DshStoreClientVisibilityResult;
  readonly publishingPrerequisites: ReadonlyArray<DshProductPublishingPrerequisite>;
};

type DshStoreClientVisibilityOptions = {
  readonly storeId?: string;
  readonly publishStage?: string;
  readonly approvalStage?: ApprovalStage;
  readonly activationStatus?: DshPartnerActivationStatus;
  readonly fieldReadinessReady?: boolean;
  readonly documentsVerified?: boolean;
  readonly opsApproved?: boolean;
  readonly catalogPublished?: boolean;
  readonly deliveryModesReady?: boolean;
  readonly serviceabilityAvailable?: boolean;
  readonly storeOpen?: boolean;
  readonly busy?: boolean;
  readonly inZone?: boolean;
  readonly supportsPickup?: boolean;
  readonly supportsPartnerDelivery?: boolean;
  readonly hasBthwaniDelivery?: boolean;
  readonly serviceLabel?: string;
  readonly deliveryLabel?: string;
};

type DshProductClientVisibilityOptions = DshStoreClientVisibilityOptions & {
  readonly productPublishStage?: string;
  readonly approvalStatus?: DshProductIdentityApprovalStatus;
  readonly publishingStatus?: DshProductPublishingStatus;
  readonly categoryMappingStatus?: DshProductCategoryMappingStatus;
  readonly duplicateStatus?: DshProductDuplicateStatus;
  readonly mediaPolicySatisfied?: boolean;
};

export function mapApprovalStageToPartnerActivationStatus(
  stage?: ApprovalStage | string,
): DshPartnerActivationStatus {
  switch (stage) {
    case 'field-submitted':
      return 'documents_uploaded';
    case 'partner-submitted':
      return 'submitted';
    case 'partner-review':
      return 'documents_verified';
    case 'partner-approved':
      return 'catalog_not_ready';
    case 'marketing-review':
      return 'catalog_ready';
    case 'marketing-approved':
      return 'delivery_modes_ready';
    case 'catalog-adopted':
      return 'partner_active';
    case 'client-visible':
    case 'published':
      return 'client_visible';
    case 'rejected':
      return 'ops_rejected';
    case 'needs-fix':
      return 'documents_missing';
    case 'field-draft':
    case 'draft':
      return 'draft';
    default:
      return 'draft';
  }
}

export function mapPublishStageToPartnerActivationStatus(
  publishStage?: string,
): DshPartnerActivationStatus {
  if (publishStage === 'published-preview') {
    return 'partner_active';
  }

  return mapApprovalStageToPartnerActivationStatus(publishStage);
}

export function mapPublishStageToProductApprovalStatus(
  publishStage?: string,
): DshProductIdentityApprovalStatus {
  switch (publishStage) {
    case 'field-draft':
    case 'draft':
      return 'field_draft';
    case 'field-submitted':
    case 'partner-submitted':
      return 'partner_submitted';
    case 'partner-review':
      return 'partner_review';
    case 'partner-approved':
      return 'partner_approved';
    case 'marketing-review':
      return 'marketing_review';
    case 'marketing-approved':
      return 'marketing_approved';
    case 'catalog-adopted':
      return 'catalog_adopted';
    case 'client-visible':
    case 'published-preview':
    case 'published':
      return 'client_visible';
    case 'needs-fix':
      return 'needs_fix';
    case 'rejected':
      return 'rejected';
    default:
      return 'partner_submitted';
  }
}

function inferCatalogPublished(publishStage?: string) {
  return publishStage === 'client-visible' || publishStage === 'published-preview' || publishStage === 'published';
}

function inferDeliveryModesReady(options: DshStoreClientVisibilityOptions) {
  if (typeof options.deliveryModesReady === 'boolean') {
    return options.deliveryModesReady;
  }

  if (options.hasBthwaniDelivery) {
    return true;
  }

  if (options.supportsPickup || options.supportsPartnerDelivery) {
    return true;
  }

  const normalized = `${options.serviceLabel ?? ''} ${options.deliveryLabel ?? ''}`.trim();
  return normalized.length > 0 && normalized !== '-' && normalized !== '—';
}

function inferServiceabilityAvailable(options: DshStoreClientVisibilityOptions) {
  if (typeof options.serviceabilityAvailable === 'boolean') {
    return options.serviceabilityAvailable;
  }

  if (options.inZone === false) {
    return false;
  }

  const normalized = `${options.serviceLabel ?? ''} ${options.deliveryLabel ?? ''}`.toLowerCase();
  if (
    normalized.includes('خارج النطاق')
    || normalized.includes('خارج التغطية')
    || normalized.includes('غير مخدوم')
    || normalized.includes('unserviceable')
    || normalized.includes('outside coverage')
  ) {
    return false;
  }

  return true;
}

function inferDocumentsVerified(status: DshPartnerActivationStatus, explicit?: boolean) {
  if (typeof explicit === 'boolean') {
    return explicit;
  }

  return getDshPartnerReadinessChecklist(status).find((item) => item.id === 'documents')?.satisfied ?? false;
}

function inferFieldReadinessReady(status: DshPartnerActivationStatus, explicit?: boolean) {
  if (typeof explicit === 'boolean') {
    return explicit;
  }

  return status !== 'draft'
    && status !== 'submitted'
    && status !== 'field_visit_scheduled'
    && status !== 'field_visit_completed';
}

function inferOpsApproved(status: DshPartnerActivationStatus, explicit?: boolean) {
  if (typeof explicit === 'boolean') {
    return explicit;
  }

  return status === 'ops_approved'
    || status === 'partner_active'
    || status === 'client_visible'
    || status === 'client_hidden';
}

function resolveStoreBlockedReason(
  code: DshClientVisibilityBlockedCode,
  status: DshPartnerActivationStatus,
): string {
  const metadata = getDshPartnerActivationStateMetadata(status);

  switch (code) {
    case 'field_readiness_not_ready':
      return 'جاهزية الملف الميداني لم تصل إلى مستوى ready بعد — استكمل ملف onboarding أولًا.';
    case 'documents_not_verified':
      return metadata.blockedReason || 'الوثائق لم تُعتمد بعد — يبقى المتجر مخفيًا حتى التحقق الكامل.';
    case 'ops_not_approved':
      return 'قرار العمليات النهائي لم يُسجّل بعد — لا يجوز فتح المتجر للعميل قبل الموافقة.';
    case 'partner_not_active':
      return 'حالة الشريك ليست active — لا يظهر المتجر للعميل قبل التفعيل التشغيلي.';
    case 'catalog_not_published':
      return 'الكتالوج لم يصل إلى publishing = published بعد — واجهة العميل تبقى محجوبة.';
    case 'delivery_mode_not_available':
      return 'لا يوجد وضع توصيل متاح لهذا المتجر — يجب تفعيل mode واحد على الأقل قبل الظهور.';
    case 'serviceability_not_available':
      return 'الخدمة غير متاحة لهذا النطاق حاليًا — يبقى المتجر hidden حتى عودة serviceability.';
    default:
      return metadata.blockedReason || 'المتجر لم يجتز بوابة الظهور الكاملة بعد.';
  }
}

function withServiceabilityChecklist(
  checklist: ReadonlyArray<DshPartnerReadinessCheckItem>,
  serviceabilityAvailable: boolean,
): ReadonlyArray<DshPartnerReadinessCheckItem> {
  return [
    ...checklist,
    {
      id: 'serviceability',
      label: 'النطاق الخدمي متاح',
      satisfied: serviceabilityAvailable,
      blockedReason: serviceabilityAvailable ? undefined : 'النطاق الحالي غير مخدوم — لا يظهر المتجر للعميل.',
    },
  ];
}

export function resolveDshStoreClientVisibility(
  options: DshStoreClientVisibilityOptions,
): DshStoreClientVisibilityResult {
  let activationStatus = options.activationStatus;
  if (!activationStatus && options.storeId) {
    const partnerId = resolvePartnerIdForStore(options.storeId);
    activationStatus = getPartnerActivationStatus(partnerId);
  }
  if (!activationStatus) {
    activationStatus = mapPublishStageToPartnerActivationStatus(options.approvalStage ?? options.publishStage);
  }
  const fieldReadinessReady = inferFieldReadinessReady(activationStatus, options.fieldReadinessReady);
  const documentsVerified = inferDocumentsVerified(activationStatus, options.documentsVerified);
  const opsApproved = inferOpsApproved(activationStatus, options.opsApproved);
  const partnerActive = activationStatus === 'partner_active' || activationStatus === 'client_visible';
  const catalogPublished = typeof options.catalogPublished === 'boolean'
    ? options.catalogPublished
    : inferCatalogPublished(options.publishStage);
  const deliveryModesReady = inferDeliveryModesReady(options);
  const serviceabilityAvailable = inferServiceabilityAvailable(options);
  const badge = getDshPartnerVisibilityBadge(
    activationStatus,
    options.storeOpen ?? true,
    options.busy ?? false,
    options.inZone ?? serviceabilityAvailable,
  );
  const checklist = withServiceabilityChecklist(
    getDshPartnerReadinessChecklist(activationStatus),
    serviceabilityAvailable,
  );

  const blockedCode =
    !fieldReadinessReady ? 'field_readiness_not_ready'
      : !documentsVerified ? 'documents_not_verified'
        : !opsApproved ? 'ops_not_approved'
          : !partnerActive ? 'partner_not_active'
            : !catalogPublished ? 'catalog_not_published'
              : !deliveryModesReady ? 'delivery_mode_not_available'
                : !serviceabilityAvailable ? 'serviceability_not_available'
                  : undefined;

  return {
    visible: !blockedCode,
    activationStatus,
    badge,
    badgeLabel: getDshPartnerVisibilityBadgeLabel(badge),
    blockedCode,
    blockedReason: blockedCode ? resolveStoreBlockedReason(blockedCode, activationStatus) : undefined,
    checklist,
    catalogPublished,
    deliveryModesReady,
    serviceabilityAvailable,
  };
}

function inferPublishingStatus(
  approvalStatus: DshProductIdentityApprovalStatus,
  storeVisibility: DshStoreClientVisibilityResult,
  hasBlockers: boolean,
  explicit?: DshProductPublishingStatus,
): DshProductPublishingStatus {
  if (explicit) {
    return explicit;
  }

  if (!storeVisibility.visible && storeVisibility.blockedCode === 'partner_not_active') {
    return 'publishing_paused';
  }

  if (approvalStatus === 'client_visible' && !hasBlockers && storeVisibility.visible) {
    return 'published';
  }

  if (approvalStatus === 'catalog_adopted' && !hasBlockers && storeVisibility.visible) {
    return 'publishing_ready';
  }

  return hasBlockers ? 'publishing_blocked' : 'unpublished';
}

export function resolveDshProductClientVisibility(
  options: DshProductClientVisibilityOptions,
): DshProductClientVisibilityResult {
  const storeVisibility = resolveDshStoreClientVisibility(options);
  const approvalStatus = options.approvalStatus ?? mapPublishStageToProductApprovalStatus(options.productPublishStage ?? options.publishStage);
  const publishingPrerequisites = getDshProductPublishingPrerequisites({
    approvalStatus,
    partnerActivationClientVisible: storeVisibility.visible,
    deliveryModesReady: storeVisibility.deliveryModesReady,
    categoryMappingStatus: options.categoryMappingStatus ?? 'mapped',
    duplicateStatus: options.duplicateStatus ?? 'clean',
    mediaPolicySatisfied: options.mediaPolicySatisfied ?? true,
  });
  const unsatisfied = publishingPrerequisites.find((item) => !item.satisfied);
  const publishingStatus = inferPublishingStatus(approvalStatus, storeVisibility, Boolean(unsatisfied), options.publishingStatus);
  const approvalVisible = approvalStatus === 'client_visible';

  let blockedCode: DshClientVisibilityBlockedCode | undefined = storeVisibility.blockedCode;
  if (!blockedCode && approvalStatus !== 'catalog_adopted' && approvalStatus !== 'client_visible') {
    blockedCode = 'product_not_approved';
  } else if (!blockedCode && unsatisfied?.id === 'category_mapping') {
    blockedCode = 'category_not_mapped';
  } else if (!blockedCode && unsatisfied?.id === 'duplicate_clean') {
    blockedCode = 'duplicate_detected';
  } else if (!blockedCode && unsatisfied?.id === 'media_policy') {
    blockedCode = 'media_policy_not_satisfied';
  } else if (!blockedCode && publishingStatus !== 'published' && approvalStatus !== 'client_visible') {
    blockedCode = 'publishing_not_ready';
  }

  const blockedReason = storeVisibility.blockedReason
    ?? unsatisfied?.blockedReason
    ?? (blockedCode === 'product_not_approved'
      ? `حالة المنتج الحالية: ${getDshProductApprovalStateMetadata(approvalStatus).label} — لا يمكن عرضه للعميل قبل اكتمال الاعتماد والنشر.`
      : blockedCode === 'publishing_not_ready'
        ? 'بوابة النشر لم تكتمل بعد — يبقى المنتج hidden حتى تثبيت جميع الشروط.'
        : undefined);

  return {
    visible: storeVisibility.visible && approvalVisible && publishingStatus === 'published' && !unsatisfied,
    approvalStatus,
    publishingStatus,
    clientVisibilityStatus: storeVisibility.visible && approvalVisible && publishingStatus === 'published' && !unsatisfied
      ? 'visible'
      : publishingStatus === 'publishing_paused'
        ? 'removed'
        : 'hidden',
    blockedCode,
    blockedReason,
    storeVisibility,
    publishingPrerequisites,
  };
}
