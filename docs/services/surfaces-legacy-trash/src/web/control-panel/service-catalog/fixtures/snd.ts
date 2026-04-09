export type SndCategoryFixture = {
  id: string;
  order: number;
  name: string;
  description: string;
  enabled: boolean;
  iconHint: string;
  iconImageUrl?: string;
  visual: {
    glyph: string;
    shortLabel: string;
    accent: string;
    soft: string;
    ring: string;
  };
};

export type SndRequestFixture = {
  id: string;
  ref: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  updated: string;
  source: string;
  categoryId: string;
  owner: string;
  requester: string;
  clientName: string;
  channel: string;
  eta: string;
  summary: string;
  signals: string[];
};

export const SND_CATEGORY_FIXTURES: SndCategoryFixture[] = [
  {
    id: 'specialized_app_development',
    order: 1,
    name: 'تطوير التطبيقات',
    description: 'تطبيقات عميل ومنتجات رقمية وخدمات تشغيل مرتبطة بالتسليم.',
    enabled: true,
    iconHint: 'phone-portrait-outline',
    visual: {
      glyph: 'ت',
      shortLabel: 'تطبيقات',
      accent: '#1e88ff',
      soft: '#eaf4ff',
      ring: '#c8dff8',
    },
  },
  {
    id: 'specialized_graphic_design',
    order: 2,
    name: 'التصميم الجرافيكي',
    description: 'هويات مرئية ومخرجات تصميم ومراجعات إبداعية سريعة.',
    enabled: true,
    iconHint: 'color-palette-outline',
    visual: {
      glyph: 'ص',
      shortLabel: 'تصميم',
      accent: '#7c5cff',
      soft: '#f1ecff',
      ring: '#d8cdfd',
    },
  },
  {
    id: 'specialized_advertising',
    order: 3,
    name: 'الخدمات الإعلانية',
    description: 'إطلاق المواد الإعلانية وتكييف الرسائل ورفع الوصول.',
    enabled: true,
    iconHint: 'megaphone-outline',
    visual: {
      glyph: 'إ',
      shortLabel: 'إعلانية',
      accent: '#ff8a3d',
      soft: '#fff2e8',
      ring: '#ffd6bd',
    },
  },
  {
    id: 'specialized_financial_consulting',
    order: 4,
    name: 'الاستشارات المالية',
    description: 'تسعير وجدوى ومراجعات مالية مرتبطة بقرار الإطلاق.',
    enabled: true,
    iconHint: 'wallet-outline',
    visual: {
      glyph: 'م',
      shortLabel: 'مالية',
      accent: '#b98418',
      soft: '#fff8e8',
      ring: '#f1dfb4',
    },
  },
  {
    id: 'specialized_legal_consulting',
    order: 5,
    name: 'الاستشارات القانونية',
    description: 'عقود ومذكرات تشغيل ومراجعات نظامية قبل التنفيذ.',
    enabled: true,
    iconHint: 'document-text-outline',
    visual: {
      glyph: 'ق',
      shortLabel: 'قانونية',
      accent: '#58708c',
      soft: '#eff4fa',
      ring: '#d7e0ea',
    },
  },
  {
    id: 'specialized_web_development',
    order: 6,
    name: 'تطوير المواقع',
    description: 'مواقع وصفحات هبوط وبوابات تشغيل مرتبطة بالعميل.',
    enabled: true,
    iconHint: 'globe-outline',
    visual: {
      glyph: 'و',
      shortLabel: 'مواقع',
      accent: '#1fb7a6',
      soft: '#e8fbf6',
      ring: '#c9efe6',
    },
  },
  {
    id: 'specialized_maintenance',
    order: 7,
    name: 'الصيانة المتخصصة',
    description: 'زيارات متابعة وتشخيص وتشغيل ميداني لما بعد الإطلاق.',
    enabled: true,
    iconHint: 'build-outline',
    visual: {
      glyph: 'ع',
      shortLabel: 'صيانة',
      accent: '#6d7f95',
      soft: '#eef3f8',
      ring: '#d5dfeb',
    },
  },
  {
    id: 'specialized_marketing_campaigns',
    order: 8,
    name: 'الحملات التسويقية',
    description: 'إدارة حملات الإطلاق والقياس وإثبات الأداء.',
    enabled: true,
    iconHint: 'trending-up-outline',
    visual: {
      glyph: 'س',
      shortLabel: 'تسويق',
      accent: '#28b36a',
      soft: '#ecfbf2',
      ring: '#caefd9',
    },
  },
  {
    id: 'specialized_brand_strategy',
    order: 9,
    name: 'استراتيجية العلامة',
    description: 'تثبيت توجه العلامة ونبرة الرسالة قبل البناء الإبداعي.',
    enabled: true,
    iconHint: 'grid-outline',
    visual: {
      glyph: 'ه',
      shortLabel: 'استراتيجية',
      accent: '#0f172a',
      soft: '#f8fafc',
      ring: '#cbd5e1',
    },
  },
  {
    id: 'specialized_content_production',
    order: 10,
    name: 'إنتاج المحتوى',
    description: 'محتوى حملات وصفحات وقصص استخدام مرتبط بالمراحل التشغيلية.',
    enabled: false,
    iconHint: 'document-text-outline',
    visual: {
      glyph: 'ن',
      shortLabel: 'محتوى',
      accent: '#ff8a3d',
      soft: '#fff2e8',
      ring: '#ffd6bd',
    },
  },
];

