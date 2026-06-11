/**
 * DSH Partner Activation Model
 *
 * SSoT for partner activation lifecycle across all DSH surfaces.
 * Governs how a partner entity moves from initial draft through
 * full client visibility, and defines who owns each step, who
 * can see each state, what action is next, and whether audit is required.
 *
 * System rules (never violate):
 * - app-field    : collects evidence only — never activates a partner
 * - app-partner  : reads status and readiness — never self-activates
 * - control-panel: owns all activation, approval, and deactivation decisions
 * - app-client   : sees store ONLY when status is 'client_visible'
 *                  (requires: partner_active + catalog_ready + delivery_modes_ready + serviceability)
 * - deactivation : immediately removes partner from client discovery as UI state
 *
 * WLT boundary: any settlement, payout, or financial gate is WLT-owned.
 * This model tracks operational/lifecycle visibility only.
 */

// ─── Partner activation status ────────────────────────────────────────────────
//
// 18 states ordered by lifecycle phase.
// Naming convention: snake_case, present-tense description of current state.

export type DshPartnerActivationStatus =
  // ── Submission and initial data ───────────────────────────────────────────
  | 'draft'                    // Partner profile being built by field or partner
  | 'submitted'                // Partner submitted for review
  | 'field_visit_scheduled'    // Field visit booked; evidence collection pending
  | 'field_visit_completed'    // Field visit evidence collected; documents next
  | 'documents_missing'        // Required documents absent or incomplete
  | 'documents_uploaded'       // Documents uploaded; awaiting CP verification
  | 'documents_verified'       // CP verified all documents; ops review next
  // ── Catalog and delivery mode readiness ───────────────────────────────────
  | 'catalog_not_ready'        // Catalog empty or not yet approved for publishing
  | 'catalog_ready'            // Catalog approved and ready; delivery modes check next
  | 'delivery_modes_not_ready' // Delivery mode configuration missing or invalid
  | 'delivery_modes_ready'     // All delivery modes configured and verified
  // ── Operations review ─────────────────────────────────────────────────────
  | 'ops_review'               // Final CP operations review before activation
  | 'ops_approved'             // CP operations approved; activation trigger next
  | 'ops_rejected'             // CP operations rejected the partner
  // ── Active states ─────────────────────────────────────────────────────────
  | 'partner_active'           // Partner is operationally active
  | 'partner_deactivated'      // Partner deactivated by CP — immediately client_hidden
  // ── Client visibility gate ────────────────────────────────────────────────
  | 'client_visible'           // All gates passed: partner_active + catalog_ready + delivery_modes_ready + serviceability
  | 'client_hidden';           // Active partner but hidden from client discovery (ops override, deactivated, out-of-zone)

// ─── Client-facing visibility badge ──────────────────────────────────────────
//
// What the client sees on the store card.
// 'hidden-pending-approval' and 'catalog-not-ready' are shown only
// in partner/field/CP surfaces — never to client.

export type DshPartnerVisibilityBadge =
  | 'active'                   // Open and accepting orders (shown to client)
  | 'closed'                   // Partner active but store hours are closed (shown to client)
  | 'busy'                     // Partner active but overloaded (shown to client)
  | 'out-of-zone'              // Partner active but client outside delivery zone (shown to client)
  | 'hidden-pending-approval'  // Not yet approved by CP (partner/field/CP only)
  | 'catalog-not-ready';       // Approved but catalog incomplete (partner/CP only)

// ─── Supporting types ─────────────────────────────────────────────────────────

export type DshPartnerActivationActorSurface =
  | 'app-field'
  | 'app-partner'
  | 'control-panel'
  | 'system';

export type DshPartnerReadinessCheckItem = {
  readonly id: string;
  readonly label: string;
  readonly satisfied: boolean;
  readonly blockedReason?: string;
};

// ─── State metadata interface ─────────────────────────────────────────────────
//
// Every field is required — no optional fields in metadata.
// Each state must declare its full behavioral contract.

