/**
 * DSH Shared Flow Registry — Phase 1 Baseline
 * SESSION: DSH_PHASE_1_FLOW_REGISTRY-20260521-054141
 *
 * Single canonical source of truth for every DSH flow's:
 *   ownerSurface · visibleSurfaces · visibility · onDemandPolicy
 *   escalationOwner · financialImpact · hiddenCompat · allowedActions · forbiddenActions
 *
 * Rules:
 *  - Pure types + data only. No React, no side-effects, no backend, no mutation.
 *  - Import from '@bthwani/ui-kit' is FORBIDDEN here; this file has zero UI deps.
 *  - finance-preview flows: financialImpact=true, onDemandPolicy='finance-preview-only', NO mutation.
 *  - hidden-compat flows: hiddenCompat=true, visibility='hidden-compat' — must NOT be rendered primary.
 *  - Phase 1 scope: metadata only. No payload arrays, no heavy preview data.
 *
 * Cross-surface ownership contract:
 *  - app-client  : sees order/support only inside its own order context, never partner internals.
 *  - app-partner : owns order lifecycle, inventory, partner-ops. No client/captain internals.
 *  - app-captain : owns handoff/delivery flows. No partner internal issues beyond handoff.
 *  - app-field   : owns onboarding, visit, readiness. No financial policies or decisions.
 *  - control-panel: escalationOwner for all policy/SLA/support flows. No duplicate mobile screens.
 *  - wlt-finance : reference-only for any financial preview. No DSH-initiated mutation.
 */

// ---------------------------------------------------------------------------
// Core type definitions
// ---------------------------------------------------------------------------

export type DshSurfaceId =
  | 'app-client'
  | 'app-partner'
  | 'app-captain'
  | 'app-field'
  | 'control-panel'
  | 'wlt-finance';

export type DshFlowDomain =
  | 'order-lifecycle'
  | 'cart-checkout'
  | 'tracking'
  | 'delivery-mode'
  | 'partner-operations'
  | 'captain-operations'
  | 'field-onboarding'
  | 'catalog-inventory'
  | 'support-escalation'
  | 'chat-conversation'
  | 'cancellation-rejection'
  | 'finance-preview'
  | 'control-policy';

/**
 * primary        — primary nav / main action on ownerSurface.
 * contextual     — visible only when a related context (order, case) is open.
 * escalation-only— visible only in escalation/support queue flows.
 * hidden-compat  — legacy/alias; kept for backward compat; must NOT render as primary entry.
 * internal       — control-panel / ops-only; never shown in mobile surfaces.
 * disabled       — registered but not yet active in any surface.
 */
export type DshFlowVisibility =
  | 'primary'
  | 'contextual'
  | 'escalation-only'
  | 'hidden-compat'
  | 'internal'
  | 'disabled';

/**
 * On-demand contract: IDs/summaries first, heavy payloads only on explicit open.
 * summary-only       — identifier + label only; no detail loaded.
 * detail-on-open     — full detail loaded when user opens the flow.
 * evidence-on-open   — proof/attachments loaded only when evidence panel opens.
 * chat-on-open       — conversation thread loaded only when chat opens.
 * finance-preview-only — financial snapshot loaded read-only when finance panel opens.
 */
export type DshOnDemandPolicy =
  | 'summary-only'
  | 'detail-on-open'
  | 'evidence-on-open'
  | 'chat-on-open'
  | 'finance-preview-only';

export type DshFlowRegistryEntry = {
  /** Stable flow identifier — matches IDs in dsh-partner.types.ts and screen-registry files. */
  readonly id: string;
  /** Human-readable label (Arabic / mixed where applicable). */
  readonly label: string;
  /** Flow domain classification. */
  readonly domain: DshFlowDomain;
  /** Surface that owns and drives this flow. */
  readonly ownerSurface: DshSurfaceId;
  /** All surfaces where this flow is visible (at any mode). */
  readonly visibleSurfaces: readonly DshSurfaceId[];
  /** Visibility mode on ownerSurface. */
  readonly visibility: DshFlowVisibility;
  /** Route ID hint (matches route union in surface types file). */
  readonly routeId?: string;
  /** Screen/panel hint for navigation. */
  readonly screenHint?: string;
  /** Surface responsible for escalation decisions (typically control-panel). */
  readonly escalationOwner?: DshSurfaceId;
  /** True when this flow has a financial preview/settlement/commission implication. */
  readonly financialImpact?: boolean;
  /** On-demand loading contract for this flow's data. */
  readonly onDemandPolicy: DshOnDemandPolicy;
  /** True when kept only for legacy registry consumer backward compat. Must not render primary. */
  readonly hiddenCompat?: boolean;
  /** Actions permitted on this flow. */
  readonly allowedActions: readonly string[];
  /** Actions explicitly forbidden. */
  readonly forbiddenActions: readonly string[];
  /** Notes on compat status, deprecation, or cross-surface constraints. */
  readonly notes?: string;
};

