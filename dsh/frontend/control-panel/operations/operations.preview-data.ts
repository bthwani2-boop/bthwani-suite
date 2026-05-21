import type { DshFulfillmentOperationalMode, DshOperationsOrderRow } from './operations.types';
import type { DshOrderLifecycleStatus } from '../../shared/dsh-order-journey.model';

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const operationsPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

export const OPERATIONS_PULSE_METRICS = [
  { id: 'command-center-open-orders', title: 'الطلبات المفتوحة', value: '128', description: 'الطلبات التي تتحرك داخل غرفة العمليات.', tone: 'brand' },
  { id: 'command-center-dispatch-risk', title: 'مخاطر الإسناد', value: '9', description: 'طلبات تحتاج إسنادًا يدويًا الآن.', tone: 'warning' },
  { id: 'command-center-captain-cover', title: 'تغطية الكباتن', value: '42', description: 'الكباتن المتاحون ظاهرون الآن.', tone: 'best' },
  { id: 'command-center-escalations', title: 'الاستثناءات', value: '17', description: 'استثناءات مفتوحة تنتظر مالكًا.', tone: 'danger' },
] as const;

export const LIVE_ORDERS_OPERATIONAL_PREVIEW = {
  summary: {
    awaitingAcknowledgement: 3,
    blockedRings: 2,
    ringLabel: 'تنبيه الوصول',
    actionHint: 'أعد الرنين ثم افتح الإسناد إذا بقي الطلب بلا رد.',
  },
  rows: [
    {
      id: 'LO-1024',
      fulfillmentMode: 'bthwani_delivery',
      status: 'قيد الإسناد',
      statusTone: 'warning',
      eta: '12 دقيقة',
      destination: 'متجر الرياض',
      captain: 'غير مسند',
      notes: 'الطلب ينتظر قرار الإسناد قبل أول رنين.',
      ringLabel: 'لم يؤكد الوصول',
      actionHint: 'أعد الرنين ثم افحص التغطية.',
      arrivalTimeline: ['قيد الوصول', 'الرنين الأول لم يؤكد', 'بانتظار رد مالك القرار'],
      actionPlans: ['افتح الإسناد', 'أرسل رنينًا جديدًا', 'صعّد للمشرف إذا بقي بلا مالك'],
      suggestion: {
        label: 'افتح الإسناد فورًا',
        reason: 'الطلب بلا كابتن والتأخير يتزايد.',
        confidence: 'high',
        action: 'فتح الإسناد',
        secondary: 'تواصل مع الدعم',
        auditRequired: false,
      },
    },
    {
      id: 'LO-1077',
      fulfillmentMode: 'bthwani_delivery',
      status: 'بانتظار إثبات',
      statusTone: 'danger',
      eta: '18 دقيقة',
      destination: 'مقهى الشرق',
      captain: 'خالد',
      notes: 'النقل متوقف حتى يصل إثبات الاستلام.',
      ringLabel: 'محجوب',
      actionHint: 'اطلب إثباتًا قبل الإغلاق.',
      arrivalTimeline: ['وصل الطلب', 'الرنين محجوب', 'الإثبات مطلوب قبل الإغلاق'],
      actionPlans: ['اطلب الإثبات', 'افتح الدعم', 'احتفظ بالسجل'],
      suggestion: {
        label: 'اطلب الإثبات الآن',
        reason: 'الإثبات مفقود والحل مرهون بالدعم.',
        confidence: 'high',
        action: 'طلب الإثبات',
        secondary: 'فتح الدعم',
        auditRequired: true,
      },
    },
    {
      id: 'LO-1099',
      fulfillmentMode: 'bthwani_delivery',
      status: 'في الطريق',
      statusTone: 'best',
      eta: '7 دقائق',
      destination: 'مخبز الورد',
      captain: 'سلمان',
      notes: 'النافذة ما زالت آمنة والتسليم قريب.',
      ringLabel: 'تنبيه الوصول',
      actionHint: 'راقب ETA ولا تصعيد الآن.',
      arrivalTimeline: ['الكابتن في الطريق', 'النافذة ما زالت آمنة', 'التسليم قريب'],
      actionPlans: ['راقب ETA', 'لا تصعيد الآن', 'افتح التفاصيل إذا تأخر'],
      suggestion: {
        label: 'تابع وقت التسليم',
        reason: 'الطلب في المسار الطبيعي ولا يحتاج تدخلًا الآن.',
        confidence: 'medium',
        action: 'مراقبة ETA',
        secondary: 'فتح التفاصيل',
        auditRequired: false,
      },
    },
  ] as const,
} as const;

