import {
  type DshProductIdentityApprovalStatus,
  type DshProductDuplicateStatus,
  type DshProductCategoryMappingStatus,
  type DshProductPublishingPrerequisite,
  getDshProductApprovalStateMetadata,
} from './products.contract';

/**
 * Returns true ONLY when approvalStatus = 'client_visible'.
 * Use this guard in app-client to gate product display.
 * Mirrors isDshPartnerClientVisible() from dsh-partner-activation.model.
 */
export function isDshProductClientVisible(
  status: DshProductIdentityApprovalStatus,
): boolean {
  return status === 'client_visible';
}

/**
 * Returns true if the product has active publishing blockers.
 * Use this in control-panel to disable the "publish" CTA.
 */
export function isDshProductPublishingBlocked(record: {
  approvalStatus: DshProductIdentityApprovalStatus;
  duplicateStatus: DshProductDuplicateStatus;
  categoryMappingStatus: DshProductCategoryMappingStatus;
}): boolean {
  if (record.approvalStatus === 'rejected') return true;
  if (record.approvalStatus === 'needs_fix') return true;
  if (record.duplicateStatus === 'confirmed_duplicate') return true;
  if (record.categoryMappingStatus === 'unmapped') return true;
  return false;
}

/**
 * Resolves the publishing prerequisites for a given product and partner context.
 * Used in CatalogPublishingGateSection to render the prerequisite checklist.
 *
 * All prerequisites must be satisfied before the control-panel may publish.
 */
export function getDshProductPublishingPrerequisites(options: {
  approvalStatus: DshProductIdentityApprovalStatus;
  partnerActivationClientVisible: boolean;
  deliveryModesReady: boolean;
  categoryMappingStatus: DshProductCategoryMappingStatus;
  duplicateStatus: DshProductDuplicateStatus;
  mediaPolicySatisfied: boolean;
}): ReadonlyArray<DshProductPublishingPrerequisite> {
  return [
    {
      id: 'partner_active',
      label: 'الشريك مفعّل ومرئي للعملاء',
      satisfied: options.partnerActivationClientVisible,
      blockedReason: options.partnerActivationClientVisible ? undefined : 'حالة تفعيل الشريك لا تسمح بعرض المنتجات — راجع قسم الشركاء.',
      ownerSurface: 'control-panel',
    },
    {
      id: 'catalog_approved',
      label: 'المنتج اجتاز مسار اعتماد الكتالوج',
      satisfied: options.approvalStatus === 'catalog_adopted' || options.approvalStatus === 'client_visible',
      blockedReason: (options.approvalStatus === 'catalog_adopted' || options.approvalStatus === 'client_visible') ? undefined : `حالة الاعتماد الحالية: ${getDshProductApprovalStateMetadata(options.approvalStatus).label} — يجب إكمال المسار أولاً.`,
      ownerSurface: 'control-panel',
    },
    {
      id: 'delivery_modes',
      label: 'وضع توصيل واحد على الأقل جاهز للمتجر',
      satisfied: options.deliveryModesReady,
      blockedReason: options.deliveryModesReady ? undefined : 'لا يوجد وضع توصيل نشط للمتجر — راجع إعدادات التوصيل.',
      ownerSurface: 'control-panel',
    },
    {
      id: 'category_mapping',
      label: 'الفئة مرتبطة بكتالوج المنصة',
      satisfied: options.categoryMappingStatus === 'mapped' || options.categoryMappingStatus === 'catalog_override',
      blockedReason: (options.categoryMappingStatus === 'mapped' || options.categoryMappingStatus === 'catalog_override') ? undefined : 'الفئة غير مرتبطة بالكتالوج — أرسل طلب مطابقة.',
      ownerSurface: 'control-panel',
    },
    {
      id: 'duplicate_clean',
      label: 'لا يوجد تكرار مؤكد',
      satisfied: options.duplicateStatus !== 'confirmed_duplicate',
      blockedReason: options.duplicateStatus !== 'confirmed_duplicate' ? undefined : 'تكرار مؤكد — يجب دمجه في السجل الأصلي أولاً.',
      ownerSurface: 'control-panel',
    },
    {
      id: 'media_policy',
      label: 'سياسة الميديا مستوفاة',
      satisfied: options.mediaPolicySatisfied,
      blockedReason: options.mediaPolicySatisfied ? undefined : 'سياسة الميديا تحتاج مراجعة — راجع قسم التسويق.',
      ownerSurface: 'control-panel',
    },
  ] as const;
}