// ---------------------------------------------------------------------------
// Registry — Partner Operational Flows
// DSH_PARTNER_OPERATIONAL_FLOW_IDS actual count: 27
// Note: registry also covers 2 legacy support-route aliases (auction-status-update,
// order-rejection) that exist in DSH_PARTNER_SUPPORT_ROUTE_IDS but NOT in
// DSH_PARTNER_OPERATIONAL_FLOW_IDS — they appear in PARTNER_HIDDEN_COMPAT_FLOWS.
// ---------------------------------------------------------------------------

const PARTNER_ORDER_LIFECYCLE: readonly DshFlowRegistryEntry[] = [
  {
    id: 'order-accept',
    label: 'قبول الطلب',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'order-accept',
    screenHint: 'PartnerSupportScreen > active-orders',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['قبول الطلب', 'مراجعة تفاصيل الطلب'],
    forbiddenActions: ['قبول طلب مكسور أو غير مكتمل', 'تعديل السعر'],
  },
  {
    id: 'order-get',
    label: 'استلام تفاصيل الطلب',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'primary',
    routeId: 'order-get',
    screenHint: 'OrdersInboxScreen',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['عرض تفاصيل الطلب'],
    forbiddenActions: ['تعديل بيانات الطلب الأصلية'],
  },
  {
    id: 'order-handoff',
    label: 'تسليم الطلب (Handoff)',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'app-captain', 'control-panel'],
    visibility: 'primary',
    routeId: 'order-handoff',
    screenHint: 'PartnerSupportScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['تثبيت handoff', 'تسليم الطلب للكابتن'],
    forbiddenActions: ['تأكيد handoff بدون وصول فعلي', 'تجاوز إثبات التسليم'],
  },
  {
    id: 'order-prepare',
    label: 'تحضير الطلب',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'order-prepare',
    screenHint: 'PartnerSupportScreen > active-orders',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['بدء التحضير', 'تحديث وقت التحضير', 'الإبلاغ عن عنصر ناقص'],
    forbiddenActions: ['إعلان الجاهزية مع بقاء النقص', 'تعديل السعر'],
  },
  {
    id: 'order-ready',
    label: 'الطلب جاهز للاستلام',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'app-captain', 'control-panel'],
    visibility: 'primary',
    routeId: 'order-ready',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['تثبيت الجاهزية', 'إشعار الكابتن'],
    forbiddenActions: ['إعلان جاهزية طلب ناقص'],
  },
  {
    id: 'order-out-for-delivery',
    label: 'الطلب في الطريق للتوصيل',
    domain: 'tracking',
    ownerSurface: 'app-captain',
    visibleSurfaces: ['app-partner', 'app-captain', 'app-client', 'control-panel'],
    visibility: 'contextual',
    routeId: 'order-out-for-delivery',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'summary-only',
    allowedActions: ['متابعة حالة التوصيل'],
    forbiddenActions: ['تعديل مسار التوصيل من الشريك'],
    notes: 'الملكية التشغيلية للكابتن؛ يظهر للشريك كحالة مرجعية فقط.',
  },
  {
    id: 'order-store-delivered',
    label: 'تأكيد التسليم في الفرع',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'order-store-delivered',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['تأكيد الاستلام', 'طلب إثبات تسليم'],
    forbiddenActions: ['إغلاق الطلب بدون إثبات عند الطلب'],
  },
  {
    id: 'order-reject',
    label: 'رفض الطلب',
    domain: 'cancellation-rejection',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'order-reject',
    screenHint: 'PartnerSupportScreen > active-orders',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['فتح مسار الرفض', 'تسجيل السبب', 'طلب مراجعة تشغيلية'],
    forbiddenActions: ['رفض بلا سبب', 'تحويل الرفض إلى تعويض مالي محلي'],
    notes: 'قرار استثنائي — يتطلب سببًا تشغيليًا صريحًا.',
  },
  {
    id: 'order-issue-queue',
    label: 'صف مشاكل الطلبات',
    domain: 'support-escalation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'order-issue-queue',
    screenHint: 'PartnerSupportScreen > order-issues',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['فتح حالة مشكلة', 'تحديث حالة الطلب', 'تصعيد للدعم'],
    forbiddenActions: ['إغلاق الحالة دون قرار', 'إنشاء تعويض محلي'],
  },
];