export const DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW = {
  summary: {
    waitingAssignment: 6,
    availableCaptains: 4,
    readyForPickup: 3,
    dispatchBlockers: 2,
  },
  rows: [
    {
      id: 'DA-2001',
      status: 'طلبات بانتظار الإسناد',
      statusTone: 'warning',
      captain: 'سعد م.',
      distance: '1.2 كم',
      pickupEta: '5 دقائق',
      dropoffEta: '19 دقيقة',
      confidence: 'ثقة عالية',
      blocker: 'لا يوجد',
      readyForPickup: 'جاهز لمسار الاستلام',
      recommendation: 'أسند إلى سعد م. الآن',
      note: 'الأقرب والمتاح حاليًا.',
      actionPlans: ['تأكيد الإسناد', 'مراقبة الاستلام', 'تخفيف ضغط التوزيع'],
    },
    {
      id: 'DA-2002',
      status: 'يحتاج إعادة إسناد',
      statusTone: 'brand',
      captain: 'محمد ع.',
      distance: '0.8 كم',
      pickupEta: '2 دقيقة',
      dropoffEta: '16 دقيقة',
      confidence: 'ثقة عالية',
      blocker: 'أول كابتن رفض',
      readyForPickup: 'جاهز بعد إعادة التعيين',
      recommendation: 'أعد الإسناد لمحمد ع.',
      note: 'بديل أفضل مع وقت استجابة أقل.',
      actionPlans: ['إعادة التعيين', 'تخطي الرفض الأول', 'تثبيت الكابتن البديل'],
    },
    {
      id: 'DA-2003',
      status: 'نقص كباتن',
      statusTone: 'danger',
      captain: 'لا يوجد',
      distance: '-',
      pickupEta: '-',
      dropoffEta: '-',
      confidence: 'ثقة منخفضة',
      blocker: 'نقص في التغطية',
      readyForPickup: 'يحتاج تصعيدًا',
      recommendation: 'صعّد وراقب الضغط',
      note: 'المنطقة تحتاج تدخلًا مباشرًا.',
      actionPlans: ['تصعيد فوري', 'تثبيت العجز', 'فتح الضغط'],
    },
  ] as const,
} as const;

export type SheinProxyStage =
  | 'intake_review'
  | 'quote_pending'
  | 'customer_approval'
  | 'batch_pending'
  | 'purchased'
  | 'inbound'
  | 'sorting'
  | 'ready_for_delivery'
  | 'captain_assignment'
  | 'delivered'
  | 'exception';

export const SHEIN_PROXY_STAGE_LABELS: Record<SheinProxyStage, string> = {
  intake_review: 'مراجعة الطلب',
  quote_pending: 'بانتظار التسعير',
  customer_approval: 'موافقة العميل',
  batch_pending: 'بانتظار الدفعة',
  purchased: 'تم الشراء',
  inbound: 'في الطريق للاستقبال',
  sorting: 'قيد الفرز',
  ready_for_delivery: 'جاهز للتسليم',
  captain_assignment: 'إسناد الكابتن',
  delivered: 'تم التسليم',
  exception: 'استثناء',
};