export type DshPartnerActivationStateMetadata = {
  readonly status: DshPartnerActivationStatus;
  /** Which surface owns the action/decision in this state */
  readonly ownerSurface: DshPartnerActivationActorSurface;
  /** Arabic label for the actor responsible */
  readonly actorResponsible: string;
  /** Partner app can see this status */
  readonly visibleToPartner: boolean;
  /** Field app can see this status */
  readonly visibleToField: boolean;
  /** Control panel can see this status */
  readonly visibleToControlPanel: boolean;
  /**
   * Client discovery shows this partner.
   * true ONLY for 'client_visible'.
   * partner_deactivated immediately becomes false.
   */
  readonly visibleToClient: boolean;
  /** Arabic label for what action is needed next */
  readonly nextAction: string;
  /** Arabic explanation of what is blocking progress (empty string if not blocked) */
  readonly blockedReason: string;
  /** Whether this state change must be recorded in the audit trail */
  readonly auditRequired: boolean;
  /** States this status can transition to */
  readonly allowedNextStatuses: ReadonlyArray<DshPartnerActivationStatus>;
};

// ─── DSH_PARTNER_ACTIVATION_STATES ───────────────────────────────────────────
//
// 18 entries — one per status. Order matches lifecycle progression.

export const DSH_PARTNER_ACTIVATION_STATES: ReadonlyArray<DshPartnerActivationStateMetadata> = [
  // ── Submission and initial data ───────────────────────────────────────────
  {
    status: 'draft',
    ownerSurface: 'app-field',
    actorResponsible: 'الميداني',
    visibleToPartner: true,
    visibleToField: true,
    visibleToControlPanel: false,
    visibleToClient: false,
    nextAction: 'إتمام جمع البيانات الأساسية وإرسال ملف الشريك',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['submitted', 'field_visit_scheduled'],
  },
  {
    status: 'submitted',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: true,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'مراجعة الملف المُرسَل من الميدان وتحديد الخطوة التالية',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['field_visit_scheduled', 'documents_missing', 'documents_uploaded'],
  },
  {
    status: 'field_visit_scheduled',
    ownerSurface: 'app-field',
    actorResponsible: 'الميداني',
    visibleToPartner: false,
    visibleToField: true,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'تنفيذ الزيارة الميدانية وجمع الأدلة المطلوبة',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['field_visit_completed', 'documents_missing'],
  },
  {
    status: 'field_visit_completed',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: false,
    visibleToField: true,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'مراجعة أدلة الزيارة والانتقال للتحقق من الوثائق',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['documents_missing', 'documents_uploaded'],
  },
  {
    status: 'documents_missing',
    ownerSurface: 'app-partner',
    actorResponsible: 'الشريك',
    visibleToPartner: true,
    visibleToField: true,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'رفع الوثائق الناقصة من قِبل الشريك لإتمام ملف الاعتماد',
    blockedReason: 'وثائق مطلوبة غائبة أو غير مكتملة — لا يمكن المتابعة قبل رفعها',
    auditRequired: false,
    allowedNextStatuses: ['documents_uploaded'],
  },
  {
    status: 'documents_uploaded',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'مراجعة الوثائق المرفوعة والتحقق من صحتها',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['documents_verified', 'documents_missing'],
  },
  {
    status: 'documents_verified',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'الانتقال لمرحلة تجهيز الكتالوج والمنتجات',
    blockedReason: '',
    auditRequired: true,
    allowedNextStatuses: ['catalog_not_ready', 'ops_review'],
  },
  // ── Catalog and delivery mode readiness ───────────────────────────────────
  {
    status: 'catalog_not_ready',
    ownerSurface: 'app-partner',
    actorResponsible: 'الشريك + قسم الكتالوج (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'إضافة المنتجات وإعداد الكتالوج وطلب الاعتماد',
    blockedReason: 'الكتالوج فارغ أو غير معتمد — لا يمكن الظهور للعملاء قبل اعتماد الكتالوج',
    auditRequired: false,
    allowedNextStatuses: ['catalog_ready', 'ops_review'],
  },
  {
    status: 'catalog_ready',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الكتالوج (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'التحقق من تهيئة أوضاع التوصيل',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['delivery_modes_not_ready', 'delivery_modes_ready'],
  },
  {
    status: 'delivery_modes_not_ready',
    ownerSurface: 'app-partner',
    actorResponsible: 'الشريك + قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'تهيئة وتأكيد أوضاع التوصيل المدعومة (بثواني / المتجر / استلام)',
    blockedReason: 'أوضاع التوصيل غير مكتملة — يجب تحديد طريقة توصيل واحدة على الأقل',
    auditRequired: false,
    allowedNextStatuses: ['delivery_modes_ready'],
  },
  {
    status: 'delivery_modes_ready',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'رفع الملف للمراجعة التشغيلية النهائية',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['ops_review'],
  },
  // ── Operations review ─────────────────────────────────────────────────────
  {
    status: 'ops_review',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP) — مراجعة نهائية',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'مراجعة الملف الكامل واتخاذ قرار التفعيل أو الرفض مع ذكر السبب والدليل',
    blockedReason: '',
    auditRequired: true,
    allowedNextStatuses: ['ops_approved', 'ops_rejected'],
  },
  {
    status: 'ops_approved',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'تفعيل الشريك وتحويله لحالة نشط',
    blockedReason: '',
    auditRequired: true,
    allowedNextStatuses: ['partner_active'],
  },
  {
    status: 'ops_rejected',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false,
    nextAction: 'إبلاغ الشريك بالسبب وتحديد المسار لإعادة المحاولة',
    blockedReason: 'رُفض الشريك من قِبل العمليات — يرجى مراجعة التفاصيل وإعادة التقديم بعد المعالجة',
    auditRequired: true,
    allowedNextStatuses: ['submitted', 'documents_missing'],
  },
  // ── Active states ─────────────────────────────────────────────────────────
  {
    status: 'partner_active',
    ownerSurface: 'system',
    actorResponsible: 'النظام (مدار من CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false, // Visibility to client requires the full gate: client_visible state
    nextAction: 'التحقق من اجتياز جميع شروط الظهور لتمكين client_visible',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['client_visible', 'client_hidden', 'partner_deactivated'],
  },
  {
    status: 'partner_deactivated',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false, // Immediately removed from client discovery upon deactivation
    nextAction: 'مراجعة سبب الإيقاف وتحديد مسار إعادة التفعيل إن أمكن',
    blockedReason: 'الشريك موقوف من قِبل العمليات — يختفي فورًا من قائمة المتاجر لدى العميل',
    auditRequired: true,
    allowedNextStatuses: ['ops_review', 'submitted'],
  },
  // ── Client visibility gate ────────────────────────────────────────────────
  {
    status: 'client_visible',
    ownerSurface: 'system',
    actorResponsible: 'النظام (جميع الشروط مستوفاة)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: true, // The ONLY status where client can discover this partner
    nextAction: 'صيانة الحالة والمراقبة التشغيلية',
    blockedReason: '',
    auditRequired: false,
    allowedNextStatuses: ['client_hidden', 'partner_deactivated'],
  },
  {
    status: 'client_hidden',
    ownerSurface: 'control-panel',
    actorResponsible: 'قسم الشركاء (CP)',
    visibleToPartner: true,
    visibleToField: false,
    visibleToControlPanel: true,
    visibleToClient: false, // Active partner, hidden by ops override or zone mismatch
    nextAction: 'مراجعة سبب الإخفاء ورفع القيد عند الجاهزية',
    blockedReason: 'الشريك نشط لكن مخفي من اكتشاف العملاء — تجاوز تشغيلي أو خارج النطاق',
    auditRequired: true,
    allowedNextStatuses: ['client_visible', 'partner_deactivated'],
  },
];

