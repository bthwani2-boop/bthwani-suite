/**
 * DSH Product Identity Model
 *
 * SSoT for product identity, approval pipeline, barcode scan states,
 * publishing gate prerequisites, and client visibility rules across all DSH surfaces.
 *
 * Authority contract:
 * - control-panel/catalogs: owns approval, publishing gate, and catalog adoption decisions.
 * - app-partner: submits and edits local overrides (price/stock/availability) only.
 * - app-field: submits initial product entries and evidence — never approves or publishes.
 * - app-client: displays only products where approvalStatus = 'client_visible' AND
 *               the partner's activation status = 'client_visible'.
 *
 * WLT boundary:
 * - Price truth lives in WLT. DSH displays priceLabel as a read-only label only.
 * - No financial mutation (discount, commission, refund) inside DSH.
 *
 * Publishing gate prerequisites (all must be satisfied before a product reaches 'client_visible'):
 *   1. Partner activation status = 'client_visible' (from dsh-partner-activation.model)
 *   2. Product approval: approvalStatus = 'catalog_adopted' or 'client_visible'
 *   3. Delivery modes ready: at least one delivery mode is active for the store
 *   4. Serviceability: store is within active delivery zone
 *   5. Media policy satisfied (catalog-owned or partner-exception reviewed)
 */

// ─── Product approval pipeline status ────────────────────────────────────────

export type DshProductIdentityApprovalStatus =
  | 'field_draft'          // Field agent drafted — not yet submitted
  | 'partner_submitted'    // Partner submitted for catalog review
  | 'partner_review'       // Under catalog/partner review
  | 'partner_approved'     // Partner/catalog review passed
  | 'marketing_review'     // Under marketing review
  | 'marketing_approved'   // Marketing review passed
  | 'catalog_adopted'      // Adopted into master catalog — ready for publishing gate
  | 'client_visible'       // Published — visible to clients
  | 'needs_fix'            // Returned for correction (partner must resubmit)
  | 'rejected';            // Rejected — not publishable without full re-entry

// ─── Publishing pipeline status ──────────────────────────────────────────────

export type DshProductPublishingStatus =
  | 'unpublished'          // Not yet in publishing pipeline
  | 'publishing_blocked'   // One or more prerequisites not met
  | 'publishing_ready'     // All prerequisites met — control-panel can publish
  | 'published'            // Published (canonical = 'client_visible')
  | 'publishing_paused';   // Temporarily paused (e.g. partner deactivated)

// ─── Client visibility status ────────────────────────────────────────────────

export type DshProductClientVisibilityStatus =
  | 'visible'              // Client can see and add to cart
  | 'unavailable'          // Client sees item but cannot add (out of stock / partner off)
  | 'hidden'               // Not shown to client (approval not complete)
  | 'removed';             // Removed from client surface (rejected or partner deactivated)

// ─── Barcode scan preview states ─────────────────────────────────────────────

export type DshBarcodeSearchState =
  | 'camera_permission_needed'  // Camera permission not yet requested
  | 'camera_permission_denied'  // Camera permission denied — fallback to manual
  | 'scanner_ready'             // Camera ready, waiting for scan
  | 'scan_failed'               // Could not read the barcode — retry or manual
  | 'product_found'             // Barcode matched a known catalog product
  | 'duplicate_found'           // Barcode matches multiple entries — de-dup required
  | 'product_not_found'         // No catalog match — must submit for review
  | 'manual_entry_required'     // User enters barcode/SKU/GTIN manually
  | 'sent_to_catalog_review'    // New product sent to catalog review queue
  | 'approved'                  // Catalog approved the scanned product
  | 'published_to_client';      // Product is now client_visible after barcode entry

// ─── Category mapping status ─────────────────────────────────────────────────

export type DshProductCategoryMappingStatus =
  | 'mapped'               // Correctly mapped to catalog category
  | 'unmapped'             // No catalog category mapping yet
  | 'conflict'             // Proposed category differs from catalog — needs resolution
  | 'partner_proposed'     // Partner proposed a new category — awaiting catalog approval
  | 'catalog_override';    // Catalog overrode the partner's category mapping

// ─── Duplicate status ────────────────────────────────────────────────────────

export type DshProductDuplicateStatus =
  | 'clean'                // No duplicates detected
  | 'possible_duplicate'   // Potential duplicate detected — review required
  | 'confirmed_duplicate'  // Confirmed duplicate — deactivated
  | 'merged';              // Merged into master record

// ─── Publishing gate prerequisite ────────────────────────────────────────────

