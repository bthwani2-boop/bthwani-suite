export type LoyaltyBenefitMode = 'loyalty';

export type LoyaltyBenefitItem = {
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type LoyaltyMetricFixture = {
  label: string;
  value: string;
  helperText: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
};

export type LoyaltySectionFixture = {
  title: string;
  subtitle: string;
  badgeLabel: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
  items: Array<{
    label: string;
    value: string;
    helperText?: string;
    tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  }>;
};

export type LoyaltyRewardsFixture = {
  title: string;
  subtitle: string;
  note: string;
  metrics: LoyaltyMetricFixture[];
  sections: LoyaltySectionFixture[];
};

export const loyaltyBenefitSurfaceItems: Record<LoyaltyBenefitMode, LoyaltyBenefitItem[]> = {
  loyalty: [
    { title: 'loyalty-points-client-balance', subtitle: 'عرض الرصيد الحالي لنقاط الولاء.', meta: 'الرصيد', badgeLabel: 'مباشر' },
    { title: 'loyalty-points-redeem', subtitle: 'استبدال النقاط داخل نفس السطح.', meta: 'استبدال', badgeLabel: 'مباشر' },
    { title: 'loyalty-points-client-history', subtitle: 'مراجعة سجل الكسب والاستبدال.', meta: 'السجل', badgeLabel: 'مراجعة' },
    { title: 'entitlements-get', subtitle: 'التحقق من الاستحقاقات المتاحة.', meta: 'المزايا', badgeLabel: 'تحقق' },
  ],
};

export const loyaltyBenefitKeyValues: Record<LoyaltyBenefitMode, Array<{ label: string; value: string }>> = {
  loyalty: [
    { label: 'الرصيد', value: 'loyalty-points-client-balance' },
    { label: 'الاستبدال', value: 'loyalty-points-redeem' },
    { label: 'السجل', value: 'loyalty-points-client-history' },
  ],
};

export const loyaltyRewardsFixture: LoyaltyRewardsFixture = {
  title: 'الولاء والمكافآت',
  subtitle: 'كل الرصيد، المكافآت، السجل، والمزايا المرتبطة يظهرون مباشرة في صفحة واحدة.',
  note: 'بيانات تجريبية للعرض فقط داخل بيئة التطوير.',
  metrics: [
    { label: 'الرصيد الحالي', value: '3,280 نقطة', helperText: 'صالحة حتى 30/06', tone: 'brand' },
    { label: 'مكافآت متاحة', value: '12', helperText: 'يمكن رؤيتها مباشرة', tone: 'info' },
    { label: 'عمليات هذا الشهر', value: '8', helperText: '3 استبدالات و5 إضافات', tone: 'warning' },
    { label: 'المزايا النشطة', value: '4', helperText: 'جاهزة للاستخدام', tone: 'success' },
  ],
  sections: [
    {
      title: 'رصيد الولاء',
      subtitle: 'عرض الرصيد الحالي لنقاط الولاء.',
      badgeLabel: 'مباشر',
      tone: 'brand',
      items: [
        { label: 'الرصيد الحالي', value: '3,280 نقطة', helperText: 'آخر تحديث قبل 5 دقائق', tone: 'brand' },
        { label: 'النقاط القابلة للاستبدال', value: '2,940 نقطة', helperText: 'بعد خصم المعلق', tone: 'default' },
        { label: 'النقاط المعلقة', value: '340 نقطة', helperText: 'من الطلبات قيد التسوية', tone: 'warning' },
      ],
    },
    {
      title: 'المكافآت',
      subtitle: 'استبدال النقاط داخل نفس السطح.',
      badgeLabel: 'متاح',
      tone: 'info',
      items: [
        { label: 'قهوة مجانية', value: '120 نقطة', helperText: 'متاحة الآن', tone: 'info' },
        { label: 'توصيل مجاني', value: '180 نقطة', helperText: 'صالحة 7 أيام', tone: 'default' },
        { label: 'خصم 20%', value: '240 نقطة', helperText: 'الأكثر استخدامًا', tone: 'warning' },
      ],
    },
    {
      title: 'سجل الولاء',
      subtitle: 'مراجعة سجل الكسب والاستبدال.',
      badgeLabel: 'مرئي',
      tone: 'warning',
      items: [
        { label: 'استبدال قهوة', value: '-120 نقطة', helperText: 'اليوم · 12:40', tone: 'danger' },
        { label: 'نقاط طلب سابق', value: '+240 نقطة', helperText: 'أمس · 19:05', tone: 'success' },
        { label: 'نقاط ترحيبية', value: '+500 نقطة', helperText: 'هذا الشهر', tone: 'brand' },
      ],
    },
    {
      title: 'المزايا المرتبطة',
      subtitle: 'التحقق من الاستحقاقات المتاحة.',
      badgeLabel: 'جاهز',
      tone: 'success',
      items: [
        { label: 'شحن أسرع', value: 'مفعّل', helperText: 'ينطبق على الطلبات المؤهلة', tone: 'success' },
        { label: 'دعم أولوية', value: 'مفعّل', helperText: 'خدمة أسرع من المعتاد', tone: 'brand' },
        { label: 'عروض مخصصة', value: 'مفعّل', helperText: 'اقتراحات مرتبطة بالرصد', tone: 'info' },
      ],
    },
  ],
};