// ─── Lookup function ──────────────────────────────────────────────────────────

/**
 * Returns the full metadata for a partner activation status.
 * Non-nullable — all 18 statuses are covered in the constant.
 */
export function getDshPartnerActivationStateMetadata(
  status: DshPartnerActivationStatus,
): DshPartnerActivationStateMetadata {
  return DSH_PARTNER_ACTIVATION_STATES.find(
    (s) => s.status === status,
  ) as DshPartnerActivationStateMetadata;
}

// ─── Visibility helpers ───────────────────────────────────────────────────────

/**
 * Returns true ONLY when status is 'client_visible'.
 * All other statuses — including partner_active — are hidden from client discovery.
 *
 * Gate conditions for client_visible:
 *   partner_active + catalog_ready + delivery_modes_ready + serviceability
 */
export function isDshPartnerClientVisible(status: DshPartnerActivationStatus): boolean {
  return status === 'client_visible';
}

/**
 * Returns true when activation is fully complete:
 * partner is active, catalog ready, delivery modes ready.
 * Does not check serviceability (runtime, not model-level).
 */
export function isDshPartnerActivationComplete(status: DshPartnerActivationStatus): boolean {
  return status === 'client_visible' || status === 'partner_active';
}

/**
 * Returns the client-facing visibility badge for a partner.
 *
 * Only 'active', 'closed', 'busy', 'out-of-zone' are shown to clients.
 * 'hidden-pending-approval' and 'catalog-not-ready' are for internal surfaces only.
 *
 * @param status     - Current activation status
 * @param storeOpen  - Whether the store is within its operating hours
 * @param busy       - Whether the store is at capacity (optional)
 * @param inZone     - Whether the client is within the delivery zone (optional)
 */
