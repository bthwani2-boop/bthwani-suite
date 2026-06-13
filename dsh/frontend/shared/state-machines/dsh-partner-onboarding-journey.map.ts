/**
 * DSH Partner Onboarding Journey Map — Cross-Surface Canonical Reference
 * SESSION: DSH_TOPIC_1_PARTNER_ONBOARDING_CLOSURE-20260521-182600
 *
 * Single source of truth for the partner onboarding journey:
 *   app-field → control-panel/partners → control-panel/catalogs → app-partner → app-client
 *
 * Rules:
 *  - Pure types + data only. No React, no side-effects, no backend, no mutation.
 *  - Import from '@bthwani/ui-kit' is FORBIDDEN here.
 *  - financialImpact steps are reference/preview only; WLT is the ledger owner.
 *  - app-field: collects data only; no final activation.
 *  - control-panel/partners: owns lifecycle approval.
 *  - control-panel/catalogs: owns catalog/product publishing gate.
 *  - app-partner: sees status and requirements; no self-approval.
 *  - app-client: sees only active + published + approved entities.
 *
 * Cross-surface ownership boundary:
 *  - app-field    : field-data-collection, document-verification (collection only)
 *  - cp/partners  : partner-lifecycle-review, document-review-decision, activation
 *  - cp/catalogs  : catalog-onboarding, item-approval, publishing-gate
 *  - app-partner  : partner-status-visibility (read-only readiness), local inventory edits
 *  - app-client   : client-store-visibility (approved + published only)
 *  - wlt-finance  : settlement/commission reference (never mutated from DSH)
 */

import type { DshOnDemandPolicy, DshSurfaceId } from './dsh-flow-registry';

// ---------------------------------------------------------------------------
// Core type definitions
// ---------------------------------------------------------------------------

export type DshPartnerJourneyStepId =
  | 'field-data-collection'
  | 'document-verification'
  | 'partner-lifecycle-review'
  | 'catalog-onboarding'
  | 'partner-status-visibility'
  | 'client-store-visibility';

/**
 * Partner lifecycle stage that maps to ApprovalStage in workflow.ts.
 * Used for cross-surface readiness signaling without duplicating logic.
 */
export type DshPartnerLifecycleStage =
  | 'field-submitted'       // app-field submitted; awaiting partner review
  | 'partner-review'        // control-panel/partners reviewing intake
  | 'documents-review'      // control-panel/partners reviewing documents
  | 'partner-approved'      // partners approved; moving to catalog
  | 'catalog-onboarding'    // control-panel/catalogs reviewing products
  | 'marketing-review'      // control-panel/marketing reviewing content before launch
  | 'active'                // fully approved, catalog published, client-visible
  | 'blocked'               // blocked pending resolution
  | 'needs-fix'             // returned for correction
  | 'rejected';             // permanently rejected

export type DshPartnerJourneyControlPanelSection =
  | 'partners'
  | 'catalogs'
  | 'marketing'
  | 'finance'
  | 'platform';

export type DshPartnerJourneyStep = {
  /** Stable journey step ID. */
  readonly stepId: DshPartnerJourneyStepId;
  /** Human-readable label. */
  readonly title: string;
  /** Short description of what happens in this step. */
  readonly description: string;
  /** Surface that owns/drives this step. */
  readonly ownerSurface: DshSurfaceId;
  /** Control panel section responsible (if control-panel is owner or escalation target). */
  readonly controlPanelOwnerSection?: DshPartnerJourneyControlPanelSection;
  /** Surfaces that can observe this step (read-only). */
  readonly visibleToSurfaces: readonly DshSurfaceId[];
  /** Related flow IDs from dsh-flow-registry. */
  readonly relatedFlowIds: readonly string[];
  /** What data/evidence enters this step. */
  readonly inputSummary: string;
  /** What this step produces for the next step. */
  readonly outputSummary: string;
  /** Evidence required at this step (IDs or labels). */
  readonly requiredEvidence: readonly string[];
  /** On-demand loading policy for step data. */
  readonly onDemandPolicy: DshOnDemandPolicy;
  /** Actions permitted in this step. */
  readonly allowedActions: readonly string[];
  /** Actions explicitly forbidden in this step. */
  readonly forbiddenActions: readonly string[];
  /** IDs of steps that can follow this one. */
  readonly nextStepIds: readonly DshPartnerJourneyStepId[];
  /** Condition under which app-client shows partner entities produced by this step. */
  readonly clientVisibleWhen?: string;
  /** Condition under which app-partner sees status/readiness from this step. */
  readonly partnerVisibleWhen?: string;
  /** Whether this step has financial impact (WLT reference only, no mutation). */
  readonly financialImpact?: boolean;
  /** Notes on constraints, open items, or deferred items. */
  readonly notes?: string;
};