export const SHEIN_PROXY_OPERATIONAL_PREVIEW = {
  summary: {
    intake_review: 5,
    quote_pending: 4,
    customer_approval: 3,
    batch_pending: 6,
    purchased: 8,
    inbound: 4,
    sorting: 3,
    ready_for_delivery: 2,
    captain_assignment: 2,
    delivered: 14,
    exception: 1,
  },
  requests: [
    {
      id: 'SPX-2048',
      customer: 'نورة الفهد',
      stage: 'intake_review' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['intake_review'],
      statusTone: 'warning',
      amount: 'ر.ي 1,280',
      shipping: 'ر.ي 96',
      fee: 'ر.ي 110',
      total: 'ر.ي 1,486',
      updated: 'قبل 10 دقائق',
      note: 'بانتظار مراجعة الرابط والتسعير من فريق العمليات.',
      nextStep: 'راجع الرابط وأدخل التسعير',
      owner: 'العمليات',
      sla: '24 ساعة',
    },
    {
      id: 'SPX-2051',
      customer: 'مريم خالد',
      stage: 'customer_approval' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['customer_approval'],
      statusTone: 'brand',
      amount: 'ر.ي 840',
      shipping: 'ر.ي 62',
      fee: 'ر.ي 88',
      total: 'ر.ي 990',
      updated: 'قبل 18 دقيقة',
      note: 'العرض أُرسل للعميل وينتظر الموافقة.',
      nextStep: 'تابع رد العميل',
      owner: 'العمليات',
      sla: '12 ساعة',
    },
    {
      id: 'SPX-2064',
      customer: 'سعيد حسن',
      stage: 'batch_pending' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['batch_pending'],
      statusTone: 'warning',
      amount: 'ر.ي 1,620',
      shipping: 'ر.ي 74',
      fee: 'ر.ي 125',
      total: 'ر.ي 1,819',
      updated: 'قبل 32 دقيقة',
      note: 'معتمد من العميل وبانتظار تجميع الدفعة.',
      nextStep: 'أضفه للدفعة القادمة',
      owner: 'المشتريات',
      sla: '48 ساعة',
    },
    {
      id: 'SPX-2072',
      customer: 'دانا صالح',
      stage: 'sorting' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['sorting'],
      statusTone: 'best',
      amount: 'ر.ي 1,010',
      shipping: 'ر.ي 55',
      fee: 'ر.ي 94',
      total: 'ر.ي 1,159',
      updated: 'قبل ساعة',
      note: 'تم استقبال الطلب وجاري الفرز والتعبئة.',
      nextStep: 'تحقق من المحتوى قبل الإغلاق',
      owner: 'المستودع',
      sla: '24 ساعة',
    },
    {
      id: 'SPX-2078',
      customer: 'لمى ناصر',
      stage: 'captain_assignment' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['captain_assignment'],
      statusTone: 'best',
      amount: 'ر.ي 690',
      shipping: 'ر.ي 45',
      fee: 'ر.ي 77',
      total: 'ر.ي 812',
      updated: 'قبل ساعتين',
      note: 'جاهز للتسليم النهائي — يحتاج إسناد كابتن.',
      nextStep: 'أسند للكابتن المتاح',
      owner: 'الإسناد',
      sla: '4 ساعات',
    },
    {
      id: 'SPX-2083',
      customer: 'عبدالله عمر',
      stage: 'exception' as SheinProxyStage,
      statusLabel: SHEIN_PROXY_STAGE_LABELS['exception'],
      statusTone: 'danger',
      amount: 'ر.ي 560',
      shipping: 'ر.ي 41',
      fee: 'ر.ي 58',
      total: 'ر.ي 659',
      updated: 'قبل 3 ساعات',
      note: 'تعارض في التسعير — يحتاج قرار تصعيد.',
      nextStep: 'صعّد للمشرف وأغلق السجل',
      owner: 'المشرف',
      sla: 'عاجل',
    },
  ] as const,
} as const;

export type AwnakStage =
  | 'intake'
  | 'quote_review'
  | 'dispatch_pending'
  | 'assigned'
  | 'in_progress'
  | 'proof_review'
  | 'completed'
  | 'cancelled'
  | 'escalated';

