export type LoyaltyCommercialSignal = {
  lane: 'subscription' | 'loyalty' | 'coupon';
  title: string;
  value: string;
  description: string;
};

export type LoyaltyCommercialLaneItem = {
  lane: 'subscription' | 'loyalty' | 'coupon' | 'all';
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export const loyaltyCommercialSignals: LoyaltyCommercialSignal[] = [
  {
    lane: 'subscription',
    title: 'اشتراك الأسرة',
    value: 'الخطة الأسرية',
    description: 'إدارة الخطة والترقية والمزامنة من نفس المسار التجاري الحقيقي.',
  },
  {
    lane: 'loyalty',
    title: 'رصيد النقاط',
    value: 'ميزان الولاء',
    description: 'الرصيد والاستبدال والسجل يظهرون كقيمة تشغيلية واضحة قبل الدفع.',
  },
  {
    lane: 'coupon',
    title: 'تطبيق الكوبون',
    value: 'قيمة فورية',
    description: 'الكوبونات تبقى جزءًا من مسار التسعير الحقيقي لا عنصرًا بصريًا منفصلًا.',
  },
];

export const loyaltyCommercialLaneItems: LoyaltyCommercialLaneItem[] = [
  {
    lane: 'subscription',
    title: 'إدارة أفراد الاشتراك',
    subtitle: 'تعديل الخطة وإضافة أفراد الأسرة ومراجعة الترقيات من نفس السطح.',
    meta: 'اشتراك حي',
    badgeLabel: 'تشغيل',
  },
  {
    lane: 'loyalty',
    title: 'الاستبدال ورصيد النقاط',
    subtitle: 'عرض الرصيد والاسترداد والسجل بطريقة واضحة ومباشرة للفريق التجاري.',
    meta: 'ولاء حي',
    badgeLabel: 'قيمة',
  },
  {
    lane: 'coupon',
    title: 'تطبيق الكوبون والعرض',
    subtitle: 'الخصومات تبقى ضمن تجربة السعر والدفع مع وضوح أعلى في التحكم.',
    meta: 'سعر وعرض',
    badgeLabel: 'حملة',
  },
  {
    lane: 'all',
    title: 'الاستحقاقات والمزايا',
    subtitle: 'إظهار الحقوق والمزايا الفعلية للعميل دون نصوص تقنية أو حالات مبهمة.',
    meta: 'استحقاقات',
    badgeLabel: 'وضوح',
  },
  {
    lane: 'all',
    title: 'التدقيق والمزامنة',
    subtitle: 'متابعة التغييرات والنشر والمراجعة من نفس غرفة القيادة.',
    meta: 'حوكمة',
    badgeLabel: 'حماية',
  },
];

export const loyaltyCommercialKeyValues = [
  { label: 'المسار الأساسي', value: 'الخطة الأسرية' },
  { label: 'قناة الخصومات', value: 'العروض والدفع' },
  { label: 'رؤية النقاط', value: 'ميزان الولاء' },
  { label: 'الاستحقاقات', value: 'المزايا الفعلية' },
] as const;
