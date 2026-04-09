/**
 * Fixture for WLT subscription status (auto_wlt_subscription_status_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface SubscriptionStatus {
  planName: string;
  status: string;
  currentPeriod: {
    startDate: string;
    endDate: string;
    daysRemaining: number;
  };
  features: string[];
  usage: {
    withdrawals: { used: number; limit: number; unit: string };
    transfers: { used: number; limit: number; unit: string };
    supportTickets: { used: number; limit: number; unit: string };
  };
  billing: {
    monthlyFee: number;
    nextBilling: string;
    paymentMethod: string;
  };
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildWltSubscriptionStatusMock(t: TFunction): SubscriptionStatus {
  return {
    planName: 'الخطة الذهبية',
    status: 'active',
    currentPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      daysRemaining: 45,
    },
    features: [
      'سحب غير محدود',
      'تحويل فوري',
      'رسوم مخفضة',
      'دعم فني 24/7',
      'تقارير شهرية',
    ],
    usage: {
      withdrawals: { used: 12, limit: 50, unit: 'سحب' },
      transfers: { used: 25, limit: 100, unit: 'تحويل' },
      supportTickets: { used: 3, limit: 10, unit: t('surfaces.تذكرة') },
    },
    billing: {
      monthlyFee: 29.99,
      nextBilling: '2024-02-01',
      paymentMethod: t('surfaces.البطاقة_الائتمانية_1234'),
    },
  };
}