export const AWNAK_STAGE_LABELS: Record<AwnakStage, string> = {
  intake: 'استلام الطلب',
  quote_review: 'مراجعة السعر',
  dispatch_pending: 'قيد الإسناد',
  assigned: 'تم الإسناد',
  in_progress: 'قيد التنفيذ',
  proof_review: 'مراجعة الإثبات',
  completed: 'مكتمل',
  cancelled: 'ملغى',
  escalated: 'مصعّد',
};

export const AWNAK_OPERATIONAL_PREVIEW = {
  summary: {
    intake: 4,
    quote_review: 3,
    dispatch_pending: 5,
    assigned: 6,
    in_progress: 7,
    proof_review: 3,
    completed: 18,
    cancelled: 2,
    escalated: 1,
  },
  rows: [
    {
      requestId: 'AWN-3101',
      type: 'أغراض شخصية',
      customer: 'نورة الفهد',
      stage: 'quote_review' as AwnakStage,
      status: AWNAK_STAGE_LABELS['quote_review'],
      assignmentStatus: 'معلّق',
      nextAction: 'راجع السعر وأرسل للعميل',
      risk: 'مرتفع',
      owner: 'فريق عونك',
      note: 'الطلب يحتاج تأكيد السعر قبل إسناد الكابتن.',
      statusTone: 'warning',
      sla: '2 ساعة',
      captainId: null,
    },
    {
      requestId: 'AWN-3104',
      type: 'طعام',
      customer: 'مريم خالد',
      stage: 'assigned' as AwnakStage,
      status: AWNAK_STAGE_LABELS['assigned'],
      assignmentStatus: 'مسند',
      nextAction: 'تابع تأكيد الاستلام',
      risk: 'متوسط',
      owner: 'المشرف المباشر',
      note: 'الكابتن في الطريق — انتظر تأكيد الاستلام.',
      statusTone: 'brand',
      sla: '30 دقيقة',
      captainId: 'CAP-0041',
    },
    {
      requestId: 'AWN-3108',
      type: 'وزن ثقيل',
      customer: 'سعيد حسن',
      stage: 'proof_review' as AwnakStage,
      status: AWNAK_STAGE_LABELS['proof_review'],
      assignmentStatus: 'مكتمل ميدانيًا',
      nextAction: 'راجع الإثبات وأغلق الطلب',
      risk: 'منخفض',
      owner: 'التشغيل',
      note: 'الكابتن أرسل إثبات التسليم — مراجعة سريعة قبل الإغلاق.',
      statusTone: 'best',
      sla: '1 ساعة',
      captainId: 'CAP-0019',
    },
    {
      requestId: 'AWN-3112',
      type: 'تورتة',
      customer: 'دانا صالح',
      stage: 'dispatch_pending' as AwnakStage,
      status: AWNAK_STAGE_LABELS['dispatch_pending'],
      assignmentStatus: 'بلا كابتن',
      nextAction: 'ابحث عن كابتن متاح',
      risk: 'مرتفع',
      owner: 'الإسناد',
      note: 'الطلب قيد العرض بلا كابتن — خطر تأخير.',
      statusTone: 'danger',
      sla: 'عاجل',
      captainId: null,
    },
    {
      requestId: 'AWN-3115',
      type: 'قابل للكسر',
      customer: 'خالد العلي',
      stage: 'escalated' as AwnakStage,
      status: AWNAK_STAGE_LABELS['escalated'],
      assignmentStatus: 'مصعّد',
      nextAction: 'صعّد للمشرف وحدد مسار الحل',
      risk: 'مرتفع',
      owner: 'المشرف',
      note: 'الكابتن أبلغ عن مشكلة في التسليم — يحتاج قرار تصعيد.',
      statusTone: 'danger',
      sla: 'عاجل',
      captainId: 'CAP-0033',
    },
  ] as const,
} as const;