const PARTNER_HIDDEN_COMPAT_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'order-alerts',
    label: 'تنبيهات الطلب',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    onDemandPolicy: 'summary-only',
    allowedActions: ['الاحتفاظ بالتوافق للمستهلكين القدامى'],
    forbiddenActions: ['عرضه كخيار أساسي', 'إنشاء navigation route مستقل'],
    notes: 'مضمّن في command center؛ لا يظهر كمسار مستقل.',
  },
  {
    id: 'order-sla-risk',
    label: 'خطر SLA',
    domain: 'support-escalation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    escalationOwner: 'control-panel',
    onDemandPolicy: 'summary-only',
    allowedActions: ['تمييز الحالة كخطر SLA', 'الاحتفاظ بالتوافق'],
    forbiddenActions: ['عرضه كمدخل أساسي منفصل'],
    notes: 'مضمّن داخل حالات command center؛ التصعيد يذهب لـ control-panel.',
  },
  {
    id: 'order-issue-required',
    label: 'تقرير مشكلة إلزامي',
    domain: 'support-escalation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['الاحتفاظ بالتوافق'],
    forbiddenActions: ['إظهاره كخيار ابتدائي'],
    notes: 'استخدم order-issue-queue بدلًا منه للتدفقات الجديدة.',
  },
  {
    id: 'auction-status-update',
    label: 'Auction Status Update (Legacy)',
    domain: 'order-lifecycle',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    onDemandPolicy: 'summary-only',
    allowedActions: ['الاحتفاظ بالتوافق للمستهلكين القدامى'],
    forbiddenActions: ['إظهاره كخيار أساسي', 'إنشاء route مستقل جديد'],
    notes: 'Legacy registry consumer only. See operations-support.preview.ts for detail.',
  },
  {
    id: 'order-rejection',
    label: 'Order Rejection (Legacy Route)',
    domain: 'cancellation-rejection',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    onDemandPolicy: 'summary-only',
    allowedActions: ['الاحتفاظ بالتوافق'],
    forbiddenActions: ['عرضه كصفحة أساسية منفصلة'],
    notes: 'Legacy alias. استخدم order-reject (flow) أو partner-reject-request (support) بدلًا منه.',
  },
];

const PARTNER_CHAT_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'order-chat-send',
    label: 'إرسال رسالة في المحادثة',
    domain: 'chat-conversation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'app-client', 'app-captain'],
    visibility: 'contextual',
    routeId: 'chat-send',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'chat-on-open',
    allowedActions: ['إرسال رسالة نصية', 'إرفاق صورة'],
    forbiddenActions: ['إرسال بيانات مالية أو تعويض عبر المحادثة'],
  },
  {
    id: 'order-chat-read-ack',
    label: 'تأكيد قراءة المحادثة',
    domain: 'chat-conversation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'contextual',
    routeId: 'chat-read-ack',
    onDemandPolicy: 'chat-on-open',
    allowedActions: ['تأكيد القراءة'],
    forbiddenActions: ['إرسال أي بيانات إضافية'],
  },
  {
    id: 'order-quick-reply-config',
    label: 'إعداد الردود السريعة',
    domain: 'chat-conversation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'contextual',
    routeId: 'quick-reply-config',
    screenHint: 'OperationScreens > ConversationScreen',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['إعداد الردود السريعة', 'تحرير القالب'],
    forbiddenActions: ['تضمين بيانات ثقيلة في state دائمًا'],
  },
  {
    id: 'order-quick-reply-settings',
    label: 'إعدادات الردود السريعة',
    domain: 'chat-conversation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'contextual',
    routeId: 'quick-reply-settings',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['تعديل الإعدادات'],
    forbiddenActions: ['تحميل جميع القوالب دائمًا دون فتح'],
  },
  {
    id: 'order-quick-reply-setup',
    label: 'إعداد أولي للردود السريعة',
    domain: 'chat-conversation',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner'],
    visibility: 'contextual',
    routeId: 'quick-reply-setup',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['إعداد أولي للقوالب'],
    forbiddenActions: ['تحميل كل القوالب مسبقًا'],
  },
];

