export type SubscriptionPlanCard = {
  id: 'weekly' | 'monthly' | 'family';
  title: string;
  price: string;
  cadence: string;
  note: string;
  highlight: string;
  current?: boolean;
  featured?: boolean;
};

export const subscriptionHeroCopy = {
  eyebrow: 'بثواني برو',
  title: 'الاشتراكات',
  subtitle: 'دفع وتبديل وإدارة من نفس الصفحة.',
  note: 'العائلة حزمة داخل بثواني برو وليست منتجاً منفصلاً.',
} as const;

export const subscriptionPlanCards: SubscriptionPlanCard[] = [
  {
    id: 'weekly',
    title: 'برو أسبوع',
    price: '500',
    cadence: 'ريال / أسبوع',
    note: 'خيار سريع للاستخدام القصير أو التجربة العملية.',
    highlight: 'أسرع بداية',
    current: true,
  },
  {
    id: 'monthly',
    title: 'برو فردي',
    price: '1000',
    cadence: 'ريال / شهر',
    note: 'الخيار المتوازن للاستخدام اليومي والشخصي.',
    highlight: 'الخيار المتوازن',
    featured: true,
  },
  {
    id: 'family',
    title: 'برو عائلي',
    price: '2000',
    cadence: 'ريال / شهر',
    note: 'حزمة عائلية داخل بثواني برو مع وضوح كامل للمزايا.',
    highlight: 'الأكثر شمولاً',
  },
];
