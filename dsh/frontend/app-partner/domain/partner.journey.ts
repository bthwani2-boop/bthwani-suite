// Moved from state-machines/dsh-partner-onboarding-journey.map.ts
// Canonical location: partner/partner.journey.ts
// Re-exported for backward compat from state-machines/dsh-partner-onboarding-journey.map.ts

import type { DshOnDemandPolicy, DshSurfaceId } from '../../shared/runtime/dsh-flow-registry';

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

export type DshPartnerLifecycleStage =
  | 'field-submitted'
  | 'partner-review'
  | 'documents-review'
  | 'partner-approved'
  | 'catalog-onboarding'
  | 'marketing-review'
  | 'active'
  | 'blocked'
  | 'needs-fix'
  | 'rejected';

export type DshPartnerJourneyControlPanelSection =
  | 'partners'
  | 'catalogs'
  | 'marketing'
  | 'finance'
  | 'platform';

export type DshPartnerJourneyStep = {
  readonly stepId: DshPartnerJourneyStepId;
  readonly title: string;
  readonly description: string;
  readonly ownerSurface: DshSurfaceId;
  readonly controlPanelOwnerSection?: DshPartnerJourneyControlPanelSection;
  readonly visibleToSurfaces: readonly DshSurfaceId[];
  readonly relatedFlowIds: readonly string[];
  readonly inputSummary: string;
  readonly outputSummary: string;
  readonly requiredEvidence: readonly string[];
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly nextStepIds: readonly DshPartnerJourneyStepId[];
  readonly clientVisibleWhen?: string;
  readonly partnerVisibleWhen?: string;
  readonly financialImpact?: boolean;
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
    relatedFlowIds: ['field-store-onboarding', 'field-store-visit', 'store-nomination'],
    inputSummary: 'بيانات المتجر، صور الفرع، معلومات المالك، ساعات العمل',
    outputSummary: 'ملف تأهيل مكتمل جاهز للمراجعة في control-panel/partners',
    requiredEvidence: ['صورة الواجهة', 'تأكيد بيانات المالك', 'ملف التأهيل'],
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['استكمال ملف التأهيل', 'رفع الوثائق الأولية', 'تسجيل الزيارة الميدانية', 'تحويل للمراجعة'],
    forbiddenActions: ['التفعيل النهائي للشريك', 'نشر منتجات للعميل', 'تقرير اعتماد الشريك', 'ربط settlement محلي'],
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
    relatedFlowIds: ['doc-upload', 'field-store-onboarding'],
    inputSummary: 'وثائق الهوية، سجل التجاري، عقد الإيجار، شهادة الصحة (حسب الفئة)',
    outputSummary: 'حزمة وثائق كاملة للاعتماد من control-panel/partners',
    requiredEvidence: ['نسخة الهوية الوطنية', 'السجل التجاري', 'عقد الإيجار أو الملكية', 'شهادة صحة أو ترخيص (إن انطبق)'],
    onDemandPolicy: 'evidence-on-open',
    allowedActions: ['رفع الوثائق', 'مراجعة اكتمال الحزمة محلياً', 'إرفاق مرجع للوثيقة', 'تحديد الوثائق الناقصة'],
    forbiddenActions: ['اعتماد الوثائق نهائياً من app-field', 'تجاوز مرحلة مراجعة الوثائق', 'تحميل الوثائق الكاملة دائماً في state'],
    nextStepIds: ['partner-lifecycle-review'],
    partnerVisibleWhen: 'documents-review — الشريك يرى الوثائق المطلوبة وما تم رفعه',
    notes: 'app-field يجمع الأدلة على طلب فقط (evidence-on-open). القرار النهائي لـ control-panel/partners.',
  },
  {
    stepId: 'partner-lifecycle-review',
    title: 'مراجعة دورة حياة الشريك (شركاء)',
    description: 'قسم الشركاء في لوحة التحكم يملك الاعتماد النهائي لدورة حياة الشريك.',
    ownerSurface: 'control-panel',
    controlPanelOwnerSection: 'partners',
    visibleToSurfaces: ['control-panel'],
    relatedFlowIds: ['intake-start', 'doc-upload', 'store-nomination', 'field-store-onboarding', 'field-readiness-escalation'],
    inputSummary: 'ملف التأهيل من app-field + وثائق مكتملة',
    outputSummary: 'شريك معتمد بكود شريك صالح وجاهزية تشغيلية مؤكدة → ينتقل لـ catalog-onboarding',
    requiredEvidence: ['حزمة الوثائق الكاملة', 'ملف التأهيل', 'تقرير الجاهزية'],
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['مراجعة ملف التأهيل', 'اعتماد أو رفض الوثائق', 'طلب إعادة تقديم الوثائق', 'مراجعة الجاهزية التشغيلية', 'مراجعة topology الخدمة', 'تفعيل الشريك النهائي بعد اكتمال جميع الخطوات', 'إلغاء تفعيل الشريك'],
    forbiddenActions: ['نشر منتجات للعميل مباشرة', 'تكرار منطق catalog publishing', 'تكرار منطق marketing eligibility', 'تكرار منطق finance settlement', 'التفعيل بدون اكتمال الوثائق'],
    nextStepIds: ['catalog-onboarding'],
    partnerVisibleWhen: 'partner-review / partner-approved — الشريك يرى أن ملفه قيد المراجعة',
    notes: 'حالات دورة الحياة: pending-intake → documents-review → readiness-review → topology-review → approved/active/blocked',
  },
  {
    stepId: 'catalog-onboarding',
    title: 'تأهيل الكتالوج والمنتجات (كتالوج)',
    description: 'قسم الكتالوج يملك اعتماد المنتجات والباركود والنشر للعميل.',
    ownerSurface: 'control-panel',
    controlPanelOwnerSection: 'catalogs',
    visibleToSurfaces: ['control-panel', 'app-partner'],
    relatedFlowIds: ['items-upsert', 'inventory-update', 'inventory-adjust'],
    inputSummary: 'قائمة منتجات الشريك مع بيانات SKU/GTIN/barcode وسياسة الوسائط',
    outputSummary: 'منتجات معتمدة + كتالوج منشور + stage = client-visible',
    requiredEvidence: ['بيانات المنتج الكاملة', 'SKU/GTIN/barcode', 'صور المنتجات (إن وُجدت)'],
    onDemandPolicy: 'detail-on-open',
    allowedActions: ['مراجعة واعتماد المنتجات', 'مراجعة الباركود والمعرّفات', 'تحديد سياسة الوسائط (catalog-owned / partner-exception)', 'نشر الكتالوج بعد الاعتماد', 'إرسال لـ marketing للمراجعة التسويقية إن احتاج'],
    forbiddenActions: ['اعتماد منتج بدون بيانات هوية صحيحة', 'نشر كتالوج شريك غير مفعّل', 'تكرار منطق partner lifecycle', 'تعديل settlement أو commission'],
    nextStepIds: ['partner-status-visibility', 'client-store-visibility'],
    clientVisibleWhen: 'partner active + product approved + catalog published + stage = client-visible',
    partnerVisibleWhen: 'catalog-onboarding — الشريك يرى حالة اعتماد منتجاته',
    notes: 'app-partner يمكنه تعديل السعر والمخزون المحلي ضمن السياسة. النشر النهائي للعميل يمر عبر catalogs فقط.',
  },
  {
    stepId: 'partner-status-visibility',
    title: 'حالة التأهيل في تطبيق الشريك',
    description: 'الشريك يرى حالة تأهيله وجاهزيته وما ينقصه.',
    ownerSurface: 'app-partner',
    controlPanelOwnerSection: 'partners',
    visibleToSurfaces: ['app-partner'],
    relatedFlowIds: ['intake-start', 'doc-upload', 'store-nomination', 'items-upsert', 'inventory-adjust'],
    inputSummary: 'حالة دورة الحياة من control-panel/partners + حالة اعتماد الكتالوج من catalogs',
    outputSummary: 'الشريك يفهم موقعه في الرحلة ويعرف ما الخطوة التالية',
    requiredEvidence: [],
    onDemandPolicy: 'summary-only',
    allowedActions: ['عرض حالة التأهيل (read-only)', 'عرض ما ينقصه', 'رفع بيانات إضافية مطلوبة', 'تعديل المخزون والسعر المحلي ضمن السياسة', 'إرسال نية ترويجية للمراجعة'],
    forbiddenActions: ['اعتماد نفسه شريكاً', 'نشر منتجات للعميل مباشرة', 'تعديل سياسة الكتالوج', 'الوصول لبيانات العملاء الآخرين'],
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
    relatedFlowIds: ['client-order-tracking', 'client-cart-checkout'],
    inputSummary: 'شريك active + catalog published + products client-visible',
    outputSummary: 'العميل يتصفح المتاجر ويضيف للعربة ويطلب',
    requiredEvidence: [],
    onDemandPolicy: 'summary-only',
    allowedActions: ['عرض المتجر النشط', 'عرض المنتجات المعتمدة والمنشورة', 'إضافة للعربة', 'إتمام الطلب'],
    forbiddenActions: ['رؤية شريك pending/blocked/draft', 'رؤية منتج غير معتمد', 'رؤية أدلة الميداني أو وثائق الشريك', 'رؤية notes الاعتماد الداخلية', 'تحميل payload كامل للمتجر دائماً'],
    nextStepIds: [],
    clientVisibleWhen: 'stage = client-visible فقط — canRenderInClientSurface() يفرض هذا',
    notes: 'يُطبَّق عبر canRenderInClientSurface() في workflow.ts. الفلترة في طبقة الاستدعاء لا في الشاشة مباشرة.',
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getDshPartnerJourneyStep(stepId: DshPartnerJourneyStepId): DshPartnerJourneyStep | undefined {
  return DSH_PARTNER_ONBOARDING_JOURNEY.find((s) => s.stepId === stepId);
}

export function getDshPartnerJourneyStepsForSurface(surfaceId: DshSurfaceId): readonly DshPartnerJourneyStep[] {
  return DSH_PARTNER_ONBOARDING_JOURNEY.filter((s) => s.ownerSurface === surfaceId || s.visibleToSurfaces.includes(surfaceId));
}

export function resolveDshPartnerLifecycleStageLabel(stage: DshPartnerLifecycleStage): string {
  switch (stage) {
    case 'field-submitted':    return 'تم الإرسال من الميدان';
    case 'partner-review':     return 'مراجعة الشركاء';
    case 'documents-review':   return 'مراجعة الوثائق';
    case 'partner-approved':   return 'معتمد من الشركاء';
    case 'catalog-onboarding': return 'تأهيل الكتالوج';
    case 'marketing-review':   return 'مراجعة التسويق';
    case 'active':             return 'نشط';
    case 'blocked':            return 'محظور';
    case 'needs-fix':          return 'يتطلب تعديل';
    case 'rejected':           return 'مرفوض';
    default:                   return stage;
  }
}

export function resolveNextJourneyStepForStage(stage: DshPartnerLifecycleStage): DshPartnerJourneyStepId | undefined {
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

export function resolveCpSectionForLifecycleStage(stage: DshPartnerLifecycleStage): DshPartnerJourneyControlPanelSection | undefined {
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