const PARTNER_INVENTORY_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'inventory-adjust',
    label: 'تعديل المخزون',
    domain: 'catalog-inventory',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'app-field', 'control-panel'],
    visibility: 'primary',
    routeId: 'inventory-adjust',
    screenHint: 'InventoryCatalogScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['تعديل الكميات', 'إيقاف مؤقت لعنصر', 'اقتراح بديل'],
    forbiddenActions: ['تعديل أسعار نهائية دون صلاحية', 'نشر منتج غير متحقق'],
  },
  {
    id: 'inventory-update',
    label: 'تحديث المخزون',
    domain: 'catalog-inventory',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'inventory-update',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['تحديث بيانات المخزون'],
    forbiddenActions: ['نشر بيانات غير متحققة'],
  },
  {
    id: 'items-upsert',
    label: 'إضافة / تحديث عنصر',
    domain: 'catalog-inventory',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'items-upsert',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['إضافة عنصر', 'تحديث بيانات العنصر'],
    forbiddenActions: ['نشر عنصر بدون مراجعة الكتالوج'],
  },
];

const PARTNER_ONBOARDING_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'doc-upload',
    label: 'رفع وثيقة',
    domain: 'partner-operations',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'doc-upload',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['رفع وثيقة', 'إرفاق مرجع'],
    forbiddenActions: ['تضمين ملفات ثقيلة في state دائمًا'],
  },
  {
    id: 'intake-start',
    label: 'بدء الإدخال',
    domain: 'partner-operations',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'intake-start',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['بدء ملف الإدخال', 'حفظ مسودة'],
    forbiddenActions: ['التفعيل النهائي دون مراجعة'],
  },
  {
    id: 'store-nomination',
    label: 'ترشيح متجر',
    domain: 'partner-operations',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'app-field', 'control-panel'],
    visibility: 'primary',
    routeId: 'store-nomination',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['رفع بيانات الترشيح', 'تحويل للمراجعة'],
    forbiddenActions: ['إسناد أثر مالي محلي', 'تفعيل دون مراجعة'],
  },
  {
    id: 'video-upload',
    label: 'رفع مقطع فيديو',
    domain: 'partner-operations',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'control-panel'],
    visibility: 'primary',
    routeId: 'video-upload',
    screenHint: 'OperationScreens > VideoUploadScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['رفع مقطع', 'مراجعة قبل الإرسال'],
    forbiddenActions: ['تضمين ملف الفيديو في state دائمًا'],
  },
];

// ---------------------------------------------------------------------------
// Registry — Finance Preview Flows (WLT bridge, hidden-compat on partner)
// ---------------------------------------------------------------------------

const FINANCE_PREVIEW_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'partner-finance-bridge',
    label: 'جسر المعلومات المالية للشريك',
    domain: 'finance-preview',
    ownerSurface: 'wlt-finance',
    visibleSurfaces: ['app-partner', 'control-panel', 'wlt-finance'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    financialImpact: true,
    escalationOwner: 'control-panel',
    onDemandPolicy: 'finance-preview-only',
    allowedActions: ['عرض ملخص مالي للقراءة فقط'],
    forbiddenActions: ['بدء استرداد', 'تعديل تسوية', 'تغيير عمولة أو ledger', 'mutation مالي من DSH'],
    notes: 'WLT هو المالك الوحيد لأي أثر مالي. يظهر للشريك كـ preview tag فقط.',
  },
  {
    id: 'partner-settlement-summary',
    label: 'ملخص التسوية',
    domain: 'finance-preview',
    ownerSurface: 'wlt-finance',
    visibleSurfaces: ['app-partner', 'control-panel', 'wlt-finance'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    financialImpact: true,
    escalationOwner: 'control-panel',
    onDemandPolicy: 'finance-preview-only',
    allowedActions: ['عرض ملخص التسوية للقراءة فقط'],
    forbiddenActions: ['تعديل التسوية', 'إنشاء استرداد', 'mutation مالي من DSH'],
    notes: 'يبقى preview-only. أي mutation يذهب لـ WLT فقط.',
  },
  {
    id: 'partner-commission-summary',
    label: 'ملخص العمولة',
    domain: 'finance-preview',
    ownerSurface: 'wlt-finance',
    visibleSurfaces: ['app-partner', 'control-panel', 'wlt-finance'],
    visibility: 'hidden-compat',
    hiddenCompat: true,
    financialImpact: true,
    escalationOwner: 'control-panel',
    onDemandPolicy: 'finance-preview-only',
    allowedActions: ['عرض ملخص العمولة للقراءة فقط'],
    forbiddenActions: ['تعديل العمولة', 'تغيير ledger', 'mutation مالي من DSH'],
    notes: 'يبقى preview-only. أي mutation يذهب لـ WLT فقط.',
  },
];

// ---------------------------------------------------------------------------
// Registry — Client Flows (summary-level; full registry in Phase 2+)
// ---------------------------------------------------------------------------

