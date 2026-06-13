export { DSH_SUPPORT_ISSUE_TYPES } from '../../shared/support-flows';
export type { DshSupportIssueType } from '../../shared/support-flows';

import type { DshControlPanelSectionId } from '../../shared/dsh-governance.map';
import type { DshOnDemandPolicy } from '../../shared/dsh-flow-registry';
import { getDshSectionAuditPolicy } from '../../shared/dsh-role-permission.model';
import type { DshFulfillmentDeliveryMode } from '../../shared/dsh-delivery-mode.model';
import {
  buildDshSignalRoute,
  type DshGlobalControlLink,
  type DshLookupInput,
  type DshPlaceholderStatus,
  type DshReadOnlyFinanceVisibility,
  type DshRouteHintedAction,
  type DshSignalRoute,
  type DshVerificationStatus,
  type DshVerificationStep,
} from '../../shared/dsh-order.contract';

// -----------------------------------------------------------------------------
// Operations support preview
// -----------------------------------------------------------------------------
export type DshOperationsSupportSurfaceId =
  | 'app-partner'
  | 'app-client'
  | 'app-captain'
  | 'app-field'
  | 'control-panel'
  | 'wlt';

export type DshOperationsSupportVisibilityMode =
  | 'primary'
  | 'context-only'
  | 'escalation-only'
  | 'hidden-compat'
  | 'reference-only';

export type DshOperationsSupportEscalationOwner = 'control-panel' | 'wlt' | 'partner-management';
export type DshOperationsSupportSeverity = 'info' | 'warning' | 'danger' | 'success';

export const DSH_OPERATIONS_SUPPORT_FLOW_IDS = [
  'delayed-preparation',
  'item-unavailable',
  'partner-reject-request',
  'courier-not-arrived',
  'customer-not-responding',
  'handoff-mismatch',
  'wrong-item',
  'payment-refund-review',
  'manual-call-intake',
  'customer-360-review',
  'assisted-order-desk',
  'order-rescue',
  'delivery-failed',
  'proof-of-delivery',
  'store-wait-time',
  'catalog-barcode-issue',
  'branch-readiness-escalation',
  'field-proof-required',
  'store-nomination-intake',
  'auction-status-update',
  'order-rejection',
] as const;

export type DshOperationsSupportFlowId = (typeof DSH_OPERATIONS_SUPPORT_FLOW_IDS)[number];

export type DshOperationsSupportFlowVisibility = {
  surfaceId: DshOperationsSupportSurfaceId;
  mode: DshOperationsSupportVisibilityMode;
  routeHint: string;
  notes?: string;
};

export type DshOperationsSupportFlowPreview = {
  flowId: DshOperationsSupportFlowId;
  title: string;
  description: string;
  surfaceVisibility: readonly DshOperationsSupportFlowVisibility[];
  ownerSurface: DshOperationsSupportSurfaceId;
  ownerLabel: string;
  escalationOwner: DshOperationsSupportEscalationOwner;
  escalationOwnerLabel: string;
  severity: DshOperationsSupportSeverity;
  allowedActions: readonly string[];
  forbiddenActions: readonly string[];
  relatedOrderState: string;
  financialImpactPreview?: string;
  requiresEvidence: boolean;
  nextAction: string;
  hiddenCompat?: boolean;
};

function visibility(
  surfaceId: DshOperationsSupportSurfaceId,
  mode: DshOperationsSupportVisibilityMode,
  routeHint: string,
  notes?: string
): DshOperationsSupportFlowVisibility {
  return { surfaceId, mode, routeHint, notes };
}

const controlPanelEscalationOwnerLabel = 'لوحة التحكم';
const wltEscalationOwnerLabel = 'WLT';
const partnerManagementEscalationOwnerLabel = 'Partner Management';