export type DshProductPublishingPrerequisite = {
  readonly id: string;
  readonly label: string;
  /** Whether this prerequisite is currently satisfied */
  readonly satisfied: boolean;
  /** Reason for being unsatisfied, if applicable */
  readonly blockedReason?: string;
  /** Which surface owns the resolution of this prerequisite */
  readonly ownerSurface: 'control-panel' | 'app-partner' | 'app-field' | 'system';
};

// ─── Unified product identity record ─────────────────────────────────────────

export type DshProductIdentityRecord = {
  /** Internal canonical product ID (platform SSoT) */
  readonly masterProductId: string;
  /** Partner-local product ID if overridden */
  readonly partnerProductId?: string;
  /** Stock-keeping unit */
  readonly sku?: string;
  /** Global Trade Item Number */
  readonly gtin?: string;
  /** Barcode value (EAN-13, Code-128, QR, etc.) */
  readonly barcode?: string;
  /** Category mapping */
  readonly categoryMappingStatus: DshProductCategoryMappingStatus;
  /** Duplicate detection result */
  readonly duplicateStatus: DshProductDuplicateStatus;
  /** Whether the partner has a local price/stock/availability override */
  readonly partnerOverrideStatus: 'none' | 'active' | 'pending_review' | 'rejected';
  /** Current approval stage */
  readonly approvalStatus: DshProductIdentityApprovalStatus;
  /** Current publishing status */
  readonly publishingStatus: DshProductPublishingStatus;
  /** Current client visibility */
  readonly clientVisibilityStatus: DshProductClientVisibilityStatus;
  /** Reason the product is blocked (populated when blocked or rejected) */
  readonly blockedReason?: string;
  /** Whether audit trail is required for any state transition */
  readonly auditRequired: boolean;
};

// ─── Approval state metadata ──────────────────────────────────────────────────

export type DshProductApprovalStateMetadata = {
  readonly status: DshProductIdentityApprovalStatus;
  /** Arabic label for CP and partner surfaces */
  readonly label: string;
  /** Surface that owns the resolution for this state */
  readonly ownerSurface: 'control-panel' | 'app-partner' | 'app-field' | 'system';
  /** Allowed next states from this state */
  readonly allowedNextStatuses: ReadonlyArray<DshProductIdentityApprovalStatus>;
  /** Whether the product is visible to the client in this state */
  readonly isClientVisible: boolean;
  /** Whether the product is visible to the partner in this state */
  readonly isPartnerVisible: boolean;
  /** Whether the product can be submitted for the next review stage from app-partner */
  readonly partnerCanAdvance: boolean;
  /** Whether an audit note is required for any transition out of this state */
  readonly auditRequired: boolean;
  /** Arabic hint for the primary action available in this state */
  readonly primaryActionLabel?: string;
  /** Arabic explanation for why this state blocks publishing */
  readonly publishingBlockerHint?: string;
};

// ─── DSH_PRODUCT_APPROVAL_PIPELINE ───────────────────────────────────────────