const CLIENT_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'client-order-tracking',
    label: 'تتبع الطلب',
    domain: 'tracking',
    ownerSurface: 'app-client',
    visibleSurfaces: ['app-client'],
    visibility: 'primary',
    routeId: 'tracking',
    screenHint: 'OrdersTrackingScreens',
    onDemandPolicy: 'summary-only',
    allowedActions: ['عرض حالة الطلب', 'تتبع الموقع'],
    forbiddenActions: ['تعديل بيانات الطلب', 'رؤية منطق الشريك الداخلي'],
    notes: 'TBD: تفاصيل إضافية في Phase 2.',
  },
  {
    id: 'client-cart-checkout',
    label: 'عربة التسوق / الدفع',
    domain: 'cart-checkout',
    ownerSurface: 'app-client',
    visibleSurfaces: ['app-client'],
    visibility: 'primary',
    routeId: 'cart',
    screenHint: 'CartScreen',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['إضافة للعربة', 'إتمام الطلب'],
    forbiddenActions: ['تعديل أسعار المتجر', 'رؤية بيانات الكابتن'],
    notes: 'TBD: on-demand audit في Phase 2 (66 duplications في Phase 0).',
  },
  {
    id: 'client-order-issue',
    label: 'الإبلاغ عن مشكلة في الطلب',
    domain: 'support-escalation',
    ownerSurface: 'app-client',
    visibleSurfaces: ['app-client', 'control-panel'],
    visibility: 'contextual',
    routeId: 'order-issue-workspace',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['الإبلاغ عن مشكلة', 'طلب المساعدة'],
    forbiddenActions: ['رؤية منطق الشريك الداخلي', 'بدء استرداد مباشر'],
  },
];

// ---------------------------------------------------------------------------
// Registry — Captain Flows (summary-level; full registry in Phase 2+)
// ---------------------------------------------------------------------------

const CAPTAIN_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'captain-order-pickup',
    label: 'استلام الطلب (Pickup)',
    domain: 'captain-operations',
    ownerSurface: 'app-captain',
    visibleSurfaces: ['app-captain', 'control-panel'],
    visibility: 'primary',
    routeId: 'pickup-dropoff',
    screenHint: 'DshCaptainPickupDropoffScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['تأكيد الوصول للفرع', 'طلب handoff', 'تصعيد التأخير'],
    forbiddenActions: ['تأكيد الاستلام قبل الوصول', 'رؤية مشاكل الشريك الداخلية'],
    notes: 'TBD: تفاصيل إضافية في Phase 2.',
  },
  {
    id: 'captain-proof-of-delivery',
    label: 'إثبات التسليم',
    domain: 'captain-operations',
    ownerSurface: 'app-captain',
    visibleSurfaces: ['app-captain', 'control-panel'],
    visibility: 'primary',
    routeId: 'pod-submission',
    screenHint: 'DshCaptainPoDSubmissionScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['رفع إثبات التسليم', 'طلب إعادة محاولة'],
    forbiddenActions: ['إغلاق التسليم بدون إثبات عند الطلب', 'تضمين صور ثقيلة دائمًا'],
  },
  {
    id: 'captain-map-navigation',
    label: 'خريطة التوصيل',
    domain: 'tracking',
    ownerSurface: 'app-captain',
    visibleSurfaces: ['app-captain'],
    visibility: 'primary',
    routeId: 'map',
    screenHint: 'DshCaptainMapScreen',
    onDemandPolicy: 'summary-only',
    allowedActions: ['متابعة المسار', 'تحديث الموقع'],
    forbiddenActions: ['تضمين payload ثقيل في state دائمًا'],
    notes: 'TBD: on-demand audit في Phase 2.',
  },
];

// ---------------------------------------------------------------------------
// Registry — Field Flows (summary-level; full registry in Phase 2+)
// ---------------------------------------------------------------------------

const FIELD_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'field-store-onboarding',
    label: 'تأهيل متجر جديد',
    domain: 'field-onboarding',
    ownerSurface: 'app-field',
    visibleSurfaces: ['app-field', 'control-panel'],
    visibility: 'primary',
    routeId: 'onboarding',
    screenHint: 'DshFieldStoreOnboardingScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['استكمال ملف التأهيل', 'رفع الوثائق', 'تحويل للمراجعة'],
    forbiddenActions: ['التفعيل النهائي دون مراجعة', 'ربط settlement محلي'],
    notes: 'TBD: تفاصيل إضافية في Phase 2.',
  },
  {
    id: 'field-store-visit',
    label: 'زيارة الفرع',
    domain: 'field-onboarding',
    ownerSurface: 'app-field',
    visibleSurfaces: ['app-field', 'control-panel'],
    visibility: 'primary',
    routeId: 'visit',
    screenHint: 'DshFieldStoreVisitScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['تسجيل الزيارة', 'إرفاق دليل ميداني'],
    forbiddenActions: ['إغلاق الحالة بلا دليل عند طلبه', 'تحميل صور ثقيلة دائمًا'],
  },
  {
    id: 'field-readiness-escalation',
    label: 'تصعيد جاهزية الفرع',
    domain: 'support-escalation',
    ownerSurface: 'app-field',
    visibleSurfaces: ['app-field', 'control-panel'],
    visibility: 'primary',
    routeId: 'readiness-escalation',
    screenHint: 'DshFieldReadinessEscalationScreen',
    escalationOwner: 'control-panel',
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['رفع بلاغ جاهزية', 'تجميع النواقص', 'تحويل للوحة التحكم'],
    forbiddenActions: ['تفعيل الفرع رغم النواقص', 'ربط settlement محلي'],
  },
];

