/**
 * Fixture for WLT subscription plans list (auto_wlt_subscriptions_plans_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular: boolean;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildWltSubscriptionPlansListMock(t: TFunction): SubscriptionPlan[] {
  return [
    {
      id: '1',
      name: t('surfaces.الباقة_الأساسية'),
      price: 25,
      currency: t('surfaces.ريال'),
      period: 'شهرياً',
      features: [t('surfaces.تحويلات_غير_محدودة'), 'رسوم مخفضة', 'دعم فني'],
      popular: false,
    },
    {
      id: '2',
      name: t('surfaces.الباقة_الذهبية'),
      price: 50,
      currency: 'ريال',
      period: 'شهرياً',
      features: [
        t('surfaces.جميع_مزايا_الباقة_الأساسية'),
        t('surfaces.تحويلات_دولية'),
        t('surfaces.بطاقة_ائتمانية'),
        t('surfaces.تأمين_على_المعاملات'),
      ],
      popular: true,
    },
    {
      id: '3',
      name: t('surfaces.الباقة_الماسية'),
      price: 100,
      currency: 'ريال',
      period: 'شهرياً',
      features: [
        t('surfaces.جميع_مزايا_الباقة_الذهبية'),
        t('surfaces.مدير_علاقات_شخصي'),
        t('surfaces.تحليلات_مالية'),
        t('surfaces.استشارات_استثمارية'),
      ],
      popular: false,
    },
  ];
}