export const AREA_CAPACITY_OPERATIONAL_PREVIEW = {
  summary: {
    zoneLoad: 'أحمال مرتفعة',
    protectedZones: 2,
    freeZones: 1,
    surgeBonus: 'حافز المنطقة',
    recommendation: 'فعّل حافز المنطقة الآن',
  },
  zones: [
    {
      id: 'AR-01',
      zone: 'شمال الرياض',
      zoneLoad: 'مرتفع',
      protectedZones: '2',
      freeZones: '0',
      surgeBonus: 'حافز مفعل',
      reduceRadius: 'تقليل النطاق',
      temporaryStop: 'إيقاف مؤقت متاح',
      moveCapacity: 'نقل السعة',
      recommendation: 'فعّل حافز المنطقة الآن',
      note: 'العجز يحتاج تدخلًا فوريًا.',
      statusTone: 'danger',
    },
    {
      id: 'AR-02',
      zone: 'شرق الرياض',
      zoneLoad: 'متصاعد',
      protectedZones: '1',
      freeZones: '1',
      surgeBonus: 'حافز جزئي',
      reduceRadius: 'تقليل نصف القطر',
      temporaryStop: 'متاح للحظات',
      moveCapacity: 'نقل كباتن',
      recommendation: 'قلّص النطاق مؤقتًا',
      note: 'الضغط سيزيد خلال 15 دقيقة.',
      statusTone: 'warning',
    },
    {
      id: 'AR-03',
      zone: 'وسط الرياض',
      zoneLoad: 'متوازن',
      protectedZones: '3',
      freeZones: '2',
      surgeBonus: 'لا حاجة',
      reduceRadius: 'غير مطلوب',
      temporaryStop: 'غير مطلوب',
      moveCapacity: 'نقل بضع كباتن',
      recommendation: 'لا تدخل مطلوب',
      note: 'التغطية مستقرة والفائض واضح.',
      statusTone: 'best',
    },
    {
      id: 'AR-04',
      zone: 'جنوب الرياض',
      zoneLoad: 'فائض',
      protectedZones: '2',
      freeZones: '4',
      surgeBonus: 'احتياطي',
      reduceRadius: 'لا حاجة',
      temporaryStop: 'لا حاجة',
      moveCapacity: 'انقل الكباتن للشمال',
      recommendation: 'انقل السعة للمناطق المضغوطة',
      note: 'يمكن دعم الشمال مباشرة من هنا.',
      statusTone: 'brand',
    },
  ] as const,
} as const;

export const EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW = {
  summary: {
    open: 17,
    escalate: 4,
    resolve: 12,
    close: 29,
  },
  exceptions: [
    {
      id: 'EX-4101',
      type: 'تأخير غير مبرر',
      lifecycleState: 'reassignment_required',
      affectedSurface: 'app-captain',
      ownerQueue: 'dispatch-assignment',
      severity: 'عالي',
      currentOwner: 'الإسناد',
      startTime: 'منذ 15 دقيقة',
      lastAction: 'تنبيه للكابتن',
      suggestedAction: 'إعادة الإسناد',
      resolutionPath: 'حل',
      routeHint: '/operations?workspace=dispatch-assignment&orderId=EX-4101',
      evidenceNeeded: true,
      onDemandDetailPolicy: 'evidence-on-open',
      note: 'التأخير ما زال مفتوحًا بلا مالك واضح.',
      statusTone: 'warning',
    },
    {
      id: 'EX-4102',
      type: 'تعطل مركبة كابتن',
      lifecycleState: 'captain_unavailable',
      affectedSurface: 'app-captain',
      ownerQueue: 'audit-support-sla',
      severity: 'حرج',
      currentOwner: 'الدعم الفني',
      startTime: 'منذ 8 دقائق',
      lastAction: 'قيد التواصل',
      suggestedAction: 'إسناد بديل',
      resolutionPath: 'تصعيد',
      routeHint: '/operations?workspace=audit-support-sla&orderId=EX-4102',
      evidenceNeeded: true,
      onDemandDetailPolicy: 'evidence-on-open',
      note: 'الحل يحتاج تدخلًا مباشرًا وسريعًا.',
      statusTone: 'danger',
    },
    {
      id: 'EX-4103',
      type: 'إغلاق متجر مفاجئ',
      lifecycleState: 'support_exception',
      affectedSurface: 'app-partner',
      ownerQueue: 'partner-stores',
      severity: 'متوسط',
      currentOwner: 'إدارة الشركاء',
      startTime: 'منذ 25 دقيقة',
      lastAction: 'إيقاف الاستقبال',
      suggestedAction: 'تثبيت الإغلاق',
      resolutionPath: 'إغلاق',
      routeHint: '/operations?workspace=partner-stores&orderId=EX-4103',
      evidenceNeeded: false,
      onDemandDetailPolicy: 'detail-on-open',
      note: 'الاستقبال متوقف ولا حاجة لتكرار الإجراء.',
      statusTone: 'best',
    },
  ] as const,
} as const;