export const SND_REQUEST_FIXTURES: SndRequestFixture[] = [
  {
    id: 'request-1',
    ref: 'SND-2407',
    title: 'اعتماد فئة جديدة قبل النشر للعميل',
    status: 'pending',
    updated: 'الآن',
    source: 'من الاستوديو',
    categoryId: 'specialized_brand_strategy',
    owner: 'فريق بناء الفئات',
    requester: 'مشرف الكتالوج',
    clientName: 'محفظة إطلاق الربيع',
    channel: 'لوحة التحكم',
    eta: 'خلال 30 دقيقة',
    summary:
      'الفئة جاهزة من ناحية الهوية والوصف لكنها تنتظر اعتماد الظهور داخل التطبيق.',
    signals: [
      'تحتاج قرار نشر',
      'الفئة غير مرئية للعميل',
      'لا توجد ملاحظات تصميمية',
    ],
  },
  {
    id: 'request-2',
    ref: 'SND-2401',
    title: 'تصميم هوية سريعة لمبادرة جديدة',
    status: 'pending',
    updated: 'قبل دقيقة',
    source: 'من التطبيق',
    categoryId: 'specialized_graphic_design',
    owner: 'فريق الهوية',
    requester: 'منتج المبادرة',
    clientName: 'مبادرة رشد',
    channel: 'تطبيق العميل',
    eta: 'اليوم',
    summary:
      'وصل الطلب من العميل ويحتاج تعيين المالك واعتماد موجز العمل قبل نقله للمراجعة.',
    signals: [
      'الملف المرفق مكتمل',
      'بحاجة إلى مالك واضح',
      'الأولوية الحالية هي سرعة الاستجابة',
    ],
  },
  {
    id: 'request-3',
    ref: 'SND-2398',
    title: 'مراجعة مسار قانوني لعقد تشغيل',
    status: 'in_progress',
    updated: 'قبل 6 دقائق',
    source: 'قيد التنفيذ',
    categoryId: 'specialized_legal_consulting',
    owner: 'الفريق القانوني',
    requester: 'إدارة العقود',
    clientName: 'تشغيل النخبة',
    channel: 'تحويل داخلي',
    eta: 'خلال 4 ساعات',
    summary:
      'المسار القانوني معتمد ويجري تنفيذه مع متابعة المخرجات النهائية.',
    signals: [
      'لا توجد ملاحظات مفتوحة',
      'المرفقات النظامية مرفوعة',
      'التنفيذ مرتبط بتسليم النسخة النهائية',
    ],
  },
  {
    id: 'request-4',
    ref: 'SND-2392',
    title: 'حملة أداء لطرح منتج جديد',
    status: 'in_progress',
    updated: 'قبل 18 دقيقة',
    source: 'قيد التنفيذ',
    categoryId: 'specialized_marketing_campaigns',
    owner: 'فريق الأداء',
    requester: 'قيادة النمو',
    clientName: 'إطلاق بلس',
    channel: 'ورشة التشغيل',
    eta: '48 ساعة',
    summary:
      'العمل جارٍ على خطة الأداء والنسخ الإعلانية مع مراقبة مؤشرات الإطلاق.',
    signals: [
      'لوحة القياس جاهزة',
      'الموازنة مثبتة',
      'النشر مرتبط بموعد إطلاق المنتج',
    ],
  },
  {
    id: 'request-5',
    ref: 'SND-2386',
    title: 'تطوير صفحة هبوط عالية التحويل',
    status: 'completed',
    updated: 'قبل ساعة',
    source: 'أغلق بنجاح',
    categoryId: 'specialized_web_development',
    owner: 'فريق الويب',
    requester: 'التجارة الرقمية',
    clientName: 'نقطة نمو',
    channel: 'إحالة تشغيلية',
    eta: 'تم التسليم',
    summary:
      'أُنجزت الصفحة وربطت بالتحليلات ولا توجد خطوة تشغيلية إضافية مطلوبة.',
    signals: ['تمت المراجعة النهائية', 'التحليلات مفعلة', 'الملف جاهز للأرشفة'],
  },
  {
    id: 'request-6',
    ref: 'SND-2410',
    title: 'نموذج أولي لتطبيق خدمة ميدانية',
    status: 'pending',
    updated: 'قبل 3 دقائق',
    source: 'من التطبيق',
    categoryId: 'specialized_app_development',
    owner: 'فريق التطبيقات',
    requester: 'مدير الخدمة',
    clientName: 'تشغيل الميدان',
    channel: 'بوابة العميل',
    eta: 'خلال يوم',
    summary:
      'الطلب يحتاج فرز المتطلبات وتثبيت المجال قبل بدء المراجعة التقنية.',
    signals: [
      'الوظائف الأساسية محددة',
      'الميزانية التقديرية مبدئية',
      'يتطلب ربطًا مع فريق الهوية',
    ],
  },
  {
    id: 'request-7',
    ref: 'SND-2404',
    title: 'محتوى إطلاق لسلسلة عروض موسمية',
    status: 'cancelled',
    updated: 'قبل 11 دقيقة',
    source: 'ألغي قبل التنفيذ',
    categoryId: 'specialized_content_production',
    owner: 'فريق المحتوى',
    requester: 'فريق العروض',
    clientName: 'موسم المبيعات',
    channel: 'طلب داخلي',
    eta: 'قبل نهاية اليوم',
    summary:
      'أغلق الطلب بعد إيقاف الحملة ولم يعد هناك مسار تنفيذي مطلوب له.',
    signals: [
      'القرار النهائي صدر بالإلغاء',
      'لا توجد خطوة تشغيلية لاحقة',
      'الأرشفة مطلوبة فقط',
    ],
  },
];