// ---------------------------------------------------------------------------
// Journey Steps
// ---------------------------------------------------------------------------

export const DSH_PARTNER_ONBOARDING_JOURNEY: readonly DshPartnerJourneyStep[] = [
  {
    stepId: 'field-data-collection',
    title: 'جمع بيانات الشريك والفرع (ميداني)',
    description: 'المندوب الميداني يجمع بيانات المتجر والفرع والزيارة والأدلة ويرفعها للمراجعة.',
    ownerSurface: 'app-field',
    controlPanelOwnerSection: 'partners',
    visibleToSurfaces: ['app-field', 'control-panel'],
    relatedFlowIds: [
      'field-store-onboarding',
      'field-store-visit',
      'store-nomination',
    ],
    inputSummary: 'بيانات المتجر، صور الفرع، معلومات المالك، ساعات العمل',
    outputSummary: 'ملف تأهيل مكتمل جاهز للمراجعة في control-panel/partners',
    requiredEvidence: ['صورة الواجهة', 'تأكيد بيانات المالك', 'ملف التأهيل'],
    onDemandPolicy: 'detail-on-open',
    allowedActions: [
      'استكمال ملف التأهيل',
      'رفع الوثائق الأولية',
      'تسجيل الزيارة الميدانية',
      'تحويل للمراجعة',
    ],
    forbiddenActions: [
      'التفعيل النهائي للشريك',
      'نشر منتجات للعميل',
      'تقرير اعتماد الشريك',
      'ربط settlement محلي',
    ],
    nextStepIds: ['document-verification'],
    partnerVisibleWhen: 'field-submitted — الشريك يرى أن ملفه قيد المراجعة الأولية',
    notes: 'app-field يجمع ويحول فقط. القرار النهائي محظور محلياً.',
  },
  {
    stepId: 'document-verification',
    title: 'مراجعة وثائق الشريك',
    description: 'المندوب يرفع الوثائق ويتحقق منها محلياً. القرار على الوثائق يصدر من control-panel/partners.',
    ownerSurface: 'app-field',
    controlPanelOwnerSection: 'partners',
    visibleToSurfaces: ['app-field', 'control-panel'],
    relatedFlowIds: [
      'doc-upload',
      'field-store-onboarding',
    ],
    inputSummary: 'وثائق الهوية، سجل التجاري، عقد الإيجار، شهادة الصحة (حسب الفئة)',
    outputSummary: 'حزمة وثائق كاملة للاعتماد من control-panel/partners',
    requiredEvidence: [
      'نسخة الهوية الوطنية',
      'السجل التجاري',
      'عقد الإيجار أو الملكية',
      'شهادة صحة أو ترخيص (إن انطبق)',
    ],
    onDemandPolicy: 'evidence-on-open',
    allowedActions: [
      'رفع الوثائق',
      'مراجعة اكتمال الحزمة محلياً',
      'إرفاق مرجع للوثيقة',
      'تحديد الوثائق الناقصة',
    ],
    forbiddenActions: [
      'اعتماد الوثائق نهائياً من app-field',
      'تجاوز مرحلة مراجعة الوثائق',
      'تحميل الوثائق الكاملة دائماً في state',
    ],
    nextStepIds: ['partner-lifecycle-review'],
    partnerVisibleWhen: 'documents-review — الشريك يرى الوثائق المطلوبة وما تم رفعه',
    notes: 'app-field يجمع الأدلة على طلب فقط (evidence-on-open). القرار النهائي لـ control-panel/partners.',
  },
  {
    stepId: 'partner-lifecycle-review',
    title: 'مراجعة دورة حياة الشريك (شركاء)',
    description: 'قسم الشركاء في لوحة التحكم يملك الاعتماد النهائي لدورة حياة الشريك: intake، وثائق، جاهزية، topology، تفعيل.',
    ownerSurface: 'control-panel',
    controlPanelOwnerSection: 'partners',
    visibleToSurfaces: ['control-panel'],
    relatedFlowIds: [
      'intake-start',
      'doc-upload',
      'store-nomination',
      'field-store-onboarding',
      'field-readiness-escalation',
    ],
    inputSummary: 'ملف التأهيل من app-field + وثائق مكتملة',
    outputSummary: 'شريك معتمد بكود شريك صالح وجاهزية تشغيلية مؤكدة → ينتقل لـ catalog-onboarding',
    requiredEvidence: ['حزمة الوثائق الكاملة', 'ملف التأهيل', 'تقرير الجاهزية'],
    onDemandPolicy: 'detail-on-open',
    allowedActions: [
      'مراجعة ملف التأهيل',
      'اعتماد أو رفض الوثائق',
      'طلب إعادة تقديم الوثائق',
      'مراجعة الجاهزية التشغيلية',
      'مراجعة topology الخدمة',
      'تفعيل الشريك النهائي بعد اكتمال جميع الخطوات',
      'إلغاء تفعيل الشريك',
    ],
    forbiddenActions: [
      'نشر منتجات للعميل مباشرة',
      'تكرار منطق catalog publishing',
      'تكرار منطق marketing eligibility',
      'تكرار منطق finance settlement',
      'التفعيل بدون اكتمال الوثائق',
    ],
    nextStepIds: ['catalog-onboarding'],
    partnerVisibleWhen: 'partner-review / partner-approved — الشريك يرى أن ملفه قيد المراجعة',
    notes: 'حالات دورة الحياة: pending-intake → documents-review → readiness-review → topology-review → approved/active/blocked',
  },
  {
    stepId: 'catalog-onboarding',
    title: 'تأهيل الكتالوج والمنتجات (كتالوج)',
    description: 'قسم الكتالوج يملك اعتماد المنتجات والباركود والنشر للعميل. المنتج لا يظهر للعميل إلا بعد partner active + product approved + catalog published.',
    ownerSurface: 'control-panel',
    controlPanelOwnerSection: 'catalogs',
    visibleToSurfaces: ['control-panel', 'app-partner'],
    relatedFlowIds: [
      'items-upsert',
      'inventory-update',
      'inventory-adjust',
    ],
    inputSummary: 'قائمة منتجات الشريك مع بيانات SKU/GTIN/barcode وسياسة الوسائط',
    outputSummary: 'منتجات معتمدة + كتالوج منشور + stage = client-visible',
    requiredEvidence: ['بيانات المنتج الكاملة', 'SKU/GTIN/barcode', 'صور المنتجات (إن وُجدت)'],
    onDemandPolicy: 'detail-on-open',
    allowedActions: [
      'مراجعة واعتماد المنتجات',
      'مراجعة الباركود والمعرّفات',
      'تحديد سياسة الوسائط (catalog-owned / partner-exception)',
      'نشر الكتالوج بعد الاعتماد',
      'إرسال لـ marketing للمراجعة التسويقية إن احتاج',
    ],
    forbiddenActions: [
      'اعتماد منتج بدون بيانات هوية صحيحة',
      'نشر كتالوج شريك غير مفعّل',
      'تكرار منطق partner lifecycle',
      'تعديل settlement أو commission',
    ],
    nextStepIds: ['partner-status-visibility', 'client-store-visibility'],
    clientVisibleWhen: 'partner active + product approved + catalog published + stage = client-visible',
    partnerVisibleWhen: 'catalog-onboarding — الشريك يرى حالة اعتماد منتجاته',
    notes: 'app-partner يمكنه تعديل السعر والمخزون المحلي ضمن السياسة. النشر النهائي للعميل يمر عبر catalogs فقط.',
  },
  {
    stepId: 'partner-status-visibility',
    title: 'حالة التأهيل في تطبيق الشريك',
    description: 'الشريك يرى حالة تأهيله وجاهزيته وما ينقصه. لا يملك اعتماد نفسه أو نشر منتجاته للعميل مباشرة.',
    ownerSurface: 'app-partner',
    controlPanelOwnerSection: 'partners',
    visibleToSurfaces: ['app-partner'],
    relatedFlowIds: [
      'intake-start',
      'doc-upload',
      'store-nomination',
      'items-upsert',
      'inventory-adjust',
    ],
    inputSummary: 'حالة دورة الحياة من control-panel/partners + حالة اعتماد الكتالوج من catalogs',
    outputSummary: 'الشريك يفهم موقعه في الرحلة ويعرف ما الخطوة التالية',
    requiredEvidence: [],
    onDemandPolicy: 'summary-only',
    allowedActions: [
      'عرض حالة التأهيل (read-only)',
      'عرض ما ينقصه',
      'رفع بيانات إضافية مطلوبة',
      'تعديل المخزون والسعر المحلي ضمن السياسة',
      'إرسال نية ترويجية للمراجعة',
    ],
    forbiddenActions: [
      'اعتماد نفسه شريكاً',
      'نشر منتجات للعميل مباشرة',
      'تعديل سياسة الكتالوج',
      'الوصول لبيانات العملاء الآخرين',
    ],
    nextStepIds: ['client-store-visibility'],
    partnerVisibleWhen: 'دائماً — summary أولاً؛ تفاصيل المرحلة عند الفتح فقط',
    notes: 'الشريك يرى ملخص المرحلة الحالية فقط. البيانات الثقيلة on-demand.',
  },
  {
    stepId: 'client-store-visibility',
    title: 'ظهور المتجر للعميل',
    description: 'العميل يرى فقط المتاجر النشطة مع الكتالوج المعتمد والمنتجات المنشورة.',
    ownerSurface: 'app-client',
    visibleToSurfaces: ['app-client'],
    relatedFlowIds: [
      'client-order-tracking',
      'client-cart-checkout',
    ],
    inputSummary: 'شريك active + catalog published + products client-visible',
    outputSummary: 'العميل يتصفح المتاجر ويضيف للعربة ويطلب',
    requiredEvidence: [],
    onDemandPolicy: 'summary-only',
    allowedActions: [
      'عرض المتجر النشط',
      'عرض المنتجات المعتمدة والمنشورة',
      'إضافة للعربة',
      'إتمام الطلب',
    ],
    forbiddenActions: [
      'رؤية شريك pending/blocked/draft',
      'رؤية منتج غير معتمد',
      'رؤية أدلة الميداني أو وثائق الشريك',
      'رؤية notes الاعتماد الداخلية',
      'تحميل payload كامل للمتجر دائماً',
    ],
    nextStepIds: [],
    clientVisibleWhen: 'stage = client-visible فقط — canRenderInClientSurface() يفرض هذا',
    notes: 'يُطبَّق عبر canRenderInClientSurface() في workflow.ts. الفلترة في طبقة الاستدعاء لا في الشاشة مباشرة.',
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/** Get a single journey step by ID. Returns undefined if not found. */
export function getDshPartnerJourneyStep(
  stepId: DshPartnerJourneyStepId,
): DshPartnerJourneyStep | undefined {
  return DSH_PARTNER_ONBOARDING_JOURNEY.find((s) => s.stepId === stepId);
}

/** Get all journey steps visible to a specific surface. */
export function getDshPartnerJourneyStepsForSurface(
  surfaceId: DshSurfaceId,
): readonly DshPartnerJourneyStep[] {
  return DSH_PARTNER_ONBOARDING_JOURNEY.filter((s) =>
    s.ownerSurface === surfaceId || s.visibleToSurfaces.includes(surfaceId),
  );
}

/** Resolve the label for a partner lifecycle stage. */
export function resolveDshPartnerLifecycleStageLabel(stage: DshPartnerLifecycleStage): string {
  switch (stage) {
    case 'field-submitted':   return 'تم الإرسال من الميدان';
    case 'partner-review':    return 'مراجعة الشركاء';
    case 'documents-review':  return 'مراجعة الوثائق';
    case 'partner-approved':  return 'معتمد من الشركاء';
    case 'catalog-onboarding': return 'تأهيل الكتالوج';
    case 'marketing-review':  return 'مراجعة التسويق';
    case 'active':            return 'نشط';
    case 'blocked':           return 'محظور';
    case 'needs-fix':         return 'يتطلب تعديل';
    case 'rejected':          return 'مرفوض';
    default:                  return stage;
  }
}

/** Resolve the next journey step ID for a given lifecycle stage. */
export function resolveNextJourneyStepForStage(
  stage: DshPartnerLifecycleStage,
): DshPartnerJourneyStepId | undefined {
  switch (stage) {
    case 'field-submitted':    return 'document-verification';
    case 'documents-review':   return 'partner-lifecycle-review';
    case 'partner-review':     return 'partner-lifecycle-review';
    case 'partner-approved':   return 'catalog-onboarding';
    case 'catalog-onboarding': return 'partner-status-visibility';
    case 'marketing-review':   return 'catalog-onboarding';
    case 'active':             return 'client-store-visibility';
    default:                   return undefined;
  }
}

/** Get the control-panel section responsible for a lifecycle stage. */
export function resolveCpSectionForLifecycleStage(
  stage: DshPartnerLifecycleStage,
): DshPartnerJourneyControlPanelSection | undefined {
  switch (stage) {
    case 'field-submitted':
    case 'documents-review':
    case 'partner-review':
    case 'partner-approved':
    case 'needs-fix':
    case 'blocked':
    case 'rejected':
      return 'partners';
    case 'catalog-onboarding':
      return 'catalogs';
    case 'marketing-review':
      return 'marketing';
    case 'active':
      return undefined;
    default:
      return 'partners';
  }
}