// ---------------------------------------------------------------------------
// Registry — Control-Panel Flows (summary-level ownership anchors)
// ---------------------------------------------------------------------------

const CONTROL_PANEL_FLOWS: readonly DshFlowRegistryEntry[] = [
  {
    id: 'control-sla-policy',
    label: 'سياسة SLA',
    domain: 'control-policy',
    ownerSurface: 'control-panel',
    visibleSurfaces: ['control-panel'],
    visibility: 'internal',
    screenHint: 'operations/AuditSupportSlaScreen',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['مراجعة السياسة', 'تعديل حدود SLA'],
    forbiddenActions: ['تكرار شاشات الموبايل', 'mutation مالي مباشر'],
    notes: 'control-panel هو المالك الوحيد لسياسات SLA والتصعيد.',
  },
  {
    id: 'control-escalation-queue',
    label: 'صف التصعيد',
    domain: 'support-escalation',
    ownerSurface: 'control-panel',
    visibleSurfaces: ['control-panel'],
    visibility: 'primary',
    screenHint: 'operations/ExceptionsEscalationsScreen',
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['مراجعة الحالات المصعّدة', 'اتخاذ قرار السياسة'],
    forbiddenActions: ['تكرار شاشات الموبايل', 'mutation مالي بدون WLT'],
  },
];

// ---------------------------------------------------------------------------
// Master registry — combine all domains
// ---------------------------------------------------------------------------

export const DSH_FLOW_REGISTRY: readonly DshFlowRegistryEntry[] = [
  ...PARTNER_ORDER_LIFECYCLE,
  ...PARTNER_HIDDEN_COMPAT_FLOWS,
  ...PARTNER_CHAT_FLOWS,
  ...PARTNER_INVENTORY_FLOWS,
  ...PARTNER_ONBOARDING_FLOWS,
  ...FINANCE_PREVIEW_FLOWS,
  ...CLIENT_FLOWS,
  ...CAPTAIN_FLOWS,
  ...FIELD_FLOWS,
  ...CONTROL_PANEL_FLOWS,
] as const;

// ---------------------------------------------------------------------------
// Utility functions — no side effects
// ---------------------------------------------------------------------------

/** Lookup a registry entry by its stable flow ID. */
export function getDshFlowById(id: string): DshFlowRegistryEntry | undefined {
  return DSH_FLOW_REGISTRY.find((entry) => entry.id === id);
}

/**
 * All registry entries that are visible on a given surface
 * (owns, or listed in visibleSurfaces — including hidden-compat).
 */
export function getDshFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[] {
  return DSH_FLOW_REGISTRY.filter(
    (entry) =>
      entry.ownerSurface === surfaceId || entry.visibleSurfaces.includes(surfaceId)
  );
}

/**
 * Entries that should render visibly on a surface (excludes hidden-compat, internal, disabled).
 * Use this to drive navigation and visible flow lists.
 */
export function getDshVisibleFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[] {
  return getDshFlowsForSurface(surfaceId).filter(
    (entry) =>
      entry.visibility !== 'hidden-compat' &&
      entry.visibility !== 'internal' &&
      entry.visibility !== 'disabled'
  );
}

/**
 * Entries that can render in a visible workspace for a surface.
 * Excludes hidden-compat and disabled everywhere, and excludes internal
 * outside control-panel. Pure read-only filter — no side effects, no throws.
 */
export function getDshRenderableFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[] {
  return getDshFlowsForSurface(surfaceId).filter((entry) => {
    if (entry.visibility === 'hidden-compat' || entry.visibility === 'disabled') {
      return false;
    }

    if (entry.visibility === 'internal' && surfaceId !== 'control-panel') {
      return false;
    }

    return true;
  });
}

/**
 * All primary-visibility flows owned by the given surface.
 * Excludes contextual, hidden-compat, internal, and disabled entries.
 * Pure read-only filter — no side effects, no throws.
 */