export function getDshPartnerVisibilityBadge(
  status: DshPartnerActivationStatus,
  storeOpen: boolean,
  busy = false,
  inZone = true,
): DshPartnerVisibilityBadge {
  if (status === 'client_visible' || status === 'partner_active') {
    if (!inZone) return 'out-of-zone';
    if (!storeOpen) return 'closed';
    if (busy) return 'busy';
    return 'active';
  }
  if (
    status === 'catalog_not_ready' ||
    status === 'delivery_modes_not_ready' ||
    status === 'catalog_ready' ||
    status === 'delivery_modes_ready'
  ) {
    return 'catalog-not-ready';
  }
  return 'hidden-pending-approval';
}

/**
 * Arabic label for a client-facing visibility badge.
 * Use on store card, search result, and store detail header.
 */
export function getDshPartnerVisibilityBadgeLabel(badge: DshPartnerVisibilityBadge): string {
  switch (badge) {
    case 'active':                   return 'مفتوح';
    case 'closed':                   return 'مغلق الآن';
    case 'busy':                     return 'مشغول';
    case 'out-of-zone':              return 'خارج نطاق التوصيل';
    case 'hidden-pending-approval':  return 'قيد المراجعة';
    case 'catalog-not-ready':        return 'الكتالوج غير جاهز';
  }
}

/**
 * UI tone for a visibility badge.
 * Maps to the token system in @bthwani/ui-kit.
 */
export function getDshPartnerVisibilityBadgeTone(
  badge: DshPartnerVisibilityBadge,
): 'success' | 'warning' | 'danger' | 'muted' {
  switch (badge) {
    case 'active':      return 'success';
    case 'closed':      return 'warning';
    case 'busy':        return 'warning';
    case 'out-of-zone': return 'danger';
    default:            return 'muted';
  }
}

/**
 * Returns the readiness checklist for partner-facing display.
 * Shows which of the 4 required conditions are satisfied
 * before the partner can become client_visible.
 *
 * Does NOT check serviceability (runtime concern, not model-level).
 */