export const DSH_PRODUCT_APPROVAL_PIPELINE: ReadonlyArray<DshProductApprovalStateMetadata> = [
  {
    status: 'field_draft',
    label: 'مسودة ميداني',
    ownerSurface: 'app-field',
    allowedNextStatuses: ['partner_submitted'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'إرسال للمراجعة',
    publishingBlockerHint: 'المسودة الميدانية لم تُرسل بعد للمراجعة.',
  },
  {
    status: 'partner_submitted',
    label: 'مُقدَّم من الشريك',
    ownerSurface: 'control-panel',
    allowedNextStatuses: ['partner_review', 'needs_fix', 'rejected'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'بانتظار مراجعة الكتالوج',
    publishingBlockerHint: 'بانتظار مراجعة الكتالوج الأولى.',
  },
  {
    status: 'partner_review',
    label: 'قيد مراجعة الكتالوج',
    ownerSurface: 'control-panel',
    allowedNextStatuses: ['partner_approved', 'needs_fix', 'rejected'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'قيد المراجعة',
    publishingBlockerHint: 'المراجعة الأولى جارية — يتطلب قرار الكتالوج.',
  },
  {
    status: 'partner_approved',
    label: 'اعتمد من الكتالوج',
    ownerSurface: 'control-panel',
    allowedNextStatuses: ['marketing_review', 'needs_fix'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'بانتظار مراجعة التسويق',
    publishingBlockerHint: 'بانتظار مراجعة التسويق قبل النشر.',
  },
  {
    status: 'marketing_review',
    label: 'قيد مراجعة التسويق',
    ownerSurface: 'control-panel',
    allowedNextStatuses: ['marketing_approved', 'needs_fix', 'rejected'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'بانتظار قرار التسويق',
    publishingBlockerHint: 'المراجعة التسويقية جارية — لا يُنشر حتى الاعتماد.',
  },
  {
    status: 'marketing_approved',
    label: 'اعتمد من التسويق',
    ownerSurface: 'control-panel',
    allowedNextStatuses: ['catalog_adopted'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'جاهز لاعتماد الكتالوج',
    publishingBlockerHint: 'بانتظار قرار اعتماد الكتالوج النهائي.',
  },
  {
    status: 'catalog_adopted',
    label: 'معتمد في الكتالوج',
    ownerSurface: 'control-panel',
    allowedNextStatuses: ['client_visible', 'needs_fix'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'جاهز للنشر — يحتاج تفعيل بوابة النشر',
    publishingBlockerHint: 'المنتج معتمد — يحتاج اجتياز بوابة النشر النهائية.',
  },
  {
    status: 'client_visible',
    label: 'ظاهر للعميل',
    ownerSurface: 'system',
    allowedNextStatuses: ['needs_fix', 'rejected'],
    isClientVisible: true,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: false,
    primaryActionLabel: 'نشط — ظاهر للعملاء',
  },
  {
    status: 'needs_fix',
    label: 'يحتاج تصحيح',
    ownerSurface: 'app-partner',
    allowedNextStatuses: ['partner_submitted'],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: true,
    auditRequired: false,
    primaryActionLabel: 'طبّق التعديل وأعد الإرسال',
    publishingBlockerHint: 'المنتج مُعاد للتصحيح — يحتاج إجراء الشريك.',
  },
  {
    status: 'rejected',
    label: 'مرفوض',
    ownerSurface: 'control-panel',
    allowedNextStatuses: [],
    isClientVisible: false,
    isPartnerVisible: true,
    partnerCanAdvance: false,
    auditRequired: true,
    primaryActionLabel: 'لا يمكن النشر — مرفوض نهائيًا',
    publishingBlockerHint: 'المنتج مرفوض — يحتاج إدخال جديد كامل للمراجعة.',
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/**
 * Returns metadata for a product approval status.
 * Non-nullable — all statuses are covered in the pipeline constant.
 */
export function getDshProductApprovalStateMetadata(
  status: DshProductIdentityApprovalStatus,
): DshProductApprovalStateMetadata {
  return DSH_PRODUCT_APPROVAL_PIPELINE.find((s) => s.status === status) as DshProductApprovalStateMetadata;
}



/**
 * Resolves the Arabic label for a barcode search state.
 * Used in InventoryCatalogScreen's scan result display.
 */
export function getDshBarcodeSearchStateLabel(state: DshBarcodeSearchState): string {
  switch (state) {
    case 'camera_permission_needed': return 'الماسح يحتاج إذن الكاميرا';
    case 'camera_permission_denied': return 'تم رفض إذن الكاميرا — أدخل الباركود يدويًا';
    case 'scanner_ready':            return 'الماسح جاهز — وجّه الكاميرا نحو الباركود';
    case 'scan_failed':              return 'تعذّر قراءة الباركود — أعد المحاولة أو أدخله يدويًا';
    case 'product_found':            return 'تم العثور على المنتج في الكتالوج';
    case 'duplicate_found':          return 'تكرار محتمل — راجع السجلات قبل الإضافة';
    case 'product_not_found':        return 'الباركود غير موجود في الكتالوج — أرسل طلب إضافة';
    case 'manual_entry_required':    return 'أدخل الباركود أو SKU أو GTIN يدويًا';
    case 'sent_to_catalog_review':   return 'تم الإرسال لمراجعة الكتالوج';
    case 'approved':                 return 'المنتج معتمد في الكتالوج';
    case 'published_to_client':      return 'تم النشر — المنتج ظاهر للعملاء';
  }
}

/**
 * Resolves the Arabic label for a product approval status.
 * Delegates to the pipeline registry.
 */
export function getDshProductApprovalStatusLabel(
  status: DshProductIdentityApprovalStatus,
): string {
  return getDshProductApprovalStateMetadata(status).label;
}

/**
 * Resolves the tone for a product approval status — for badge/chip display.
 */
export function getDshProductApprovalStatusTone(
  status: DshProductIdentityApprovalStatus,
): 'success' | 'warning' | 'danger' | 'default' {
  switch (status) {
    case 'client_visible':   return 'success';
    case 'catalog_adopted':
    case 'marketing_approved':
    case 'partner_approved': return 'warning';
    case 'needs_fix':        return 'warning';
    case 'rejected':         return 'danger';
    default:                 return 'default';
  }
}