export const FULFILLMENT_MODE_ORDER_QUEUES: Record<import('./operations.types').DshFulfillmentOperationalMode, import('./operations.types').DshOperationsOrderRow[]> = {
  bthwani_delivery: [
    { id: 'BD-0101', storeName: 'شاورما هليل', customerName: 'نوف العتيبي', statusLabel: 'في انتظار كابتن', statusTone: 'warning', fulfillmentMode: 'bthwani_delivery', nextAction: 'تعيين كابتن', slaLabel: 'SLA: 8 دقائق' },
    { id: 'BD-0102', storeName: 'برغر لاب', customerName: 'خالد الزهراني', statusLabel: 'الكابتن في الطريق', statusTone: 'neutral', fulfillmentMode: 'bthwani_delivery', nextAction: 'متابعة التسليم', slaLabel: 'SLA: 12 دقيقة' },
    { id: 'BD-0103', storeName: 'مطعم القلعة', customerName: 'ريم الشهراني', statusLabel: 'تأخير', statusTone: 'danger', fulfillmentMode: 'bthwani_delivery', nextAction: 'تصعيد', slaLabel: 'SLA: خرق وشيك' },
  ],
  partner_delivery: [
    { id: 'PD-0201', storeName: 'دانكن دونتس', customerName: 'محمد السالم', statusLabel: 'في انتظار موصل الشريك', statusTone: 'warning', fulfillmentMode: 'partner_delivery', nextAction: 'تنبيه الشريك', slaLabel: 'SLA: 15 دقيقة' },
    { id: 'PD-0202', storeName: 'بارنز كافيه', customerName: 'سارة القحطاني', statusLabel: 'موصل الشريك في الطريق', statusTone: 'neutral', fulfillmentMode: 'partner_delivery', nextAction: 'متابعة الشريك', slaLabel: 'SLA: 20 دقيقة' },
  ],
  pickup: [
    { id: 'PK-0301', storeName: 'كافيه آرت', customerName: 'أحمد الدوسري', statusLabel: 'الطلب جاهز', statusTone: 'success', fulfillmentMode: 'pickup', nextAction: 'إشعار العميل', slaLabel: 'SLA: 10 دقائق' },
    { id: 'PK-0302', storeName: 'شيك هاوس', customerName: 'عبدالله المطيري', statusLabel: 'بانتظار التحضير', statusTone: 'warning', fulfillmentMode: 'pickup', nextAction: 'متابعة الجاهزية', slaLabel: 'SLA: 8 دقائق' },
  ],
};