export const DSH_OPERATIONS_SUPPORT_PREVIEW: readonly DshOperationsSupportFlowPreview[] = [
  {
    flowId: 'delayed-preparation',
    title: 'تأخر التحضير',
    description: 'الطلب تجاوز نافذة التحضير ويحتاج قرارًا تشغيليًا سريعًا داخل نفس سياق الطلب.',
    surfaceVisibility: [
      visibility('app-partner', 'primary', 'support-directory', 'يظهر داخل مركز عمليات الشريك.'),
      visibility('app-client', 'context-only', 'order-issue-workspace', 'يظهر من داخل الطلب فقط.'),
      visibility('control-panel', 'primary', 'support/queue', 'يدخل صف SLA والاستثناءات.'),
    ],
    ownerSurface: 'app-partner',
    ownerLabel: 'الشريك',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'danger',
    allowedActions: ['تثبيت وقت التحضير', 'فتح محادثة دعم', 'تصعيد خطر SLA'],
    forbiddenActions: ['إغلاق الحالة دون تحديث الطلب', 'إنشاء استرداد محلي'],
    relatedOrderState: 'preparation_delayed',
    requiresEvidence: false,
    nextAction: 'ثبّت التأخير أو أعد الطلب إلى مسار تحضير واضح.',
  },
  {
    flowId: 'item-unavailable',
    title: 'نفاد صنف مؤثر',
    description: 'عنصر غير متاح يهدد استمرار الطلب أو يتطلب بديلًا واضحًا قبل تثبيت التنفيذ.',
    surfaceVisibility: [
      visibility('app-partner', 'primary', 'inventory-adjust', 'يظهر كمشكلة طلب ومخزون معًا.'),
      visibility('app-client', 'context-only', 'order-issue-workspace', 'العميل يراه كبديل/نفاد داخل الطلب فقط.'),
      visibility('app-field', 'context-only', 'stores > onboarding > products', 'يعكس أثر الإدخال أو الباركود على الكتالوج.'),
      visibility('control-panel', 'primary', 'support/queue', 'يصل لصف معالجة الاستثناءات.'),
    ],
    ownerSurface: 'app-partner',
    ownerLabel: 'الشريك',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'danger',
    allowedActions: ['تعديل المخزون', 'اقتراح بديل', 'تصعيد القرار للدعم'],
    forbiddenActions: ['إعلان الجاهزية مع بقاء النقص', 'رفض صامت بلا سبب'],
    relatedOrderState: 'item_unavailable',
    requiresEvidence: false,
    nextAction: 'ثبّت البديل أو أوقف التنفيذ قبل التسليم.',
  },
  {
    flowId: 'partner-reject-request',
    title: 'طلب رفض من الشريك',
    description: 'رفض الطلب يبقى قرارًا استثنائيًا ويحتاج سببًا تشغيليًا صريحًا داخل نفس السياق.',
    surfaceVisibility: [
      visibility('app-partner', 'primary', 'order-reject', 'يظهر من command center فقط عند وجود سبب مثبت.'),
      visibility('control-panel', 'primary', 'support/escalation', 'الجهة المالكة لسياسة الأسباب والتصعيد.'),
    ],
    ownerSurface: 'app-partner',
    ownerLabel: 'الشريك',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'danger',
    allowedActions: ['فتح مسار الرفض', 'تسجيل السبب', 'طلب مراجعة تشغيلية'],
    forbiddenActions: ['رفض بلا سبب', 'تحويل الحالة إلى تعويض مالي محلي'],
    relatedOrderState: 'reject_requested',
    requiresEvidence: true,
    nextAction: 'راجع السبب ثم قرر بين الرفض أو إعادة الطلب إلى المعالجة.',
  },
  {
    flowId: 'courier-not-arrived',
    title: 'الكابتن / الموصل لم يصل',
    description: 'نقطة الالتقاط أو التسليم متوقفة لأن جهة الاستلام لم تصل بعد رغم جاهزية الطلب.',
    surfaceVisibility: [
      visibility('app-partner', 'context-only', 'support-directory', 'يظهر أثره على تنفيذ الشريك.'),
      visibility('app-captain', 'primary', 'support-directory', 'الكابتن يرى handoff/delivery issues فقط.'),
      visibility('control-panel', 'primary', 'support/queue', 'يدخل صف مخاطر الإسناد والتأخير.'),
    ],
    ownerSurface: 'app-captain',
    ownerLabel: 'الكابتن',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'warning',
    allowedActions: ['طلب إثبات وصول', 'فتح محادثة', 'تصعيد تأخير التسليم'],
    forbiddenActions: ['تأكيد التسليم دون وصول فعلي', 'إغلاق الحالة كتسليم ناجح'],
    relatedOrderState: 'courier_not_arrived',
    requiresEvidence: true,
    nextAction: 'ثبّت الوصول أو صعّد الحالة قبل خرق SLA.',
  },
  {
    flowId: 'customer-not-responding',
    title: 'العميل غير متجاوب',
    description: 'التواصل مطلوب لإكمال الطلب أو التسليم، لكن المحاولات الأخيرة بلا رد واضح.',
    surfaceVisibility: [
      visibility('app-partner', 'context-only', 'chat-send', 'يظهر أثر عدم التجاوب على الطلب فقط.'),
      visibility('app-captain', 'primary', 'support-directory', 'الكابتن يتعامل معه كتحديث تسليم/وصول.'),
      visibility('control-panel', 'primary', 'support/messaging', 'يظل تحت ملكية التصعيد والمتابعة.'),
    ],
    ownerSurface: 'app-captain',
    ownerLabel: 'الكابتن',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'info',
    allowedActions: ['فتح المحادثة', 'طلب إثبات محاولة التواصل', 'تصعيد عدم الاستجابة'],
    forbiddenActions: ['إلغاء الطلب مباشرة', 'تحويل المشكلة إلى داخلية للشريك'],
    relatedOrderState: 'customer_unresponsive',
    requiresEvidence: true,
    nextAction: 'أعد محاولة التواصل ثم افتح التصعيد إذا بقيت الحالة معلقة.',
  },
  {
    flowId: 'handoff-mismatch',
    title: 'عدم تطابق في التسليم',
    description: 'هناك تضارب بين الجهة المستلمة أو حالة الخروج ويجب تثبيت التسليم الصحيح قبل المتابعة.',
    surfaceVisibility: [
      visibility('app-partner', 'primary', 'order-handoff', 'الشريك يرى أثر handoff على الطلب.'),
      visibility('app-captain', 'primary', 'support-directory', 'الكابتن يرى handoff فقط ضمن رحلته.'),
      visibility('control-panel', 'primary', 'support/escalation', 'التصعيد المالك لتثبيت القرار النهائي.'),
    ],
    ownerSurface: 'app-captain',
    ownerLabel: 'الكابتن',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'danger',
    allowedActions: ['مراجعة التسليم', 'طلب إثبات', 'فتح محادثة مشتركة'],
    forbiddenActions: ['متابعة التوصيل قبل تثبيت التسليم', 'تجاوز الإثبات'],
    relatedOrderState: 'handoff_mismatch',
    requiresEvidence: true,
    nextAction: 'ثبّت الجهة الصحيحة ثم أعد الطلب إلى المسار السليم.',
  },
  {
    flowId: 'wrong-item',
    title: 'عنصر خاطئ أو غير مطابق',
    description: 'العنصر المجهز لا يطابق المرجع المطلوب ويجب إيقاف التنفيذ حتى المراجعة.',
    surfaceVisibility: [
      visibility('app-partner', 'primary', 'order-issue-queue', 'يبقى داخل مسار الطلب في الشريك.'),
      visibility('app-client', 'context-only', 'order-issue-workspace', 'العميل يراه كتذكرة مشكلة داخل الطلب.'),
      visibility('control-panel', 'primary', 'support/queue', 'يدخل صف النزاعات/الاستثناءات.'),
    ],
    ownerSurface: 'app-partner',
    ownerLabel: 'الشريك',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'warning',
    allowedActions: ['مراجعة المطابقة', 'طلب إثبات بصري', 'إعادة الطلب للتحضير'],
    forbiddenActions: ['إرسال الطلب كما هو', 'إغلاق الحالة قبل المطابقة'],
    relatedOrderState: 'wrong_item',
    requiresEvidence: true,
    nextAction: 'راجع المطابقة بصريًا ثم أعد الطلب للتحضير أو التسليم.',
  },
  {
    flowId: 'payment-refund-review',
    title: 'مراجعة دفع / استرداد',
    description: 'هذه إشارة تشغيلية فقط لحالة ذات أثر مالي محتمل. لا يوجد أي money mutation داخل DSH.',
    surfaceVisibility: [
      visibility('app-partner', 'escalation-only', 'support-directory', 'يظهر كتاغ أو bridge preview فقط.'),
      visibility('app-client', 'context-only', 'order-issue-workspace', 'العميل يراه كـ preview tag داخل الطلب.'),
      visibility('control-panel', 'primary', 'support/escalation', 'control-panel يملك قرار المراجعة والسياسة.'),
      visibility('wlt', 'reference-only', 'finance/refund-preview', 'WLT مرجعية فقط لأي أثر مالي.'),
    ],
    ownerSurface: 'control-panel',
    ownerLabel: 'لوحة التحكم',
    escalationOwner: 'wlt',
    escalationOwnerLabel: wltEscalationOwnerLabel,
    severity: 'info',
    allowedActions: ['تمييز الحالة Preview', 'تحويل للمراجعة', 'فتح مرجع WLT للقراءة فقط'],
    forbiddenActions: ['بدء استرداد', 'تعديل تسوية', 'تغيير عمولة أو ledger'],
    relatedOrderState: 'financial_review_pending',
    financialImpactPreview: 'refund-adjustment / partner-settlement / store-courier-compensation',
    requiresEvidence: true,
    nextAction: 'صعّد الحالة للمراجعة التشغيلية واترك أي حساب مالي لـ WLT.',
  },
  {
    flowId: 'manual-call-intake',
    title: 'إدخال مكالمة يدوي',
    description: 'مكالمة خارجية تحتاج source = external_phone_manual والتحقق من الهوية قبل أي كشف حساس.',
    surfaceVisibility: [
      visibility('control-panel', 'primary', 'support/call-intake', 'يبقى داخل قسم الدعم ويفتح عند الحاجة فقط.'),
      visibility('app-client', 'context-only', 'orders', 'يرتبط بطلب العميل أو تذكرته من دون كشف بيانات جديدة.'),
    ],
    ownerSurface: 'control-panel',
    ownerLabel: 'الدعم',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'warning',
    allowedActions: ['تسجيل المكالمة', 'فتح Customer 360', 'تحويل إلى مساعدة الطلب بعد التحقق'],
    forbiddenActions: ['كشف الحقول الحساسة قبل التحقق', 'تغيير المصدر اليدوي', 'بدء refund محلي'],
    relatedOrderState: 'manual_call_intake',
    financialImpactPreview: 'wlt-visibility-only',
    requiresEvidence: true,
    nextAction: 'أكمل الهوية أو أبقِ الحقول الحساسة محجوبة ثم افتح المسار المناسب.',
  },
  {
    flowId: 'customer-360-review',
    title: 'Customer 360',
    description: 'عرض موحّد للطلب والتذكرة ورؤية WLT المرجعية مع إجراءات سريعة إلى مساعدة الطلب وإنقاذ الطلب.',
    surfaceVisibility: [
      visibility('control-panel', 'primary', 'support/customer-360', 'يبقى داخل الدعم كمركز سياقي واحد.'),
      visibility('app-client', 'context-only', 'orders', 'يرتبط بسياق الطلب الفعلي فقط.'),
    ],
    ownerSurface: 'control-panel',
    ownerLabel: 'الدعم',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'info',
    allowedActions: ['فتح الطلب أو التذكرة', 'فتح مساعدة الطلب', 'فتح إنقاذ الطلب'],
    forbiddenActions: ['بدء refund أو settlement', 'نسخ منطق الشاشات العميلية', 'إغلاق ticket خارج owner الدعم'],
    relatedOrderState: 'customer_360_review',
    financialImpactPreview: 'wlt-preview-links',
    requiresEvidence: false,
    nextAction: 'اجمع السياق أولاً ثم افتح workspace التدخل الصحيح بدل تكرار التنقل.',
  },
  {
    flowId: 'assisted-order-desk',
    title: 'مساعدة الطلب',
    description: 'معالجة طلبات المساعدة اليدوية وإعادة بناء السلة مع تثبيت البدائل وهويات العميل.',
    surfaceVisibility: [
      visibility('control-panel', 'primary', 'operations/assisted-order-desk', 'workspace تشغيلي مخصص للتدخل قبل الإنقاذ.'),
      visibility('app-client', 'context-only', 'orders', 'العميل يرى النتيجة فقط داخل الطلب.'),
      visibility('app-partner', 'context-only', 'orders', 'الشريك يرى أثر القرار على التنفيذ لا كامل المنطق.'),
    ],
    ownerSurface: 'control-panel',
    ownerLabel: 'العمليات',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'warning',
    allowedActions: ['إعادة بناء السلة', 'تثبيت البديل', 'فتح رؤية WLT المرجعية'],
    forbiddenActions: ['إرسال الطلب قبل الهوية', 'بدء money mutation', 'حل نزاع الشريك من داخل العمليات'],
    relatedOrderState: 'assisted_order_desk',
    financialImpactPreview: 'payment-visibility-only',
    requiresEvidence: true,
    nextAction: 'إذا بقي المعوق التشغيلي مفتوحًا فحوّل الحالة مباشرة إلى إنقاذ الطلب.',
  },
  {
    flowId: 'order-rescue',
    title: 'إنقاذ الطلب',
    description: 'مكتب إنقاذ يحدد معوقاً واحداً ويثبت أفضل إجراء تالٍ عبر الدعم أو الشريك أو WLT المرجعي.',
    surfaceVisibility: [
      visibility('control-panel', 'primary', 'operations/order-rescue', 'يبقى داخل العمليات مع تسليم واضح للمالك الصحيح.'),
      visibility('app-client', 'context-only', 'orders', 'العميل يرى أثر الإنقاذ على حالته فقط.'),
      visibility('app-partner', 'context-only', 'orders', 'الشريك يرى أثر الحل على الطلب دون منطق rescue الكامل.'),
      visibility('wlt', 'reference-only', 'finance/refund-preview', 'تظهر الرؤية المالية المرجعية فقط عند الحاجة.'),
    ],
    ownerSurface: 'control-panel',
    ownerLabel: 'العمليات',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'danger',
    allowedActions: ['تحديد المعوق الرئيسي', 'فتح تذكرة دعم', 'فتح مرجع WLT', 'تحويل الحالة إلى الشريك أو الكتالوج أو الدعم'],
    forbiddenActions: ['إغلاق الحالة بلا معوق واضح', 'إطلاق استرداد محلي', 'تكرار نفس القرار عبر أكثر من مالك'],
    relatedOrderState: 'order_rescue',
    financialImpactPreview: 'refund-visibility-only',
    requiresEvidence: true,
    nextAction: 'ثبّت المالك النهائي وأغلق التشتيت بدل فتح تدخلات متضاربة.',
  },
  {
    flowId: 'delivery-failed',
    title: 'تعذر التسليم',
    description: 'التسليم لم يكتمل ويجب تثبيت السبب والإثبات قبل إعادة المحاولة أو الإغلاق.',
    surfaceVisibility: [
      visibility('app-client', 'context-only', 'tracking', 'العميل يراه داخل تتبع الطلب فقط.'),
      visibility('app-captain', 'primary', 'support-directory', 'الكابتن يعالجه ضمن مسار التسليم.'),
      visibility('control-panel', 'primary', 'support/queue', 'صف تدخلات التسليم والإسناد.'),
    ],
    ownerSurface: 'app-captain',
    ownerLabel: 'الكابتن',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'danger',
    allowedActions: ['تثبيت سبب الفشل', 'طلب محاولة تواصل أخيرة', 'رفع التصعيد'],
    forbiddenActions: ['إغلاق الطلب بلا سبب', 'مطالبة العميل بدعم خارج سياق الطلب'],
    relatedOrderState: 'delivery_failed',
    requiresEvidence: true,
    nextAction: 'ثبّت السبب ثم قرر بين إعادة المحاولة أو التصعيد.',
  },
  {
    flowId: 'proof-of-delivery',
    title: 'إثبات التسليم',
    description: 'إثبات التسليم يجب أن يبقى on-demand ويُراجع قبل الإغلاق النهائي للحالة.',
    surfaceVisibility: [
      visibility('app-captain', 'primary', 'proof-upload', 'الكابتن يرفع الإثبات ضمن مساره فقط.'),
      visibility('control-panel', 'primary', 'support/escalation', 'control-panel يراجع الإثبات ضمن audit/support.'),
    ],
    ownerSurface: 'app-captain',
    ownerLabel: 'الكابتن',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'warning',
    allowedActions: ['رفع الإثبات', 'طلب إعادة الالتقاط', 'مراجعة audit trail'],
    forbiddenActions: ['إغلاق التسليم دون إثبات', 'تضمين صور ثقيلة دائمًا في state'],
    relatedOrderState: 'proof_pending',
    requiresEvidence: true,
    nextAction: 'ارفع الإثبات أو اطلب إعادة الالتقاط قبل إغلاق الرحلة.',
  },
  {
    flowId: 'store-wait-time',
    title: 'انتظار داخل الفرع',
    description: 'الكابتن أو الموصل ينتظر داخل الفرع لأن الطلب أو التسليم لم يثبت بعد.',
    surfaceVisibility: [
      visibility('app-partner', 'context-only', 'order-prepare', 'يظهر كأثر استعداد داخل الفرع.'),
      visibility('app-captain', 'primary', 'support-directory', 'الكابتن يرى مشكلة الانتظار ضمن الالتقاط فقط.'),
      visibility('control-panel', 'primary', 'support/queue', 'تدخل لتخفيف ضغط الفرع أو تثبيت السبب.'),
    ],
    ownerSurface: 'app-partner',
    ownerLabel: 'الشريك',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'warning',
    allowedActions: ['تثبيت زمن الانتظار', 'فتح التسليم', 'تصعيد ضغط الفرع'],
    forbiddenActions: ['تحميل الكابتن السبب دون توثيق', 'إخفاء المشكلة من سجل الطلب'],
    relatedOrderState: 'store_wait_time',
    requiresEvidence: false,
    nextAction: 'ثبّت سبب الانتظار ثم حرّك الطلب إلى التسليم أو التصعيد.',
  },
  {
    flowId: 'catalog-barcode-issue',
    title: 'مشكلة كتالوج / باركود',
    description: 'المنتج أو الباركود أو ربط الإدخال يحتاج مراجعة ميدانية قبل أن يؤثر على الكتالوج المنشور.',
    surfaceVisibility: [
      visibility('app-field', 'primary', 'stores > onboarding > products', 'يبقى داخل ملف الإدخال أو التصحيح.'),
      visibility('control-panel', 'escalation-only', 'support/queue', 'يظهر عند الحاجة لتصعيد الحوكمة أو النشر.'),
    ],
    ownerSurface: 'app-field',
    ownerLabel: 'الميداني',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'warning',
    allowedActions: ['تصحيح المرجع', 'إضافة إثبات ميداني', 'تصعيد للنشر/الكتالوج'],
    forbiddenActions: ['تعديل أسعار نهائية للشريك دون صلاحية', 'نشر منتج غير متحقق'],
    relatedOrderState: 'catalog_binding_issue',
    requiresEvidence: true,
    nextAction: 'صحّح المرجع أو صعّد مشكلة الكتالوج قبل النشر.',
  },
  {
    flowId: 'branch-readiness-escalation',
    title: 'تصعيد جاهزية الفرع',
    description: 'الفرع غير جاهز تشغيلًا أو تعاقديًا ويحتاج تصعيدًا واضحًا لمالك السياسة والتفعيل.',
    surfaceVisibility: [
      visibility('app-field', 'primary', 'readiness-escalation', 'مسار ميداني مملوك للجاهزية والتحقق.'),
      visibility('control-panel', 'primary', 'support/escalation', 'الجهة المالكة لقرار التصعيد والسياسة.'),
    ],
    ownerSurface: 'app-field',
    ownerLabel: 'الميداني',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'danger',
    allowedActions: ['رفع بلاغ جاهزية', 'تجميع النواقص', 'تحويل القرار للوحة التحكم'],
    forbiddenActions: ['تفعيل الفرع رغم النواقص', 'ربط أي settlement محلي'],
    relatedOrderState: 'branch_not_ready',
    requiresEvidence: true,
    nextAction: 'اجمع النواقص ثم صعّد الحالة لقرار readiness واضح.',
  },
  {
    flowId: 'field-proof-required',
    title: 'إثبات ميداني مطلوب',
    description: 'هناك دليل ميداني مطلوب لتثبيت زيارة أو تحقق أو استثناء قبل قبول الحالة.',
    surfaceVisibility: [
      visibility('app-field', 'context-only', 'visit', 'الدليل يظهر فقط عند فتح الزيارة أو المراجعة.'),
      visibility('control-panel', 'escalation-only', 'support/escalation', 'يدخل audit trail عند التصعيد.'),
    ],
    ownerSurface: 'app-field',
    ownerLabel: 'الميداني',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'info',
    allowedActions: ['فتح الزيارة', 'إرفاق دليل مختصر', 'إعادة المحاولة'],
    forbiddenActions: ['تحميل صور ثقيلة دائمًا', 'إغلاق الحالة بلا دليل عند طلبه'],
    relatedOrderState: 'field_proof_required',
    requiresEvidence: true,
    nextAction: 'افتح الزيارة وأرفق الدليل عند الطلب فقط.',
  },
  {
    flowId: 'store-nomination-intake',
    title: 'ترشيح / إدخال متجر',
    description: 'هذا مسار field-owned لجمع بيانات الترشيح والانضمام دون تحويله إلى شاشة مالية أو تشغيلية عامة.',
    surfaceVisibility: [
      visibility('app-field', 'context-only', 'stores > onboarding', 'يبقى ضمن ملف الانضمام الواحد.'),
      visibility('control-panel', 'escalation-only', 'support/queue', 'يظهر فقط عند الحاجة لمراجعة استثنائية.'),
    ],
    ownerSurface: 'app-field',
    ownerLabel: 'الميداني',
    escalationOwner: 'partner-management',
    escalationOwnerLabel: partnerManagementEscalationOwnerLabel,
    severity: 'success',
    allowedActions: ['استكمال الإدخال', 'حفظ مسودة', 'تحويل للمراجعة'],
    forbiddenActions: ['تفعيل نهائي دون مراجعة', 'إسناد أي أثر مالي محلي'],
    relatedOrderState: 'store_nomination_intake',
    requiresEvidence: false,
    nextAction: 'استكمل ملف الانضمام ثم حوّله للمراجعة.',
  },
  {
    flowId: 'auction-status-update',
    title: 'Auction Status Update',
    description: 'legacy compat flow موجود للمستهلكين القدامى فقط ولا يجب أن يظهر كمدخل أساسي.',
    surfaceVisibility: [
      visibility('app-partner', 'hidden-compat', 'auction-status-update', 'legacy registry consumer only.'),
    ],
    ownerSurface: 'app-partner',
    ownerLabel: 'الشريك',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'info',
    allowedActions: ['الاحتفاظ بالتوافق'],
    forbiddenActions: ['إظهاره كخيار أساسي'],
    relatedOrderState: 'legacy_hidden_compat',
    requiresEvidence: false,
    nextAction: 'ابقه مخفيًا واستخدم المسارات الحالية بدلًا منه.',
    hiddenCompat: true,
  },
  {
    flowId: 'order-rejection',
    title: 'Order Rejection Legacy Route',
    description: 'legacy compat route يوازي مسار رفض الطلب الحالي ولا يجب أن يعود كمسار أساسي مستقل.',
    surfaceVisibility: [
      visibility('app-partner', 'hidden-compat', 'order-rejection', 'legacy route only.'),
    ],
    ownerSurface: 'app-partner',
    ownerLabel: 'الشريك',
    escalationOwner: 'control-panel',
    escalationOwnerLabel: controlPanelEscalationOwnerLabel,
    severity: 'info',
    allowedActions: ['الاحتفاظ بالتوافق'],
    forbiddenActions: ['عرضه كصفحة أساسية منفصلة'],
    relatedOrderState: 'legacy_hidden_compat',
    requiresEvidence: false,
    nextAction: 'استخدم partner-reject-request بدل هذا alias القديم.',
    hiddenCompat: true,
  },
] as const;

