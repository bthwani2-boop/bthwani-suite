export const dshWalletPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  moneySemantics: 'WLT-owned read-only preview reference',
} as const;

export type DshWalletReferencePreview = {
  id: string;
  ownerId: string;
  ownerKind: 'customer' | 'partner' | 'captain';
  label: string;
  balanceLabel: string;
  wltOwned: true;
};

export type DshFinancePreviewSurface =
  | 'overview'
  | 'settlements'
  | 'cod-reconciliation'
  | 'refunds'
  | 'captain-eligibility'
  | 'payouts'
  | 'ledger'
  | 'risk-audit'
  | 'captain-finance'
  | 'store-delivery-finance';

export type DshFinancePreviewRow = {
  id: string;
  amount: string;
  owner: string;
  status: string;
  risk: 'danger' | 'warning' | 'success';
  evidence: string;
  nextAction: string;
  recommendation: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  sla: string;
};

export const dshWalletReferencePreviews: readonly DshWalletReferencePreview[] = [
  { id: 'wallet-customer-preview', ownerId: 'customer-360-001', ownerKind: 'customer', label: 'محفظة العميل', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-captain-preview', ownerId: 'captain-preview-001', ownerKind: 'captain', label: 'رصيد الكابتن', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-partner-preview', ownerId: 'store-101', ownerKind: 'partner', label: 'تسوية الشريك', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
];

export const dshFinanceControlPanelPreviewRows: Record<DshFinancePreviewSurface, ReadonlyArray<DshFinancePreviewRow>> = {
  overview: [
    { id: 'FIN-001', amount: '١٢٥٬٠٠٠ ر.ي', owner: 'مالية العمليات', status: 'مراجعة', risk: 'warning', evidence: 'مطابقة جزئية بين الكشوف', nextAction: 'افتح التسويات', recommendation: 'أغلق التسويات العالقة أولًا', primaryActionLabel: 'فتح التسويات', secondaryActionLabel: 'فتح الأدلة', sla: 'خلال ٢٤ ساعة' },
    { id: 'FIN-002', amount: '٣٤٬٨٠٠ ر.ي', owner: 'إدارة المخاطر', status: 'سليم', risk: 'success', evidence: 'لا توجد فوارق', nextAction: 'ابقِ المراقبة نشطة', recommendation: 'لا حاجة للتدخل الآن', primaryActionLabel: 'عرض القيود', secondaryActionLabel: 'فتح التدقيق', sla: 'مباشر' },
  ],
  settlements: [
    { id: 'SET-101', amount: '٤٥٬٠٠٠ ر.ي', owner: 'تسويات الكباتن', status: 'جاهز للصرف', risk: 'success', evidence: 'مطابقة كاملة', nextAction: 'مراجعة التسوية', recommendation: 'توصية باعتماد التسوية بناءً على مطابقة الكشف', primaryActionLabel: 'معاينة التفاصيل', secondaryActionLabel: 'فتح الأدلة', sla: 'خلال ٢٤ ساعة' },
    { id: 'SET-102', amount: '١٢٣٬٠٠٠ ر.ي', owner: 'تسويات الشركاء', status: 'معلّق', risk: 'warning', evidence: 'فارق في الإجمالي', nextAction: 'مراجعة تفصيلية', recommendation: 'تعليق التسوية حتى التحقق من الفوارق', primaryActionLabel: 'مراجعة الفوارق', secondaryActionLabel: 'معاينة التوصية', sla: 'متأخر ٦ ساعات' },
    { id: 'SET-103', amount: '١٢٬٠٠٠ ر.ي', owner: 'تسويات الميدانيين', status: 'مجدولة', risk: 'success', evidence: 'عمولات مؤهلة محسوبة', nextAction: 'مراجعة المستندات', recommendation: 'الميدانيون مؤهلون — تجهيز ملف المراجعة للتحويل البنكي', primaryActionLabel: 'معاينة ملف المراجعة', secondaryActionLabel: 'فتح السجل', sla: 'خلال ٤٨ ساعة' },
  ],
  'cod-reconciliation': [
    { id: 'COD-201', amount: '١٢٬٠٠٠ ر.ي', owner: 'كابتن فهد — CAP-77', status: 'مكتمل', risk: 'success', evidence: 'تطابق الإيداع', nextAction: 'أرشفة تدقيقية', recommendation: 'الذمة مطابقة بالكامل للمطالبة المالية اليومية', primaryActionLabel: 'معاينة الأرشيف', secondaryActionLabel: 'فتح السجل', sla: 'مباشر' },
    { id: 'COD-202', amount: '٨٥٠٠ ر.ي', owner: 'كابتن عمر — CAP-88', status: 'فارق نقدي', risk: 'danger', evidence: 'عجز ١٥٠٠ ر.ي', nextAction: 'فتح تحقيق مالي', recommendation: 'الذمة غير مطابقة وتتطلب فتح تحقيق داخلي فوري', primaryActionLabel: 'معاينة توصية التحقيق', secondaryActionLabel: 'فتح الأدلة', sla: 'عاجل' },
  ],
  refunds: [
    { id: 'REF-301', amount: '٣٤٠٠ ر.ي', owner: 'استرداد طلب #ORD-8821', status: 'بانتظار التأكيد', risk: 'warning', evidence: 'استلام المنتج موثق', nextAction: 'مراجعة مستندات الاسترداد', recommendation: 'توصية بإرجاع القيمة للمحفظة بعد فحص المنتج', primaryActionLabel: 'معاينة طلب الاسترداد', secondaryActionLabel: 'فتح الطلب', sla: 'خلال ١٢ ساعة' },
    { id: 'REF-302', amount: '٢١٬٠٠٠ ر.ي', owner: 'نزاع مالي #ORD-9012', status: 'تحت التدقيق', risk: 'danger', evidence: 'ادعاء بعدم استلام', nextAction: 'فتح تحقيق النزاع', recommendation: 'توصية بإبقاء النقد معلقاً للتدقيق ومراجعة سجل التتبع', primaryActionLabel: 'معاينة توصية التحقيق', secondaryActionLabel: 'فتح التدقيق', sla: 'عاجل' },
  ],
  'captain-eligibility': [
    { id: 'CEL-401', amount: '٨٠٠٠ ر.ي', owner: 'كابتن سامر — CAP-91', status: 'غير مؤهل', risk: 'warning', evidence: 'رصيد ضامن أقل من الحد (١٠٬٠٠٠ ر.ي)', nextAction: 'فحص رصيد الضامن', recommendation: 'الكابتن يحتاج شحن ٢٬٠٠٠ ر.ي لتجاوز حد الضمان', primaryActionLabel: 'معاينة الحالة', secondaryActionLabel: 'فتح الملف', sla: 'خلال ٢٤ ساعة' },
    { id: 'CEL-402', amount: '١٥٬٠٠٠ ر.ي', owner: 'كابتن خالد — CAP-55', status: 'مؤهل', risk: 'success', evidence: 'رصيد ضامن كافٍ', nextAction: 'مراقبة مستمرة', recommendation: 'الكابتن مؤهل وتوفر الرصيد الضامن موثق', primaryActionLabel: 'مراجعة النشاط', secondaryActionLabel: 'سجل الحركات', sla: 'مباشر' },
    { id: 'CEL-403', amount: '٠ ر.ي', owner: 'كابتن ماجد — CAP-33', status: 'محظور ماليًا', risk: 'danger', evidence: 'رصيد سالب — ذمة COD غير مسددة', nextAction: 'متابعة سداد الذمة', recommendation: 'توصية باستمرار إيقاف استقبال الطلبات حتى تسوية ذمة COD', primaryActionLabel: 'معاينة التوصية', secondaryActionLabel: 'فتح الذمة', sla: 'فوري' },
  ],
  payouts: [
    { id: 'PAY-501', amount: '٨٧٬٠٠٠ ر.ي', owner: 'مستحقات الشركاء', status: 'مجدولة', risk: 'success', evidence: 'ملف الإحالة جاهز', nextAction: 'مراجعة كشف التحويل', recommendation: 'مراجعة مسودة كشف التحويل قبل الإحالة للبنك', primaryActionLabel: 'معاينة كشف المدفوعات', secondaryActionLabel: 'فتح الملف', sla: 'خلال ٢٤ ساعة' },
    { id: 'PAY-502', amount: '٥١٬٠٠٠ ر.ي', owner: 'مستحقات الكباتن', status: 'تحتاج مراجعة', risk: 'warning', evidence: 'تعارض في رقم الحساب', nextAction: 'مطابقة الحسابات', recommendation: 'تعليق عملية التحويل حتى تحديث بيانات البنك', primaryActionLabel: 'مراجعة الحساب', secondaryActionLabel: 'معاينة التوصية', sla: 'خلال ٨ ساعات' },
    { id: 'PAY-503', amount: '١٢٬٠٠٠ ر.ي', owner: 'مستحقات الميدانيين', status: 'مجدولة', risk: 'success', evidence: 'عمولات مؤهلة مؤكدة', nextAction: 'تأكيد عمولات', recommendation: 'تجهيز كشف العمولات الشهرية للمطابقة النهائية', primaryActionLabel: 'معاينة ملف الصرف', secondaryActionLabel: 'فتح السجل', sla: 'خلال ٤٨ ساعة' },
  ],
  ledger: [
    { id: 'LED-601', amount: '٤٥٠٬٠٠٠ ر.ي', owner: 'قيد يومي', status: 'مغلق', risk: 'success', evidence: 'ميزان متوازن', nextAction: 'أرشفة تدقيقية', recommendation: 'أرشفة القيد المالي لليوم بعد التحقق من المطابقة', primaryActionLabel: 'معاينة الأرشيف', secondaryActionLabel: 'فتح الميزان', sla: 'مباشر' },
    { id: 'LED-602', amount: '١٩٨٬٠٠٠ ر.ي', owner: 'ميزان المراجعة', status: 'مفتوح', risk: 'warning', evidence: 'تفاوت بسيط', nextAction: 'مراجعة فرق الميزان', recommendation: 'فحص ميزان المراجعة لضبط الفروقات الطفيفة قبل الإغلاق', primaryActionLabel: 'مراجعة', secondaryActionLabel: 'فتح التفاصيل', sla: 'خلال ٤ ساعات' },
  ],
  'risk-audit': [
    { id: 'AUD-701', amount: '١٥٠٬٠٠٠ ر.ي', owner: 'شريك X — STORE-55', status: 'اشتباه مرتفع', risk: 'danger', evidence: 'نمط سحب غير معتاد', nextAction: 'فحص نمط السحب', recommendation: 'توصية إيقاف فوري للتسويات لتفادي مخاطر التدفق المالي', primaryActionLabel: 'معاينة التوصية', secondaryActionLabel: 'فتح التحقيق', sla: 'فوري' },
    { id: 'AUD-702', amount: '٨٤٬٠٠٠ ر.ي', owner: 'سجل تدقيق — مايو 2026', status: 'تحت المراجعة', risk: 'warning', evidence: 'لا يوجد إغلاق كامل', nextAction: 'مراجعة مستندات مايو', recommendation: 'تأكيد اكتمال كشوفات التدقيق قبل التحديث النهائي', primaryActionLabel: 'معاينة كشف التدقيق', secondaryActionLabel: 'فتح السجل', sla: 'خلال ١٢ ساعة' },
  ],
  'captain-finance': [
    { id: 'CF-001', amount: '١٥٬٠٠٠ ر.ي', owner: 'ذمة COD - كابتن علي', status: 'تحت المطابقة', risk: 'warning', evidence: 'بانتظار إيداع الكابتن لمبلغ COD المحصّل', nextAction: 'تأكيد الإيداع في البنك', recommendation: 'مراقبة ذمة COD المعلقة ومطابقة إيصال البنك', primaryActionLabel: 'مراجعة الإيداع', secondaryActionLabel: 'فتح الأدلة', sla: 'خلال ٢٤ ساعة' },
    { id: 'CF-002', amount: '٨٬٥٠٠ ر.ي', owner: 'حافز أداء - كابتن عمر', status: 'مؤهل للتدقيق', risk: 'success', evidence: 'مستند المسافة والتقييم مطابق', nextAction: 'مراجعة الحافز', recommendation: 'توصية باعتماد حوافز كباتن بثواني (bthwani_captain_mode)', primaryActionLabel: 'معاينة التفاصيل', secondaryActionLabel: 'عرض القيود', sla: 'خلال ٤٨ ساعة' },
  ],
  'store-delivery-finance': [
    { id: 'SDF-001', amount: '٢٤٬٠٠٠ ر.ي', owner: 'توصيل شريك - متجر جرين بول', status: 'تدقيق داخلي', risk: 'success', evidence: 'رسوم توصيل مخصصة للمتجر (متجر يوصل بنفسه)', nextAction: 'مراجعة الرسوم', recommendation: 'عمولة توصيل المتجر الداخلي (لا تُدفع كباتن بثواني)', primaryActionLabel: 'مراجعة الرسوم', secondaryActionLabel: 'فتح الأدلة', sla: 'مباشر' },
    { id: 'SDF-002', amount: '١٢٬٥٠٠ ر.ي', owner: 'مستحقات موصل المتجر - عمر', status: 'مستحق متجر', risk: 'warning', evidence: 'محتسب بناءً على سياسة مستحق لكل توصيلة', nextAction: 'مراجعة كشف موصل المتجر', recommendation: 'يُدفع مباشرة من المتجر لموصله (خارج بثواني)', primaryActionLabel: 'معاينة ملف المراجعة', secondaryActionLabel: 'فتح السجل', sla: 'خلال ٢٤ ساعة' },
  ],
};