export const AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW = {
  summary: {
    manualAudits: 12,
    supportTickets: 6,
    slaRisk: 5,
    evidenceComplete: 84,
  },
  audits: [
    {
      id: 'AU-7001',
      who: 'المشرف',
      why: 'إسناد يدوي بعد تأخر الكابتن',
      when: 'منذ 10 دقائق',
      permissionResult: 'موافق',
      slaBreachReason: 'تأخر الاستلام',
      supportTicketLink: 'تذكرة-51',
      proofRequired: 'صورة إيصال',
      evidenceState: 'مفتوح',
      resolutionPath: 'حل',
      note: 'يحتاج إغلاقًا بعد حفظ الإثبات.',
      statusTone: 'danger',
    },
    {
      id: 'AU-7002',
      who: 'الدعم',
      why: 'شكوى عميل حي',
      when: 'منذ 22 دقيقة',
      permissionResult: 'قيد الموافقة',
      slaBreachReason: 'نقص الطلب',
      supportTicketLink: 'تذكرة-52',
      proofRequired: 'رسالة من المتجر',
      evidenceState: 'يحتاج إثبات',
      resolutionPath: 'تصعيد',
      note: 'الربط بالدعم هو الخطوة التالية.',
      statusTone: 'warning',
    },
    {
      id: 'AU-7003',
      who: 'العمليات',
      why: 'تعويض مباشر',
      when: 'منذ ساعة',
      permissionResult: 'معتمد',
      slaBreachReason: 'تأخير متجر',
      supportTicketLink: 'تذكرة-53',
      proofRequired: 'حزمة إثبات كاملة',
      evidenceState: 'مكتمل',
      resolutionPath: 'إغلاق',
      note: 'يمكن الإغلاق دون المزيد من الخطوات.',
      statusTone: 'best',
    },
  ] as const,
} as const;

// ─── P0-10: Operations monitoring item ───────────────────────────────────────
// Used by CommandCenterScreen as monitoring cockpit source.
// Summaries only — details open on explicit action (onDemandDetailPolicy).
// No full order details loaded into the cockpit.

export type DshOpsMonitoringItem = {
  readonly entityId: string;
  readonly entityLabel: string;
  /** Lifecycle state ID or descriptive state key for display. */
  readonly lifecycleState: string;
  readonly affectedSurface: 'control-panel' | 'app-client' | 'app-partner' | 'app-captain' | 'app-field';
  readonly ownerQueue: string;
  readonly status: string;
  readonly statusTone: 'neutral' | 'success' | 'warning' | 'danger';
  readonly primaryAction: string;
  readonly secondaryAction?: string;
  /** Route hint for navigation — use buildOperationsHref or absolute path. */
  readonly routeHint: string;
  readonly evidenceNeeded: boolean;
  readonly onDemandDetailPolicy: 'summary-only' | 'detail-on-open' | 'evidence-on-open';
  readonly supportTicketId?: string;
  readonly auditEntryId?: string;
};

// ─── P0-10: Service health monitoring ────────────────────────────────────────
// Partner readiness, catalog blockers, serviceability, SLA risk, captain coverage.
// Each item routes to its owning workspace — no data duplication.

export const DSH_SERVICE_HEALTH_PREVIEW: ReadonlyArray<DshOpsMonitoringItem> = [
  {
    entityId: 'SH-001',
    entityLabel: 'جاهزية الشركاء',
    lifecycleState: 'partner_intake',
    affectedSurface: 'app-partner',
    ownerQueue: 'partner-stores',
    status: '3 متاجر غير جاهزة',
    statusTone: 'warning',
    primaryAction: 'فتح المتاجر',
    secondaryAction: 'تفاصيل الجاهزية',
    routeHint: '?workspace=partner-stores',
    evidenceNeeded: false,
    onDemandDetailPolicy: 'summary-only',
  },
  {
    entityId: 'SH-002',
    entityLabel: 'معوّقات نشر الكتالوج',
    lifecycleState: 'item_unavailable',
    affectedSurface: 'control-panel',
    ownerQueue: 'catalogs',
    status: '5 منتجات معلّقة',
    statusTone: 'warning',
    primaryAction: 'فتح الكتالوجات',
    routeHint: '/catalogs',
    evidenceNeeded: true,
    onDemandDetailPolicy: 'detail-on-open',
  },
  {
    entityId: 'SH-003',
    entityLabel: 'قابلية الخدمة',
    lifecycleState: 'captain_unavailable',
    affectedSurface: 'control-panel',
    ownerQueue: 'area-capacity',
    status: 'منطقتان خارج النطاق',
    statusTone: 'danger',
    primaryAction: 'فتح المناطق',
    secondaryAction: 'عرض الخريطة',
    routeHint: '?workspace=area-capacity',
    evidenceNeeded: false,
    onDemandDetailPolicy: 'summary-only',
  },
  {
    entityId: 'SH-004',
    entityLabel: 'خطر SLA',
    lifecycleState: 'support_exception',
    affectedSurface: 'control-panel',
    ownerQueue: 'audit-support-sla',
    status: '5 طلبات في خطر خرق SLA',
    statusTone: 'danger',
    primaryAction: 'فتح التدقيق',
    routeHint: '?workspace=audit-support-sla',
    evidenceNeeded: true,
    onDemandDetailPolicy: 'evidence-on-open',
    auditEntryId: 'AU-7001',
  },
  {
    entityId: 'SH-005',
    entityLabel: 'تغطية الكباتن',
    lifecycleState: 'captain_assignment',
    affectedSurface: 'app-captain',
    ownerQueue: 'dispatch-assignment',
    status: '4 كباتن متاحون',
    statusTone: 'success',
    primaryAction: 'فتح الإسناد',
    secondaryAction: 'عرض الخريطة',
    routeHint: '?workspace=dispatch-assignment',
    evidenceNeeded: false,
    onDemandDetailPolicy: 'summary-only',
  },
];