export const DSH_OPERATIONS_SUPPORT_HIDDEN_COMPAT_FLOW_IDS = DSH_OPERATIONS_SUPPORT_PREVIEW
  .filter((item) => item.hiddenCompat)
  .map((item) => item.flowId) as readonly DshOperationsSupportFlowId[];

export const DSH_OPERATIONS_SUPPORT_PREVIEW_BY_ID = Object.fromEntries(
  DSH_OPERATIONS_SUPPORT_PREVIEW.map((item) => [item.flowId, item])
) as Record<DshOperationsSupportFlowId, DshOperationsSupportFlowPreview>;

export function getOperationsSupportFlowPreview(
  flowId: DshOperationsSupportFlowId
): DshOperationsSupportFlowPreview {
  return DSH_OPERATIONS_SUPPORT_PREVIEW_BY_ID[flowId];
}

export function getOperationsSupportSurfaceEntry(
  flowId: DshOperationsSupportFlowId,
  surfaceId: DshOperationsSupportSurfaceId
): DshOperationsSupportFlowVisibility | undefined {
  return getOperationsSupportFlowPreview(flowId).surfaceVisibility.find((entry) => entry.surfaceId === surfaceId);
}

export function getOperationsSupportFlowsForSurface(
  surfaceId: DshOperationsSupportSurfaceId,
  options: { includeHiddenCompat?: boolean; includeReferenceOnly?: boolean } = {}
): readonly DshOperationsSupportFlowPreview[] {
  return DSH_OPERATIONS_SUPPORT_PREVIEW.filter((item) => {
    const surfaceEntry = item.surfaceVisibility.find((entry) => entry.surfaceId === surfaceId);

    if (!surfaceEntry) {
      return false;
    }

    if (surfaceEntry.mode === 'reference-only' && !options.includeReferenceOnly) {
      return false;
    }

    if (surfaceEntry.mode === 'hidden-compat' && !options.includeHiddenCompat) {
      return false;
    }

    return true;
  });
}

export function isOperationsSupportHiddenCompatFlow(
  flowId: DshOperationsSupportFlowId
): boolean {
  return DSH_OPERATIONS_SUPPORT_HIDDEN_COMPAT_FLOW_IDS.includes(flowId);
}

