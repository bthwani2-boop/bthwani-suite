export type DshPartnerIntakeSource = 'app-field' | 'app-partner';
export type DshPartnerIntakeStage = 'pending-partner' | 'pending-marketing' | 'published';

export type DshPartnerIntakeItem = {
  id: string;
  productName: string;
  categoryLabel: string;
  source: DshPartnerIntakeSource;
  stage: DshPartnerIntakeStage;
  ownerLabel: string;
  note: string;
  submittedAt: string;
};

export type DshPartnerIntakeMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

export const dshPartnerIntakeMetrics: ReadonlyArray<DshPartnerIntakeMetric> = [
  {
    id: 'metric-partner-pending',
    label: 'المراجعة الأولية',
    value: 4,
    description: 'عناصر وصلت من الميداني أو الشريك وتنتظر الموافقة الأولى.',
  },
  {
    id: 'metric-marketing-pending',
    label: 'المراجعة التسويقية',
    value: 2,
    description: 'بطاقات مرّت على الشركاء وتنتظر الموافقة التسويقية.',
  },
  {
    id: 'metric-live-catalog',
    label: 'الكتالوج المباشر',
    value: 28,
    description: 'كل ما نُشر بالفعل وأصبح ظاهرًا لكل الشركاء.',
  },
];

export const dshPartnerIntakeItems: ReadonlyArray<DshPartnerIntakeItem> = [
  {
    id: 'product-olive-oil',
    productName: 'زيت زيتون بكر ممتاز',
    categoryLabel: 'المقاضي',
    source: 'app-field',
    stage: 'pending-partner',
    ownerLabel: 'الميداني',
    note: 'أضيف من الحقل ويحتاج فقط للمراجعة الأولى قبل التحويل.',
    submittedAt: 'اليوم 09:40',
  },
  {
    id: 'product-coffee-beans',
    productName: 'حبوب قهوة مختصة',
    categoryLabel: 'المقاهي',
    source: 'app-partner',
    stage: 'pending-partner',
    ownerLabel: 'الشريك',
    note: 'منتج جديد أرسله الشريك مباشرة على بوابة الإضافة.',
    submittedAt: 'اليوم 10:05',
  },
  {
    id: 'product-cookie-box',
    productName: 'صندوق كوكيز موسمية',
    categoryLabel: 'المطاعم',
    source: 'app-partner',
    stage: 'pending-marketing',
    ownerLabel: 'الشريك',
    note: 'اجتاز المراجعة الأولية ويحتاج ضبطًا تسويقيًا قبل النشر.',
    submittedAt: 'اليوم 11:15',
  },
  {
    id: 'product-published-meal',
    productName: 'وجبة جاهزة عائلية',
    categoryLabel: 'المطاعم',
    source: 'app-field',
    stage: 'published',
    ownerLabel: 'الكتالوج',
    note: 'منتج منشور بالكامل ويظهر الآن لكل الشركاء.',
    submittedAt: 'أمس 07:55',
  },
];

export const dshPartnerApprovalLanes = [
  {
    id: 'lane-field',
    title: 'الوارد من الميداني',
    description: 'الطلب يدخل من الحقل ثم يمر على بوابة الشركاء أولًا.',
  },
  {
    id: 'lane-partner',
    title: 'مراجعة الشركاء',
    description: 'القبول أو الرفض الأولي يبقى واضحًا داخل نفس لوحة العمل.',
  },
  {
    id: 'lane-marketing',
    title: 'مراجعة التسويق',
    description: 'بعد القبول الأولي تنتقل البطاقة لتثبيت العرض التسويقي.',
  },
  {
    id: 'lane-catalog',
    title: 'نشر الكتالوج',
    description: 'بعد الاعتماد النهائي تصبح البطاقة عامة لكل الشركاء.',
  },
] as const;