// ─── P0-10: WLT finance alerts — read-only display ───────────────────────────
// DSH displays WLT finance state; WLT owns all mutations.
// No approve/pay/settle/refund inside DSH.

export type DshWltFinanceAlert = {
  readonly alertId: string;
  readonly domain: 'payment' | 'refund' | 'settlement' | 'payout' | 'commission';
  readonly label: string;
  readonly count: number;
  readonly statusTone: 'neutral' | 'success' | 'warning' | 'danger';
  /** WLT bridge note shown to operator — always states read-only boundary. */
  readonly wltBridgeNote: string;
  readonly routeHint: string;
};

export const DSH_WLT_FINANCE_ALERTS_PREVIEW: ReadonlyArray<DshWltFinanceAlert> = [
  {
    alertId: 'WLT-FA-01',
    domain: 'payment',
    label: 'مدفوعات معلّقة',
    count: 4,
    statusTone: 'warning',
    wltBridgeNote: 'awaiting_wlt_payment — عرض فقط، الإجراء في WLT',
    routeHint: '/finance',
  },
  {
    alertId: 'WLT-FA-02',
    domain: 'refund',
    label: 'طلبات استرداد معلّقة',
    count: 2,
    statusTone: 'warning',
    wltBridgeNote: 'refund_pending_wlt — عرض فقط، لا mutation داخل DSH',
    routeHint: '/finance',
  },
  {
    alertId: 'WLT-FA-03',
    domain: 'payout',
    label: 'مدفوعات كباتن معلّقة',
    count: 7,
    statusTone: 'neutral',
    wltBridgeNote: 'captain_payout — WLT يملك الحقيقة والتنفيذ',
    routeHint: '/finance',
  },
];

// ─── P0-10: Exception → support ticket + audit entry map ─────────────────────
// Every exception must link to a support ticket or audit entry.
// No exception without an owner and an action route.

export const EXCEPTION_TICKET_MAP: Readonly<Record<string, { supportTicketId: string; auditEntryId?: string }>> = {
  'EX-4101': { supportTicketId: 'TK-5101', auditEntryId: 'AU-7001' },
  'EX-4102': { supportTicketId: 'TK-5102', auditEntryId: 'AU-7002' },
  'EX-4103': { supportTicketId: 'TK-5103', auditEntryId: undefined },
};

// ─── P0-10: Dispatch lifecycle state map ─────────────────────────────────────
// bthwani_delivery only enters captain dispatch — pickup and partner_delivery do not.
// reassignment_required surfaces an explicit mandatory action in the dispatch board.

export const DISPATCH_LIFECYCLE_STATE_MAP: Readonly<Record<string, DshOrderLifecycleStatus>> = {
  'DA-2001': 'captain_assignment',
  'DA-2002': 'reassignment_required',
  'DA-2003': 'captain_unavailable',
};