export type DshControlPanelSupportRowSeed = {
  id: string;
  flowId: DshOperationsSupportFlowId;
  surface: string;
  status: string;
  slaAge: string;
  fulfillmentMode: DshFulfillmentDeliveryMode;
  fulfillmentLabel: string;
  responsibleActor: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

export const DSH_CONTROL_PANEL_SUPPORT_ROW_SEEDS: readonly DshControlPanelSupportRowSeed[] = [
  {
    id: 'SUP-401',
    flowId: 'delivery-failed',
    surface: 'الطلبات',
    status: 'نشط',
    slaAge: '15 دقيقة',
    fulfillmentMode: 'bthwani_delivery',
    fulfillmentLabel: 'توصيل بثواني',
    responsibleActor: 'الكابتن',
    evidence: 'سجل رنين + صورة الاستلام',
    primaryActionLabel: 'فتح الطلب',
    secondaryActionLabel: 'فتح الأدلة',
  },
  {
    id: 'SUP-402',
    flowId: 'payment-refund-review',
    surface: 'الشركاء',
    status: 'تحت المراجعة',
    slaAge: '32 دقيقة',
    fulfillmentMode: 'partner_delivery',
    fulfillmentLabel: 'توصيل المتجر',
    responsibleActor: 'موصل الشريك / المتجر',
    evidence: 'نسخة الفاتورة + سجل التحصيل + محضر تسليم موصل الشريك',
    primaryActionLabel: 'مراجعة الشريك',
    secondaryActionLabel: 'فتح الأدلة',
  },
  {
    id: 'SUP-403',
    flowId: 'courier-not-arrived',
    surface: 'الكباتن',
    status: 'تحتاج حل',
    slaAge: '5 دقائق',
    fulfillmentMode: 'bthwani_delivery',
    fulfillmentLabel: 'توصيل بثواني',
    responsibleActor: 'الكابتن',
    evidence: 'مراسلات الدعم + سجل الجهاز',
    primaryActionLabel: 'إسناد بديل',
    secondaryActionLabel: 'فتح التصعيد',
  },
  {
    id: 'SUP-404',
    flowId: 'branch-readiness-escalation',
    surface: 'الميدان',
    status: 'مراقبة',
    slaAge: '47 دقيقة',
    fulfillmentMode: 'pickup',
    fulfillmentLabel: 'استلام بنفسي',
    responsibleActor: 'العميل / المتجر',
    evidence: 'إثبات الموعد + سجل الحضور + تأكيد الجاهزية',
    primaryActionLabel: 'تثبيت الموعد',
    secondaryActionLabel: 'فتح الأدلة',
  },
];

// --- P0-06: Support Ticket Model ---
// SSoT for message timelines, escalation routing, SLA classification, and status resolution.
// Authority contract:
//   control-panel/support  → owns all ticket resolution, escalation, and SLA decisions.
//   app-client             → support visible inside order context only — never a standalone hub.
//   app-partner            → support linked to order / catalog / handoff context only.
//   app-captain            → handoff / delivery / PoD context only.
//   WLT boundary           → tickets with financial impact show read-only preview tags; no mutation from DSH.

export type DshSupportTicketStatus =
  | 'open'
  | 'in-review'
  | 'escalated'
  | 'resolved'
  | 'sla-breach';

export type DshSupportTicketActorKind =
  | 'client'
  | 'partner'
  | 'captain'
  | 'field'
  | 'ops';

export type DshSupportTicketMessage = {
  readonly id: string;
  readonly senderKind: DshSupportTicketActorKind;
  readonly senderLabel: string;
  readonly body: string;
  readonly timestampLabel: string;
  /** System-generated events (escalation, status change) rendered differently. */
  readonly isSystem?: boolean;
};

export type DshSupportTicket = {
  readonly ticketId: string;
  readonly ticketCode: string;
  readonly subject: string;
  readonly categoryLabel: string;
  readonly outcomeLabel: string;
  readonly status: DshSupportTicketStatus;
  readonly priorityLabel: string;
  readonly actorKind: DshSupportTicketActorKind;
  readonly actorName: string;
  /** Type of the linked entity: order, catalog item, delivery, captain assignment, or generic. */
  readonly entityType: 'order' | 'catalog' | 'delivery' | 'assignment' | 'general';
  readonly entityId?: string;
  /** Which CP queue owns this ticket's resolution path. */
  readonly ownerQueue: 'support' | 'finance' | 'catalogs' | 'operations' | 'partner-management';
  readonly slaLabel: string;
  readonly slaRisk: 'on-track' | 'at-risk' | 'breached';
  readonly escalationOwner?: DshOperationsSupportEscalationOwner;
  readonly messagesPreview: ReadonlyArray<DshSupportTicketMessage>;
  readonly allowedActions: ReadonlyArray<string>;
  readonly auditRequired: boolean;
  readonly createdAtLabel: string;
  readonly flowId?: DshOperationsSupportFlowId;
};

const TICKET_STATUS_LABELS: Record<DshSupportTicketStatus, string> = {
  'open': 'مفتوح',
  'in-review': 'قيد المراجعة',
  'escalated': 'مصعَّد',
  'resolved': 'تم الحل',
  'sla-breach': 'انتهاك SLA',
};

const TICKET_STATUS_TONES: Record<
  DshSupportTicketStatus,
  'default' | 'success' | 'danger' | 'warning' | 'brand'
> = {
  'open': 'default',
  'in-review': 'brand',
  'escalated': 'danger',
  'resolved': 'success',
  'sla-breach': 'danger',
};

export function getDshSupportTicketStatusLabel(status: DshSupportTicketStatus): string {
  return TICKET_STATUS_LABELS[status];
}

export function getDshSupportTicketStatusTone(
  status: DshSupportTicketStatus,
): 'default' | 'success' | 'danger' | 'warning' | 'brand' {
  return TICKET_STATUS_TONES[status];
}

/** Demo ticket registry — ACCEPTED_PREVIEW_LABEL. All data is fictional preview content only. */
export const DSH_DEMO_SUPPORT_TICKETS: ReadonlyArray<DshSupportTicket> = [
  {
    ticketId: 'TKT-001',
    ticketCode: '#TKT-001',
    subject: 'تعذّر تسليم الطلب ORD-4401',
    categoryLabel: 'Delivery escalation',
    outcomeLabel: 'Customer follow-up + rescue',
    status: 'escalated',
    priorityLabel: 'عالية',
    actorKind: 'client',
    actorName: 'محمد العتيبي',
    entityType: 'order',
    entityId: 'ORD-4401',
    ownerQueue: 'support',
    slaLabel: 'يتبقى 8 دقائق',
    slaRisk: 'at-risk',
    escalationOwner: 'control-panel',
    createdAtLabel: '2026-05-21 10:43',
    flowId: 'delivery-failed',
    allowedActions: ['متابعة التذكرة', 'فتح سجل التصعيد', 'مراجعة الأدلة'],
    auditRequired: true,
    messagesPreview: [
      {
        id: 'msg-001',
        senderKind: 'client',
        senderLabel: 'محمد العتيبي',
        body: 'الكابتن لم يتواصل منذ 20 دقيقة والطلب لم يصل بعد.',
        timestampLabel: '10:43 ص',
      },
      {
        id: 'msg-002',
        senderKind: 'ops',
        senderLabel: 'فريق الدعم',
        body: 'تم استلام بلاغك. نتابع مع الكابتن الآن.',
        timestampLabel: '10:46 ص',
      },
      {
        id: 'msg-003',
        senderKind: 'ops',
        senderLabel: 'النظام',
        body: 'تم تصعيد الحالة — سيتواصل معك فريق الدعم خلال 5 دقائق.',
        timestampLabel: '10:51 ص',
        isSystem: true,
      },
    ],
  },
  {
    ticketId: 'TKT-002',
    ticketCode: '#TKT-002',
    subject: 'مشكلة كتالوج — باركود غير مرتبط',
    categoryLabel: 'Catalog conflict',
    outcomeLabel: 'Catalog review pending',
    status: 'in-review',
    priorityLabel: 'متوسطة',
    actorKind: 'partner',
    actorName: 'مطعم النجوم',
    entityType: 'catalog',
    entityId: 'CAT-881',
    ownerQueue: 'catalogs',
    slaLabel: 'يتبقى ساعتان',
    slaRisk: 'on-track',
    escalationOwner: 'control-panel',
    createdAtLabel: '2026-05-21 09:15',
    flowId: 'catalog-barcode-issue',
    allowedActions: ['مراجعة الكتالوج', 'طلب إثبات ميداني', 'تصعيد لقسم الكتالوجات'],
    auditRequired: false,
    messagesPreview: [
      {
        id: 'msg-004',
        senderKind: 'partner',
        senderLabel: 'مطعم النجوم',
        body: 'باركود المنتج CAT-881-SKU-04 لم يُربط بالكتالوج الرئيسي بعد الإدخال الميداني.',
        timestampLabel: '09:15 ص',
      },
      {
        id: 'msg-005',
        senderKind: 'ops',
        senderLabel: 'فريق الدعم',
        body: 'تم استلام الطلب. نحوّله لقسم الكتالوجات لمراجعة الربط.',
        timestampLabel: '09:22 ص',
      },
    ],
  },
  {
    ticketId: 'TKT-003',
    ticketCode: '#TKT-003',
    subject: 'عميل غير متجاوب — محاولة تسليم ORD-4366',
    categoryLabel: 'Customer unreachable',
    outcomeLabel: 'Ops follow-up in progress',
    status: 'open',
    priorityLabel: 'متوسطة',
    actorKind: 'captain',
    actorName: 'الكابتن ناصر',
    entityType: 'delivery',
    entityId: 'ORD-4366',
    ownerQueue: 'operations',
    slaLabel: 'ضمن SLA',
    slaRisk: 'on-track',
    escalationOwner: 'control-panel',
    createdAtLabel: '2026-05-21 10:18',
    flowId: 'customer-not-responding',
    allowedActions: ['تثبيت محاولة التواصل', 'فتح مسار التصعيد'],
    auditRequired: false,
    messagesPreview: [
      {
        id: 'msg-006',
        senderKind: 'captain',
        senderLabel: 'الكابتن ناصر',
        body: 'وصلت للعنوان ولا يوجد رد على المكالمات أو الرسائل.',
        timestampLabel: '10:18 ص',
      },
      {
        id: 'msg-007',
        senderKind: 'ops',
        senderLabel: 'فريق الدعم',
        body: 'حاول مرة أخرى خلال 3 دقائق ثم أبلغنا بالنتيجة.',
        timestampLabel: '10:20 ص',
      },
    ],
  },
];

export function getDshSupportTicketById(ticketId: string): DshSupportTicket | undefined {
  return DSH_DEMO_SUPPORT_TICKETS.find((t) => t.ticketId === ticketId);
}

// -----------------------------------------------------------------------------
// Call intake preview
// -----------------------------------------------------------------------------
export type DshCallIntakeReason =
  | 'late_order'
  | 'missing_item'
  | 'wrong_item'
  | 'payment_refund_visibility'
  | 'delivery_failed'
  | 'captain_behavior'
  | 'partner_behavior'
  | 'app_issue'
  | 'assisted_order_request'
  | 'other';

export type DshCallIntakeCloseOutcome =
  | 'resolved'
  | 'escalated'
  | 'follow_up_required'
  | 'transferred_to_ops'
  | 'duplicate'
  | 'blocked_identity';

export type DshCallIntakeVerificationStep = DshVerificationStep;

export type DshCallIntakePreview = {
  readonly intakeId: string;
  readonly source: 'external_phone_manual';
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly verificationSteps: readonly DshCallIntakeVerificationStep[];
  readonly sensitiveFieldsLocked: readonly string[];
  readonly orderContext?: string;
  readonly ticketContext?: string;
  readonly issueSummary: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly nextAction: string;
  readonly quickActions: readonly DshGlobalControlLink[];
  readonly lookupPanel: {
    readonly inputs: readonly DshLookupInput[];
    readonly previewClassification: DshPlaceholderStatus;
  };
  readonly callReasonSelector: {
    readonly selectedReason: DshCallIntakeReason;
    readonly options: readonly DshCallIntakeReason[];
    readonly previewClassification: DshPlaceholderStatus;
  };
  readonly identityVerificationResult: {
    readonly verificationStatus: DshVerificationStatus;
    readonly verificationSteps: readonly DshCallIntakeVerificationStep[];
    readonly sensitiveFieldsLocked: readonly string[];
    readonly previewClassification: DshPlaceholderStatus;
  };
  readonly ticketPreview: {
    readonly mode: 'create' | 'link';
    readonly ticketId: string;
    readonly summary: string;
    readonly routeHint: string;
    readonly auditRequired: boolean;
    readonly previewClassification: DshPlaceholderStatus;
  };
  readonly transferContextToOperations: readonly DshRouteHintedAction[];
  readonly closeCallOutcome: {
    readonly outcome: DshCallIntakeCloseOutcome;
    readonly summary: string;
    readonly auditRequired: boolean;
    readonly signal: DshSignalRoute;
    readonly previewClassification: DshPlaceholderStatus;
  };
  readonly auditRequired: boolean;
};

const CALL_REASON_OPTIONS: readonly DshCallIntakeReason[] = [
  'late_order',
  'missing_item',
  'wrong_item',
  'payment_refund_visibility',
  'delivery_failed',
  'captain_behavior',
  'partner_behavior',
  'app_issue',
  'assisted_order_request',
  'other',
] as const;

const manualCallAuditRequired = getDshSectionAuditPolicy('support-escalation');

function buildDshCallIntakeLookupInputs(values: {
  readonly phone: string;
  readonly orderId?: string;
  readonly customerId: string;
  readonly ticketId?: string;
}): readonly DshLookupInput[] {
  return [
    { key: 'phone', label: 'phone', value: values.phone, summaryFirst: true },
    { key: 'orderId', label: 'orderId', value: values.orderId ?? '—', summaryFirst: true },
    { key: 'customerId', label: 'customerId', value: values.customerId, summaryFirst: true },
    { key: 'ticketId', label: 'ticketId', value: values.ticketId ?? '—', summaryFirst: true },
  ] as const;
}

export const DSH_CALL_INTAKE_PREVIEW: readonly DshCallIntakePreview[] = [
  {
    intakeId: 'call-9021',
    source: 'external_phone_manual',
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    verificationSteps: [
      { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: true },
      { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: true },
      { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: true },
    ],
    sensitiveFieldsLocked: ['العنوان الكامل', 'عرض WLT المالي', 'أوامر الاسترداد'],
    orderContext: 'ORD-1184',
    ticketContext: 'TKT-1184',
    issueSummary: 'العميل يريد assisted order request من مكالمة خارجية بعد تعثر التطبيق.',
    allowedActions: ['تثبيت المصدر اليدوي', 'فتح Customer 360', 'ربط أو إنشاء ticket preview', 'تحويل إلى العمليات'],
    forbiddenActions: ['تغيير source', 'إظهار الحقول الحساسة قبل التحقق', 'بدء refund أو settlement'],
    onDemandPolicy: 'detail-on-open',
    nextAction: 'أنشئ معاينة تذكرة ثم حوّل الحالة إلى مساعدة الطلب مع السياق الكامل.',
    quickActions: [
      {
        actionId: 'customer-360',
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/support/customer-360',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'assisted-order',
        label: 'مساعدة الطلب',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
    ],
    lookupPanel: {
      inputs: buildDshCallIntakeLookupInputs({
        phone: '05*******44',
        orderId: 'ORD-1184',
        customerId: 'cus-4188',
        ticketId: 'TKT-1184',
      }),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    callReasonSelector: {
      selectedReason: 'assisted_order_request',
      options: CALL_REASON_OPTIONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    identityVerificationResult: {
      verificationStatus: 'verified',
      verificationSteps: [
        { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: true },
        { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: true },
        { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: true },
      ],
      sensitiveFieldsLocked: ['إبقاء WLT في وضع القراءة فقط حتى بعد التحقق'],
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    ticketPreview: {
      mode: 'create',
      ticketId: 'TKT-1184',
      summary: 'معاينة تذكرة فقط: مرتبطة بالطلب والعميل ومُصنَّفة للتسليم التشغيلي.',
      routeHint: '/support?workspace=queue&ticketId=TKT-1184',
      auditRequired: true,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    transferContextToOperations: [
      {
        actionId: 'transfer-assisted-order',
        label: 'to assisted-order-desk',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-order-rescue',
        label: 'to order-rescue',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184&callId=call-9021',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-support-escalation',
        label: 'to support escalation',
        routeHint: '/support?workspace=escalation&ticketId=TKT-1184',
        routeId: 'cp/support/escalation',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
    ],
    closeCallOutcome: {
      outcome: 'transferred_to_ops',
      summary: 'المكالمة انتهت بتحويل واضح إلى العمليات بعد تحقق الهوية وتثبيت السبب.',
      auditRequired: true,
      signal: buildDshSignalRoute('manual_call_intake_requested'),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    auditRequired: manualCallAuditRequired,
  },
  {
    intakeId: 'call-4410',
    source: 'external_phone_manual',
    customerId: 'cus-9910',
    customerName: 'سارة الحربي',
    maskedPhone: '05*******92',
    verificationSteps: [
      { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: false },
      { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: false },
      { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: false },
    ],
    sensitiveFieldsLocked: ['العنوان الكامل', 'طريقة الدفع', 'رؤية WLT'],
    ticketContext: 'TKT-4410',
    issueSummary: 'المتصل يريد payment/refund visibility بلا تحقق مكتمل.',
    allowedActions: ['طلب تحقق إضافي', 'ربط ticket موجود', 'تصعيد للدعم عند الهوية المحجوبة'],
    forbiddenActions: ['إظهار قرار الاسترداد', 'بدء assisted order', 'افتراض incoming call popup'],
    onDemandPolicy: 'detail-on-open',
    nextAction: 'ابقِ الحقول الحساسة محجوبة واربط المكالمة بتذكرة الدعم بدلاً من أي تسليم تشغيلي مباشر.',
    quickActions: [
      {
        actionId: 'support-ticket',
        label: 'Support ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-4410&callId=call-4410',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'wlt-visibility',
        label: 'WLT control',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&customerId=cus-9910',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'detail-on-open',
        readOnly: true,
      },
    ],
    lookupPanel: {
      inputs: buildDshCallIntakeLookupInputs({
        phone: '05*******92',
        customerId: 'cus-9910',
        ticketId: 'TKT-4410',
      }),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    callReasonSelector: {
      selectedReason: 'payment_refund_visibility',
      options: CALL_REASON_OPTIONS,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    identityVerificationResult: {
      verificationStatus: 'blocked',
      verificationSteps: [
        { stepId: 'last-order-check', label: 'تأكيد آخر طلب أو OTP مختصر', completed: false },
        { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: false },
        { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: false },
      ],
      sensitiveFieldsLocked: ['payment visibility', 'refund visibility', 'address details'],
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    ticketPreview: {
      mode: 'link',
      ticketId: 'TKT-4410',
      summary: 'Link existing ticket preview only and enable active WLT finance control.',
      routeHint: '/support?workspace=queue&ticketId=TKT-4410',
      auditRequired: true,
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    transferContextToOperations: [
      {
        actionId: 'transfer-assisted-order-blocked',
        label: 'to assisted-order-desk',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-9910&ticketId=TKT-4410&callId=call-4410',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-order-rescue-blocked',
        label: 'to order-rescue',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-9910&ticketId=TKT-4410&callId=call-4410',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'transfer-support-escalation-blocked',
        label: 'to support escalation',
        routeHint: '/support?workspace=escalation&ticketId=TKT-4410',
        routeId: 'cp/support/escalation',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
    ],
    closeCallOutcome: {
      outcome: 'blocked_identity',
      summary: 'الهوية لم تكتمل، لذا أغلقت المكالمة كحالة blocked identity مع بقاء WLT مرجعًا فقط.',
      auditRequired: true,
      signal: buildDshSignalRoute('manual_call_intake_requested'),
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    auditRequired: manualCallAuditRequired,
  },
] as const;

export function getDshCallIntakePreview(intakeId: string): DshCallIntakePreview | undefined {
  return DSH_CALL_INTAKE_PREVIEW.find((entry) => entry.intakeId === intakeId);
}

export function getDshCallIntakeByContext(context: {
  readonly intakeId?: string | null;
  readonly customerId?: string | null;
  readonly orderId?: string | null;
  readonly ticketId?: string | null;
}): DshCallIntakePreview | undefined {
  if (context.intakeId) {
    const byId = getDshCallIntakePreview(context.intakeId);
    if (byId) {
      return byId;
    }
  }

  return DSH_CALL_INTAKE_PREVIEW.find((entry) => {
    if (context.customerId && entry.customerId === context.customerId) {
      return true;
    }

    if (context.orderId && entry.orderContext === context.orderId) {
      return true;
    }

    if (context.ticketId && entry.ticketContext === context.ticketId) {
      return true;
    }

    return false;
  });
}

// -----------------------------------------------------------------------------
// Customer 360 preview
// -----------------------------------------------------------------------------
export type DshCustomer360VerificationStatus = DshVerificationStatus;

export type DshCustomer360TicketFilterStatus = 'open' | 'resolved' | 'escalated';

export type DshCustomer360TimelineNoteSource = 'support note' | 'ops note' | 'audit note';

export type DshCustomer360OrderSummary = {
  readonly orderId: string;
  readonly store: string;
  readonly deliveryMode: DshFulfillmentDeliveryMode;
  readonly deliveryModeLabel: string;
  readonly lifecycleStatus: string;
  readonly paymentVisibility: string;
  readonly refundVisibility: string;
  readonly latestTicket: string;
  readonly primaryAction: DshRouteHintedAction;
};

export type DshCustomer360TicketHistoryEntry = {
  readonly ticketId: string;
  readonly status: DshCustomer360TicketFilterStatus;
  readonly statusLabel: string;
  readonly sla: string;
  readonly owner: string;
  readonly latestNote: string;
  readonly routeHint: string;
};

export type DshCustomer360NoteEntry = {
  readonly noteId: string;
  readonly source: DshCustomer360TimelineNoteSource;
  readonly body: string;
  readonly timestampLabel: string;
};

export type DshCustomer360Record = {
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly cityLabel: string;
  readonly verificationStatus: DshCustomer360VerificationStatus;
  readonly activeOrderId?: string;
  readonly openTicketId?: string;
  readonly latestIssueSummary: string;
  readonly wltVisibilitySummary: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly quickActions: readonly DshGlobalControlLink[];
  readonly searchFilters: {
    readonly lookupInputs: readonly DshLookupInput[];
    readonly dateRangeLabel: string;
    readonly deliveryMode: DshFulfillmentDeliveryMode;
    readonly ticketStatus: DshCustomer360TicketFilterStatus;
    readonly wltVisibilityLabel: string;
    readonly areaZoneLabel: string;
    readonly previewClassification: DshPlaceholderStatus;
  };
  readonly lastFiveOrdersSummary: readonly DshCustomer360OrderSummary[];
  readonly ticketsHistory: readonly DshCustomer360TicketHistoryEntry[];
  readonly wltReadOnlyVisibility: DshReadOnlyFinanceVisibility;
  readonly addressServiceability: {
    readonly lastAddress: string;
    readonly serviceabilityStatus: 'serviceable' | 'blocked';
    readonly outOfZoneReason?: string;
    readonly previewClassification: DshPlaceholderStatus;
  };
  readonly notesTimeline: readonly DshCustomer360NoteEntry[];
  readonly contextSignal: ReturnType<typeof buildDshSignalRoute>;
};

function buildDshCustomer360LookupInputs(values: {
  readonly phone: string;
  readonly customerId: string;
  readonly orderId?: string;
  readonly ticketId?: string;
}): readonly DshLookupInput[] {
  return [
    { key: 'phone', label: 'phone', value: values.phone, summaryFirst: true },
    { key: 'customerId', label: 'customerId', value: values.customerId, summaryFirst: true },
    { key: 'orderId', label: 'orderId', value: values.orderId ?? '—', summaryFirst: true },
    { key: 'ticketId', label: 'ticketId', value: values.ticketId ?? '—', summaryFirst: true },
  ] as const;
}

function orderAction(routeHint: string, routeId: string, label: string): DshRouteHintedAction {
  return {
    actionId: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    routeHint,
    routeId,
    onDemandPolicy: 'detail-on-open',
  };
}

export const DSH_CUSTOMER_360_PREVIEW: readonly DshCustomer360Record[] = [
  {
    customerId: 'cus-9021',
    customerName: 'لمى ناصر',
    maskedPhone: '05*******18',
    cityLabel: 'الرياض',
    verificationStatus: 'verified',
    activeOrderId: 'ORD-1102',
    openTicketId: 'TKT-1102',
    latestIssueSummary: 'بديل منتج بانتظار تثبيت نهائي قبل إرسال الطلب.',
    wltVisibilitySummary: 'المدفوعات والاستردادات والتسوية تظهر هنا كمرجع WLT للقراءة فقط.',
    allowedActions: ['فتح مساعدة الطلب', 'فتح إنقاذ الطلب', 'فتح التذكرة أو الطلب أو مرجعية WLT'],
    forbiddenActions: ['بدء refund من Customer 360', 'إظهار PII غير المتحقق منها', 'نسخ payloads مالية داخل الشاشة'],
    onDemandPolicy: 'detail-on-open',
    quickActions: [
      {
        actionId: 'open-active-order',
        label: 'open active order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=live-orders&orderId=ORD-1102&customerId=cus-9021&ticketId=TKT-1102',
        routeId: 'cp/operations/live-orders',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'create-ticket',
        label: 'create ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-1102',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'open-assisted-order',
        label: 'open assisted order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-9021&orderId=ORD-1102&ticketId=TKT-1102',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-order-rescue',
        label: 'open order rescue',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-9021&orderId=ORD-1102&ticketId=TKT-1102',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-manual-call-intake',
        label: 'open manual call intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&customerId=cus-9021&orderId=ORD-1102&ticketId=TKT-1102',
        routeId: 'cp/support/call-intake',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'open-wlt-visibility',
        label: 'open WLT control',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'detail-on-open',
        readOnly: true,
      },
    ],
    searchFilters: {
      lookupInputs: buildDshCustomer360LookupInputs({
        phone: '05*******18',
        customerId: 'cus-9021',
        orderId: 'ORD-1102',
        ticketId: 'TKT-1102',
      }),
      dateRangeLabel: 'آخر 30 يومًا',
      deliveryMode: 'bthwani_delivery',
      ticketStatus: 'escalated',
      wltVisibilityLabel: 'payment + refund + settlement visibility',
      areaZoneLabel: 'الرياض / الياسمين',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    lastFiveOrdersSummary: [
      {
        orderId: 'ORD-1102',
        store: 'سوبرماركت الواحة',
        deliveryMode: 'bthwani_delivery',
        deliveryModeLabel: 'توصيل بثواني',
        lifecycleStatus: 'partner_confirmation_pending',
        paymentVisibility: 'Paid snapshot visible',
        refundVisibility: 'No refund pending',
        latestTicket: 'TKT-1102',
        primaryAction: orderAction('/operations?workspace=assisted-order-desk&orderId=ORD-1102&customerId=cus-9021&ticketId=TKT-1102', 'cp/operations/assisted-order-desk', 'Open assisted order'),
      },
      {
        orderId: 'ORD-1081',
        store: 'حلويات قصر الشام',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'delivered',
        paymentVisibility: 'COD snapshot visible',
        refundVisibility: 'Refund completed in WLT',
        latestTicket: 'TKT-1041',
        primaryAction: orderAction('/support?workspace=queue&ticketId=TKT-1041', 'cp/support/ticket', 'Open ticket'),
      },
      {
        orderId: 'ORD-1018',
        store: 'مخبز الفجر',
        deliveryMode: 'pickup',
        deliveryModeLabel: 'استلام بنفسي',
        lifecycleStatus: 'pickup_ready',
        paymentVisibility: 'Prepaid snapshot visible',
        refundVisibility: 'No refund ticket',
        latestTicket: '—',
        primaryAction: orderAction('/operations?workspace=live-orders&orderId=ORD-1018&customerId=cus-9021', 'cp/operations/live-orders', 'Open active order'),
      },
      {
        orderId: 'ORD-0997',
        store: 'بقالة الريف',
        deliveryMode: 'bthwani_delivery',
        deliveryModeLabel: 'توصيل بثواني',
        lifecycleStatus: 'delivery_failed',
        paymentVisibility: 'Paid snapshot visible',
        refundVisibility: 'Refund review requested',
        latestTicket: 'TKT-0997',
        primaryAction: orderAction('/operations?workspace=order-rescue&orderId=ORD-0997&customerId=cus-9021&ticketId=TKT-0997', 'cp/operations/order-rescue', 'Open order rescue'),
      },
      {
        orderId: 'ORD-0932',
        store: 'محمصة المدينة',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'resolved',
        paymentVisibility: 'Wallet snapshot visible',
        refundVisibility: 'No refund action',
        latestTicket: 'TKT-0932',
        primaryAction: orderAction('/support?workspace=call-intake&customerId=cus-9021&ticketId=TKT-0932', 'cp/support/call-intake', 'Open manual call intake'),
      },
    ],
    ticketsHistory: [
      { ticketId: 'TKT-1102', status: 'escalated', statusLabel: 'مصعّد', sla: '5 دقائق', owner: 'عمليات', latestNote: 'بانتظار تثبيت البديل', routeHint: '/support?workspace=queue&ticketId=TKT-1102' },
      { ticketId: 'TKT-1041', status: 'resolved', statusLabel: 'محلول', sla: 'أغلق خلال 18 دقيقة', owner: 'دعم', latestNote: 'اكتمل التوضيح للعميل', routeHint: '/support?workspace=queue&ticketId=TKT-1041' },
      { ticketId: 'TKT-0997', status: 'open', statusLabel: 'مفتوح', sla: '12 دقيقة', owner: 'دعم', latestNote: 'تحويل إلى إنقاذ الطلب', routeHint: '/support?workspace=queue&ticketId=TKT-0997' },
    ],
    wltReadOnlyVisibility: {
      paymentVisibility: 'Payment snapshot is read-only from WLT.',
      refundVisibility: 'Refund execution remains WLT-owned; DSH displays status only.',
      settlementVisibility: 'Settlement remains WLT-owned; DSH displays status only.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
      onDemandPolicy: 'detail-on-open',
      placeholderClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    addressServiceability: {
      lastAddress: 'الرياض - الياسمين - شارع الثمامة',
      serviceabilityStatus: 'serviceable',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    notesTimeline: [
      { noteId: 'note-1102-1', source: 'support note', body: 'تم تأكيد أن البديل مناسب قبل أي submit preview.', timestampLabel: 'منذ 18 دقيقة' },
      { noteId: 'note-1102-2', source: 'ops note', body: 'العمليات تراجع serviceability فقط ولا تنفذ أي أثر مالي.', timestampLabel: 'منذ 12 دقيقة' },
      { noteId: 'note-1102-3', source: 'audit note', body: 'سبب التدخل موثق ضمن سجل assisted-order.', timestampLabel: 'منذ 10 دقائق' },
    ],
    contextSignal: buildDshSignalRoute('customer_360_followup'),
  },
  {
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    cityLabel: 'جدة',
    verificationStatus: 'required',
    activeOrderId: 'ORD-1184',
    openTicketId: 'TKT-1184',
    latestIssueSummary: 'مكالمة خارجية لإنشاء طلب مساعد مع حساسية بيانات مرتفعة.',
    wltVisibilitySummary: 'لا تظهر أي تفاصيل مالية حساسة قبل التحقق. WLT يبقى مرجعًا منفصلًا.',
    allowedActions: ['بدء Call Intake', 'فتح ticket support', 'ربط العميل بطلبه النشط'],
    forbiddenActions: ['إظهار العنوان الكامل قبل التحقق', 'تجاوز source = external_phone_manual', 'بدء money mutation'],
    onDemandPolicy: 'detail-on-open',
    quickActions: [
      {
        actionId: 'open-active-order',
        label: 'open active order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=live-orders&orderId=ORD-1184&customerId=cus-4188&ticketId=TKT-1184',
        routeId: 'cp/operations/live-orders',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'create-ticket',
        label: 'create ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-1184',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'open-assisted-order',
        label: 'open assisted order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-order-rescue',
        label: 'open order rescue',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-manual-call-intake',
        label: 'open manual call intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/support/call-intake',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'open-wlt-visibility',
        label: 'open WLT control',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'detail-on-open',
        readOnly: true,
      },
    ],
    searchFilters: {
      lookupInputs: buildDshCustomer360LookupInputs({
        phone: '05*******44',
        customerId: 'cus-4188',
        orderId: 'ORD-1184',
        ticketId: 'TKT-1184',
      }),
      dateRangeLabel: 'آخر 14 يومًا',
      deliveryMode: 'pickup',
      ticketStatus: 'open',
      wltVisibilityLabel: 'payment/refund visibility on open only',
      areaZoneLabel: 'جدة / الروضة',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    lastFiveOrdersSummary: [
      {
        orderId: 'ORD-1184',
        store: 'متجر النخبة',
        deliveryMode: 'pickup',
        deliveryModeLabel: 'استلام بنفسي',
        lifecycleStatus: 'identity_verification_required',
        paymentVisibility: 'Hidden until verification',
        refundVisibility: 'Hidden until verification',
        latestTicket: 'TKT-1184',
        primaryAction: orderAction('/support?workspace=call-intake&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184', 'cp/support/call-intake', 'Open manual call intake'),
      },
      {
        orderId: 'ORD-1170',
        store: 'بيت العصائر',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'delivered',
        paymentVisibility: 'Card snapshot visible',
        refundVisibility: 'No refund ticket',
        latestTicket: '—',
        primaryAction: orderAction('/operations?workspace=live-orders&orderId=ORD-1170&customerId=cus-4188', 'cp/operations/live-orders', 'Open active order'),
      },
      {
        orderId: 'ORD-1151',
        store: 'صيدلية الرحاب',
        deliveryMode: 'bthwani_delivery',
        deliveryModeLabel: 'توصيل بثواني',
        lifecycleStatus: 'delivery_failed',
        paymentVisibility: 'Paid snapshot visible',
        refundVisibility: 'Refund review pending in WLT',
        latestTicket: 'TKT-1151',
        primaryAction: orderAction('/operations?workspace=order-rescue&orderId=ORD-1151&customerId=cus-4188&ticketId=TKT-1151', 'cp/operations/order-rescue', 'Open order rescue'),
      },
      {
        orderId: 'ORD-1123',
        store: 'مخبوزات الشرق',
        deliveryMode: 'pickup',
        deliveryModeLabel: 'استلام بنفسي',
        lifecycleStatus: 'resolved',
        paymentVisibility: 'Wallet snapshot visible',
        refundVisibility: 'No refund',
        latestTicket: 'TKT-1123',
        primaryAction: orderAction('/support?workspace=queue&ticketId=TKT-1123', 'cp/support/ticket', 'Open ticket'),
      },
      {
        orderId: 'ORD-1087',
        store: 'فاكهة اليوم',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'cancelled',
        paymentVisibility: 'Card snapshot visible',
        refundVisibility: 'Refund completed in WLT',
        latestTicket: 'TKT-1087',
        primaryAction: orderAction('/finance?workspace=refunds&orderId=ORD-1087', 'cp/finance/refunds', 'Open WLT visibility'),
      },
    ],
    ticketsHistory: [
      { ticketId: 'TKT-1184', status: 'open', statusLabel: 'مفتوح', sla: '9 دقائق', owner: 'Support', latestNote: 'العميل يحتاج تحققًا إضافيًا', routeHint: '/support?workspace=queue&ticketId=TKT-1184' },
      { ticketId: 'TKT-1151', status: 'escalated', statusLabel: 'مصعّد', sla: '4 دقائق', owner: 'Operations', latestNote: 'تحويل إلى rescue بسبب delivery failed', routeHint: '/support?workspace=queue&ticketId=TKT-1151' },
      { ticketId: 'TKT-1123', status: 'resolved', statusLabel: 'resolved view', sla: 'أغلق خلال 11 دقيقة', owner: 'Support', latestNote: 'أُغلق بعد توضيح حالة pickup', routeHint: '/support?workspace=queue&ticketId=TKT-1123' },
    ],
    wltReadOnlyVisibility: {
      paymentVisibility: 'Payment visibility remains read-only from WLT after verification completes.',
      refundVisibility: 'Refund visibility only; execution remains WLT-owned.',
      settlementVisibility: 'Settlement remains WLT-owned; DSH displays status only.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
      onDemandPolicy: 'detail-on-open',
      placeholderClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    addressServiceability: {
      lastAddress: 'جدة - الروضة - شارع الأمير سلطان',
      serviceabilityStatus: 'blocked',
      outOfZoneReason: 'آخر عنوان نشط لا يدعم bthwani_delivery حاليًا، ويحتاج pickup أو partner_delivery.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    notesTimeline: [
      { noteId: 'note-1184-1', source: 'support note', body: 'المكالمة الخارجية مثبتة كمصدر وحيد لهذه الحالة.', timestampLabel: 'منذ 21 دقيقة' },
      { noteId: 'note-1184-2', source: 'ops note', body: 'العمليات لن تتابع الحالة قبل اكتمال التحقق أو تحويلها رسميًا.', timestampLabel: 'منذ 15 دقيقة' },
      { noteId: 'note-1184-3', source: 'audit note', body: 'أي تسليم لاحق يجب أن يحمل ملاحظة المشغل وسبباً واضحين.', timestampLabel: 'منذ 11 دقيقة' },
    ],
    contextSignal: buildDshSignalRoute('customer_360_followup'),
  },
] as const;

export function getDshCustomer360Record(customerId: string): DshCustomer360Record | undefined {
  return DSH_CUSTOMER_360_PREVIEW.find((entry) => entry.customerId === customerId);
}

export function getDshCustomer360ByContext(context: {
  readonly customerId?: string | null;
  readonly orderId?: string | null;
  readonly ticketId?: string | null;
}): DshCustomer360Record | undefined {
  if (context.customerId) {
    const byCustomer = getDshCustomer360Record(context.customerId);
    if (byCustomer) {
      return byCustomer;
    }
  }

  return DSH_CUSTOMER_360_PREVIEW.find((entry) => {
    if (context.orderId && entry.lastFiveOrdersSummary.some((order) => order.orderId === context.orderId)) {
      return true;
    }

    if (context.ticketId && entry.ticketsHistory.some((ticket) => ticket.ticketId === context.ticketId)) {
      return true;
    }

    return false;
  });
}

export function getDshCustomer360SectionOwnerLabel(sectionId: DshControlPanelSectionId): string {
  if (sectionId === 'operations') {
    return 'Operations';
  }

  if (sectionId === 'finance') {
    return 'WLT visibility';
  }

  return 'Support';
}

// -----------------------------------------------------------------------------
// Ops intervention playbooks
// -----------------------------------------------------------------------------
export type DshOpsInterventionPlaybook = {
  readonly playbookId: string;
  readonly title: string;
  readonly severity: 'warning' | 'danger';
  readonly supportedWorkspaces: readonly ('command-center' | 'exceptions-escalations' | 'assisted-order-desk' | 'order-rescue')[];
  readonly triggerFlowIds: readonly string[];
  readonly ownerSection: DshControlPanelSectionId;
  readonly checkpoints: readonly string[];
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly nextDecision: string;
  readonly onDemandPolicy: DshOnDemandPolicy;
};

export const DSH_OPS_INTERVENTION_PLAYBOOKS: readonly DshOpsInterventionPlaybook[] = [
  {
    playbookId: 'playbook-assisted-order',
    title: 'خطة التدخل: مساعدة الطلب من مكالمة يدوية',
    severity: 'warning',
    supportedWorkspaces: ['command-center', 'assisted-order-desk'],
    triggerFlowIds: ['manual-call-intake', 'customer-360', 'assisted-order-desk'],
    ownerSection: 'operations',
    checkpoints: ['تحقق الهوية', 'إعادة بناء السلة', 'تثبيت البديل', 'مرجعية WLT فقط عند الحاجة'],
    allowedActions: ['فتح مساعدة الطلب', 'التحويل إلى الدعم أو مرجعية WLT', 'تسجيل ملاحظة تدقيق'],
    forbiddenActions: ['تجاوز التحقق', 'إنشاء استرداد محلي', 'إرسال الطلب بدون تسليم واضح للمالك'],
    nextDecision: 'إذا بقيت الهوية أو البدائل معلقة فحوّل الحالة إلى إنقاذ الطلب بدل تكرار نفس التدخل.',
    onDemandPolicy: 'detail-on-open',
  },
  {
    playbookId: 'playbook-order-rescue',
    title: 'خطة التدخل: إنقاذ الطلب متعدد الأسطح',
    severity: 'danger',
    supportedWorkspaces: ['command-center', 'exceptions-escalations', 'order-rescue'],
    triggerFlowIds: ['order-rescue', 'client-order-issue', 'delivery-failed', 'partner-finance-bridge'],
    ownerSection: 'operations',
    checkpoints: ['حدد السطح المالك', 'ثبّت المعوق الرئيسي', 'افتح التذكرة أو الشريك أو WLT المرجعي', 'أغلق التشتت'],
    allowedActions: ['تحديد أفضل إجراء تالٍ', 'تثبيت تسليم المالك الصحيح', 'ربط التذكرة أو مرجعية WLT'],
    forbiddenActions: ['فتح أكثر من قرار مالك متضارب', 'إغلاق الإنقاذ قبل معوق واضح', 'تعديل مالي'],
    nextDecision: 'أرسل الحالة إلى المالك النهائي مع سجل مراجعة مختصر بدل تدويرها بين الأقسام.',
    onDemandPolicy: 'detail-on-open',
  },
  {
    playbookId: 'playbook-partner-capacity',
    title: 'خطة التدخل: تراجع السعة أو إيقاف مؤقت للشريك',
    severity: 'warning',
    supportedWorkspaces: ['command-center', 'exceptions-escalations'],
    triggerFlowIds: ['partner_capacity_degraded', 'order-ready', 'item-unavailable'],
    ownerSection: 'partners',
    checkpoints: ['حدد أثر السعة', 'راجع pause/closure window', 'حدّد ما إذا كانت المشكلة عملياتية أم شريكًا'],
    allowedActions: ['فتح قسم الشركاء', 'إحالة catalog conflict', 'تفعيل safe fallback'],
    forbiddenActions: ['معالجة dispute في العمليات', 'نشر catalog workaround بدون owner catalogs'],
    nextDecision: 'إذا كان العائق catalog أو dispute فانقل الحالة مباشرة إلى القسم المالك بدل إبقائها داخل العمليات.',
    onDemandPolicy: 'summary-only',
  },
] as const;

export function getDshOpsInterventionPlaybook(playbookId: string): DshOpsInterventionPlaybook | undefined {
  return DSH_OPS_INTERVENTION_PLAYBOOKS.find((entry) => entry.playbookId === playbookId);
}

// -----------------------------------------------------------------------------
// Client notifications
// -----------------------------------------------------------------------------
export type DshNotificationFixture = {
  id: string;
  title: string;
  subtitle: string;
  meta: string; // ISO string or preview timestamp
  badgeLabel: string;
  category: 'order' | 'bell' | 'support' | 'offer' | 'subscription' | 'wallet' | 'system';
  readState?: 'unread' | 'read';
  priority?: 'normal' | 'important' | 'urgent';
  actionTarget: 'benefits' | 'tracking' | 'orders-list' | 'search' | 'none';
  relativeTime?: string; // human readable preview
  timeGroup?: 'now' | 'today' | 'yesterday' | 'earlier';
  retentionPolicy?: { days?: number; hours?: number; note?: string };
  fulfillmentMode?: 'bthwani_delivery' | 'partner_delivery' | 'pickup'; // mode that generated this notification
};

/**
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source
 */
export const dshNotificationsFixturesDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
} as const;

export const dshNotificationsFixtures: DshNotificationFixture[] = [
  {
    id: 'notif-1',
    title: 'تحديث الاشتراك',
    subtitle: 'تمت مزامنة باقة بثواني برو داخل DSH بنجاح.',
    meta: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    relativeTime: 'منذ 2 ساعة',
    timeGroup: 'today',
    badgeLabel: 'اشتراك',
    category: 'subscription',
    readState: 'unread',
    priority: 'normal',
    actionTarget: 'benefits',
    retentionPolicy: { days: 30, note: 'اشتراك: 30 يومًا' },
  },
  {
    id: 'notif-2',
    title: 'طلب رقم 3770204 في الطريق',
    subtitle: 'الكابتن في الطريق لاستلام الطلب. اضغط للمتابعة.',
    meta: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    relativeTime: 'منذ 30 دقيقة',
    timeGroup: 'now',
    badgeLabel: 'طلب',
    category: 'order',
    readState: 'unread',
    priority: 'important',
    actionTarget: 'tracking',
    retentionPolicy: { hours: 48, note: 'حتى انتهاء الطلب + 24 ساعة' },
    fulfillmentMode: 'bthwani_delivery',
  },
  {
    id: 'notif-3',
    title: 'تنبيه داخل الطلب',
    subtitle: 'تم تحديث حالة الطلب رقم 3770204 ضمن مسار توصيل المتجر.',
    meta: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    relativeTime: 'منذ 90 دقيقة',
    timeGroup: 'today',
    badgeLabel: 'جرس',
    category: 'bell',
    readState: 'read',
    priority: 'normal',
    actionTarget: 'tracking',
    retentionPolicy: { hours: 6, note: 'جرس: حتى 6 ساعات' },
    fulfillmentMode: 'partner_delivery',
  },
  {
    id: 'notif-4',
    title: 'بلاغ دعم جديد',
    subtitle: 'تم إنشاء بلاغ دعم لأن موصل المتجر تأخر في التسليم. اضغط للاطلاع.',
    meta: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    relativeTime: 'منذ يوم',
    timeGroup: 'yesterday',
    badgeLabel: 'دعم',
    category: 'support',
    readState: 'unread',
    priority: 'urgent',
    actionTarget: 'tracking',
    retentionPolicy: { days: 3, note: 'دعم: حتى 72 ساعة' },
    fulfillmentMode: 'partner_delivery',
  },
  {
    id: 'notif-5',
    title: 'عرض: خصم 20% على المطاعم',
    subtitle: 'عرض جديد متاح الآن على صفحة العروض.',
    meta: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    relativeTime: 'منذ 5 ساعات',
    timeGroup: 'today',
    badgeLabel: 'عرض',
    category: 'offer',
    readState: 'read',
    priority: 'normal',
    actionTarget: 'search',
    retentionPolicy: { days: 7, note: 'عرض: حتى 7 أيام' },
  },
  {
    id: 'notif-6',
    title: 'استرداد / رصيد محفظة',
    subtitle: 'تم إضافة رصيد 10 ر.ي إلى محفظتك.',
    meta: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    relativeTime: 'منذ 10 دقائق',
    timeGroup: 'now',
    badgeLabel: 'محفظة',
    category: 'wallet',
    readState: 'unread',
    priority: 'normal',
    actionTarget: 'orders-list',
    retentionPolicy: { days: 30, note: 'محفظة: 30 يومًا' },
  },
  {
    id: 'notif-7',
    title: 'موصل المتجر وصل',
    subtitle: 'موصل المتجر وصل لموقعك. يرجى الاستلام.',
    meta: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    relativeTime: 'منذ 5 دقائق',
    timeGroup: 'now',
    badgeLabel: 'طلب',
    category: 'order',
    readState: 'unread',
    priority: 'important',
    actionTarget: 'tracking',
    retentionPolicy: { hours: 24 + 24, note: 'حتى انتهاء الطلب + 24 ساعة' },
    fulfillmentMode: 'partner_delivery',
  },
  {
    id: 'notif-8',
    title: 'اشتراك بثواني برو',
    subtitle: 'تم تفعيل باقة بثواني برو.',
    meta: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    relativeTime: 'منذ 10 أيام',
    timeGroup: 'earlier',
    badgeLabel: 'اشتراك',
    category: 'subscription',
    readState: 'read',
    priority: 'normal',
    actionTarget: 'benefits',
    retentionPolicy: { days: 30, note: 'اشتراك: 30 يومًا' },
  },
  {
    id: 'notif-9',
    title: 'تنبيه جرس داخل الطلب',
    subtitle: 'جرس تنبيه: الطلب أصبح جاهزًا للاستلام من المتجر.',
    meta: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    relativeTime: 'منذ 6 ساعات',
    timeGroup: 'today',
    badgeLabel: 'جرس',
    category: 'bell',
    readState: 'read',
    priority: 'normal',
    actionTarget: 'tracking',
    retentionPolicy: { hours: 6, note: 'جرس: حتى 6 ساعات' },
    fulfillmentMode: 'pickup',
  },
  {
    id: 'notif-10',
    title: 'عرض: خصم خاص',
    subtitle: 'خصم محدود متاح الآن لفترة قصيرة.',
    meta: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    relativeTime: 'منذ يومين',
    timeGroup: 'yesterday',
    badgeLabel: 'عرض',
    category: 'offer',
    readState: 'read',
    priority: 'normal',
    actionTarget: 'search',
    retentionPolicy: { days: 7, note: 'عرض: حتى 7 أيام' },
  },
  {
    id: 'notif-11',
    title: 'بلاغ دعم تم استلامه',
    subtitle: 'فريق الدعم يتابع بلاغ جاهزية الطلب للاستلام من المتجر.',
    meta: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    relativeTime: 'منذ ساعتين',
    timeGroup: 'today',
    badgeLabel: 'دعم',
    category: 'support',
    readState: 'unread',
    priority: 'urgent',
    actionTarget: 'tracking',
    retentionPolicy: { days: 3, note: 'دعم: حتى 72 ساعة' },
    fulfillmentMode: 'pickup',
  },
];

export function selectDshControlPanelSupportPreview() {
  return {
    flows: DSH_OPERATIONS_SUPPORT_PREVIEW,
    tickets: DSH_DEMO_SUPPORT_TICKETS,
    callIntake: DSH_CALL_INTAKE_PREVIEW,
    customer360: DSH_CUSTOMER_360_PREVIEW,
    playbooks: DSH_OPS_INTERVENTION_PLAYBOOKS,
  };
}

// -----------------------------------------------------------------------------
// Ops approval panel — order-linked support chat tickets (DEV_ONLY)
// Authority: control-panel/operations -> OpsOrderDetailPanel (approval queue).
// attachmentRef: canonical ops proof ID — never a raw file path.
// Moved from surface-level OpsOrderDetailPanel.tsx to canonical support data.
// -----------------------------------------------------------------------------

export type DshOpsApprovalChatSender =
  | 'العميل'
  | 'الكابتن'
  | 'موصل المتجر'
  | 'المتجر'
  | 'النظام';

export type DshOpsApprovalChatMessage = {
  readonly sender: DshOpsApprovalChatSender;
  readonly text: string;
  readonly time: string;
};

export type DshOpsApprovalChatTicket = {
  readonly ticketId: string;
  readonly status: string;
  readonly statusTone: 'warning' | 'success' | 'danger';
  readonly type: string;
  readonly description: string;
  /** Canonical ops proof ID — resolved at render time; never a raw file path. */
  readonly attachmentRef: string | null;
  readonly chatHistory: readonly DshOpsApprovalChatMessage[];
};

/**
 * Ops approval chat tickets keyed by orderId.
 * DEV_ONLY — fictional preview entries only.
 * Consumed by: OpsOrderDetailPanel (control-panel/operations).
 */
export const DSH_OPS_APPROVAL_CHAT_TICKETS: Readonly<Record<string, DshOpsApprovalChatTicket>> = {
  'PA-0081': {
    ticketId: 'TK-4022',
    status: 'نشط / قيد المراجعة',
    statusTone: 'warning',
    type: 'تأخير في الاستلام من المتجر',
    description: 'الكابتن يفيد بازدحام شديد عند بوابة التحضير في بيك إن بريستو.',
    attachmentRef: 'ops-proof-pa0081',
    chatHistory: [
      { sender: 'العميل', text: 'مرحباً كابتن، هل استلمت الطلب؟ مكتوب في التطبيق قيد التحضير.', time: '10:11' },
      { sender: 'الكابتن', text: 'أهلاً بك يا غالي. نعم أنا متواجد بالمتجر الآن، لكن هناك ازدحام كبير جداً عند كاونتر الاستلام.', time: '10:12' },
      { sender: 'النظام', text: '🔔 تم قرع جرس تنبيه الكابتن من قبل العميل للاستفسار عن الحالة.', time: '10:13' },
      { sender: 'الكابتن', text: 'قمت برفع بلاغ دعم لتنبيه العمليات بتأخر المتجر في تسليم الأصناف.', time: '10:14' },
      { sender: 'العميل', text: 'شكراً جزيلاً لك على التوضيح والمتابعة، بانتظارك.', time: '10:15' },
    ],
  },
  'PA-0082': {
    ticketId: 'TK-4025',
    status: 'نشط / متابعة جاهزية الاستلام',
    statusTone: 'warning',
    type: 'الطلب غير جاهز في المتجر',
    description: 'العميل يسأل عن جاهزية الطلب قبل التوجه إلى المتجر.',
    attachmentRef: 'ops-proof-pa0082',
    chatHistory: [
      { sender: 'العميل', text: 'هل أصبح الطلب جاهزًا للاستلام من المتجر؟', time: '10:16' },
      { sender: 'المتجر', text: 'يتبقى بضع دقائق على الجاهزية. سنؤكد لك فور الانتهاء.', time: '10:17' },
      { sender: 'النظام', text: '🔔 تم تنبيه العمليات بوجود طلب استلام ذاتي بانتظار تأكيد الجاهزية.', time: '10:18' },
    ],
  },
};

/** Returns the ops approval chat ticket for orderId, with fallback for unknown orders. */
export function getDshOpsApprovalChatTicket(orderId: string): DshOpsApprovalChatTicket {
  return DSH_OPS_APPROVAL_CHAT_TICKETS[orderId] ?? {
    ticketId: 'TK-0000',
    status: 'لا يوجد بلاغات نشطة',
    statusTone: 'success' as const,
    type: 'عام',
    description: 'لا توجد بلاغات دعم مرتبطة بهذا الطلب.',
    attachmentRef: null,
    chatHistory: [],
  };
}