export function getDshPrimaryFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[] {
  return DSH_FLOW_REGISTRY.filter(
    (entry) => entry.ownerSurface === surfaceId && entry.visibility === 'primary',
  );
}

/**
 * All contextual-visibility flows visible on the given surface.
 * Includes contextual entries from any ownerSurface, filtered to those
 * that declare the requested surface in their visibleSurfaces list.
 * Pure read-only filter — no side effects, no throws.
 */
export function getDshContextualFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[] {
  return DSH_FLOW_REGISTRY.filter(
    (entry) => entry.visibleSurfaces.includes(surfaceId) && entry.visibility === 'contextual',
  );
}

/** True when a flow ID is a legacy/hidden-compat entry that must NOT render primary. */
export function isDshHiddenCompatFlow(id: string): boolean {
  const entry = getDshFlowById(id);
  return entry?.hiddenCompat === true;
}

/**
 * All flows that require escalation handling (have an escalationOwner defined).
 * Useful for control-panel escalation queue wiring.
 */
export function getDshEscalationFlows(): readonly DshFlowRegistryEntry[] {
  return DSH_FLOW_REGISTRY.filter((entry) => entry.escalationOwner !== undefined);
}

/**
 * Escalation-aware flows relevant to a given surface.
 * Includes flows owned by the surface, visible on the surface, or escalated to it.
 * Pure read-only filter — no side effects, no throws.
 */
export function getDshEscalationFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[] {
  return getDshEscalationFlows().filter(
    (entry) =>
      entry.ownerSurface === surfaceId ||
      entry.visibleSurfaces.includes(surfaceId) ||
      entry.escalationOwner === surfaceId,
  );
}

/**
 * All flows with financialImpact=true.
 * These must remain finance-preview-only — no mutation from DSH.
 */
export function getDshFinancePreviewFlows(): readonly DshFlowRegistryEntry[] {
  return DSH_FLOW_REGISTRY.filter((entry) => entry.financialImpact === true);
}

export type DshFlowPolicySummary = {
  readonly flowId: string;
  readonly ownerSurface: DshSurfaceId;
  readonly visibleSurfaces: readonly DshSurfaceId[];
  readonly domain: DshFlowDomain;
  readonly visibility: DshFlowVisibility;
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly escalationOwner?: DshSurfaceId;
  readonly financialImpact: boolean;
  readonly hiddenCompat: boolean;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly nextPolicyActionPreview: string;
};

function resolveNextPolicyActionPreview(onDemandPolicy: DshOnDemandPolicy): string {
  if (onDemandPolicy === 'summary-only') {
    return 'اعرض الملخص أولاً، وافتح التفاصيل فقط عند طلب المستخدم.';
  }

  if (onDemandPolicy === 'detail-on-open') {
    return 'افتح التفاصيل عند اختيار هذا المسار، ولا تحملها مسبقًا.';
  }

  if (onDemandPolicy === 'evidence-on-open') {
    return 'افتح الأدلة أو الصور فقط من داخل السياق وعند الطلب.';
  }

  if (onDemandPolicy === 'chat-on-open') {
    return 'افتح المحادثة فقط عند اختيار فتح الدردشة من داخل الطلب.';
  }

  return 'اعرض المعاينة المالية للقراءة فقط من دون أي تنفيذ أو تعديل.';
}

/**
 * Compact read-only policy snapshot for a single flow.
 * Safe for render paths; no throws and no heavy payloads.
 */
export function getDshFlowPolicySummary(flowId: string): DshFlowPolicySummary | undefined {
  const entry = getDshFlowById(flowId);
  if (!entry) {
    return undefined;
  }

  return {
    flowId: entry.id,
    ownerSurface: entry.ownerSurface,
    visibleSurfaces: entry.visibleSurfaces,
    domain: entry.domain,
    visibility: entry.visibility,
    onDemandPolicy: entry.onDemandPolicy,
    escalationOwner: entry.escalationOwner,
    financialImpact: entry.financialImpact === true,
    hiddenCompat: entry.hiddenCompat === true,
    allowedActions: entry.allowedActions,
    forbiddenActions: entry.forbiddenActions,
    nextPolicyActionPreview: resolveNextPolicyActionPreview(entry.onDemandPolicy),
  };
}

// ---------------------------------------------------------------------------
// Registry validation — read-only; no side effects, no mutations
// ---------------------------------------------------------------------------