export function getDshPartnerReadinessChecklist(
  status: DshPartnerActivationStatus,
): ReadonlyArray<DshPartnerReadinessCheckItem> {
  const isDocumentsDone = (
    status === 'documents_verified' ||
    status === 'catalog_not_ready' ||
    status === 'catalog_ready' ||
    status === 'delivery_modes_not_ready' ||
    status === 'delivery_modes_ready' ||
    status === 'ops_review' ||
    status === 'ops_approved' ||
    status === 'partner_active' ||
    status === 'client_visible' ||
    status === 'client_hidden'
  );

  const isCatalogDone = (
    status === 'catalog_ready' ||
    status === 'delivery_modes_not_ready' ||
    status === 'delivery_modes_ready' ||
    status === 'ops_review' ||
    status === 'ops_approved' ||
    status === 'partner_active' ||
    status === 'client_visible' ||
    status === 'client_hidden'
  );

  const isDeliveryModesDone = (
    status === 'delivery_modes_ready' ||
    status === 'ops_review' ||
    status === 'ops_approved' ||
    status === 'partner_active' ||
    status === 'client_visible' ||
    status === 'client_hidden'
  );

  const isActiveDone = (
    status === 'partner_active' ||
    status === 'client_visible' ||
    status === 'client_hidden'
  );

  return [
    {
      id: 'documents',
      label: 'الوثائق معتمدة',
      satisfied: isDocumentsDone,
      blockedReason: isDocumentsDone ? undefined : 'الوثائق غير مكتملة أو لم يتم التحقق منها بعد',
    },
    {
      id: 'catalog',
      label: 'الكتالوج جاهز ومعتمد',
      satisfied: isCatalogDone,
      blockedReason: isCatalogDone ? undefined : 'الكتالوج فارغ أو غير معتمد للنشر',
    },
    {
      id: 'delivery_modes',
      label: 'أوضاع التوصيل مهيأة',
      satisfied: isDeliveryModesDone,
      blockedReason: isDeliveryModesDone ? undefined : 'يجب تحديد طريقة توصيل واحدة على الأقل',
    },
    {
      id: 'partner_active',
      label: 'الشريك نشط (اعتماد العمليات)',
      satisfied: isActiveDone,
      blockedReason: isActiveDone ? undefined : 'بانتظار اعتماد العمليات النهائي وتفعيل الشريك',
    },
  ] as const;
}

/**
 * Arabic label for a partner activation status.
 * Used in CP partner list, partner app status bar, and field screen summaries.
 */
export function getDshPartnerActivationStatusLabel(status: DshPartnerActivationStatus): string {
  switch (status) {
    case 'draft':                    return 'مسودة';
    case 'submitted':                return 'مُرسَل للمراجعة';
    case 'field_visit_scheduled':    return 'زيارة ميدانية مجدولة';
    case 'field_visit_completed':    return 'الزيارة مكتملة';
    case 'documents_missing':        return 'وثائق ناقصة';
    case 'documents_uploaded':       return 'وثائق مرفوعة';
    case 'documents_verified':       return 'وثائق معتمدة';
    case 'catalog_not_ready':        return 'الكتالوج غير جاهز';
    case 'catalog_ready':            return 'الكتالوج جاهز';
    case 'delivery_modes_not_ready': return 'أوضاع التوصيل غير مهيأة';
    case 'delivery_modes_ready':     return 'أوضاع التوصيل جاهزة';
    case 'ops_review':               return 'مراجعة العمليات';
    case 'ops_approved':             return 'معتمد من العمليات';
    case 'ops_rejected':             return 'مرفوض من العمليات';
    case 'partner_active':           return 'الشريك نشط';
    case 'partner_deactivated':      return 'الشريك موقوف';
    case 'client_visible':           return 'ظاهر للعملاء';
    case 'client_hidden':            return 'مخفي من العملاء';
  }
}