export type DshFlowRegistryStats = {
  /** Total number of registry entries. */
  readonly totalEntries: number;
  /** Entries with visibility='primary'. */
  readonly primaryCount: number;
  /** Entries with visibility='contextual'. */
  readonly contextualCount: number;
  /** Entries with hiddenCompat=true. */
  readonly hiddenCompatCount: number;
  /** Entries with visibility='internal'. */
  readonly internalCount: number;
  /** Entries with financialImpact=true (finance-preview-only). */
  readonly financePreviewCount: number;
  /** Entries with an escalationOwner set. */
  readonly escalationOwnerCount: number;
  /** Entries owned by app-partner (ownerSurface). */
  readonly partnerOwnedCount: number;
};

/**
 * Returns a read-only snapshot of registry aggregate counts.
 * Safe to call at any time; no mutations, no side effects.
 */
export function getDshFlowRegistryStats(): DshFlowRegistryStats {
  return {
    totalEntries: DSH_FLOW_REGISTRY.length,
    primaryCount: DSH_FLOW_REGISTRY.filter((e) => e.visibility === 'primary').length,
    contextualCount: DSH_FLOW_REGISTRY.filter((e) => e.visibility === 'contextual').length,
    hiddenCompatCount: DSH_FLOW_REGISTRY.filter((e) => e.hiddenCompat === true).length,
    internalCount: DSH_FLOW_REGISTRY.filter((e) => e.visibility === 'internal').length,
    financePreviewCount: DSH_FLOW_REGISTRY.filter((e) => e.financialImpact === true).length,
    escalationOwnerCount: DSH_FLOW_REGISTRY.filter((e) => e.escalationOwner !== undefined).length,
    partnerOwnedCount: DSH_FLOW_REGISTRY.filter((e) => e.ownerSurface === 'app-partner').length,
  };
}

export type DshFlowRegistryValidationResult = {
  /** True when all entries pass all validation rules. */
  readonly isValid: boolean;
  /** Total entries inspected. */
  readonly totalEntries: number;
  /** IDs that appear more than once (must be empty for a valid registry). */
  readonly duplicateIds: readonly string[];
  /** Entry IDs missing one or more required fields. */
  readonly missingRequiredFields: readonly string[];
  /**
   * Finance-preview violations: financialImpact=true entries that don't have
   * onDemandPolicy='finance-preview-only'.
   */
  readonly financePreviewViolations: readonly string[];
  /**
   * Hidden-compat violations: hiddenCompat=true entries that don't have
   * visibility='hidden-compat'.
   */
  readonly hiddenCompatViolations: readonly string[];
};

/**
 * Validates the registry against its structural invariants.
 * Returns a read-only result object; never throws.
 * Use in tests or tooling — not in production render paths.
 */
export function getDshFlowRegistryValidationSummary(): DshFlowRegistryValidationResult {
  const seenIds = new Set<string>();
  const duplicateIds: string[] = [];
  for (const entry of DSH_FLOW_REGISTRY) {
    if (seenIds.has(entry.id)) {
      duplicateIds.push(entry.id);
    }
    seenIds.add(entry.id);
  }

  const missingRequiredFields: string[] = [];
  for (const entry of DSH_FLOW_REGISTRY) {
    const hasRequired =
      entry.id &&
      entry.label &&
      entry.domain &&
      entry.ownerSurface &&
      entry.visibleSurfaces &&
      entry.visibleSurfaces.length > 0 &&
      entry.visibility &&
      entry.onDemandPolicy &&
      entry.allowedActions &&
      entry.forbiddenActions;
    if (!hasRequired) {
      missingRequiredFields.push(entry.id ?? '(unknown-id)');
    }
  }

  const financePreviewViolations: string[] = [];
  for (const entry of DSH_FLOW_REGISTRY) {
    if (entry.financialImpact === true && entry.onDemandPolicy !== 'finance-preview-only') {
      financePreviewViolations.push(
        `${entry.id}: financialImpact=true but onDemandPolicy=${entry.onDemandPolicy} (expected finance-preview-only)`
      );
    }
  }

  const hiddenCompatViolations: string[] = [];
  for (const entry of DSH_FLOW_REGISTRY) {
    if (entry.hiddenCompat === true && entry.visibility !== 'hidden-compat') {
      hiddenCompatViolations.push(
        `${entry.id}: hiddenCompat=true but visibility=${entry.visibility} (expected hidden-compat)`
      );
    }
  }

  return {
    isValid:
      duplicateIds.length === 0 &&
      missingRequiredFields.length === 0 &&
      financePreviewViolations.length === 0 &&
      hiddenCompatViolations.length === 0,
    totalEntries: DSH_FLOW_REGISTRY.length,
    duplicateIds,
    missingRequiredFields,
    financePreviewViolations,
    hiddenCompatViolations,
  };
}
