/**
 * Fixture for WLT payment methods list (auto_wlt_payment_methods_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
  expiryDate?: string;
  icon: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildWltPaymentMethodsMock(t: TFunction): PaymentMethod[] {
  return [
    {
      id: '1',
      type: 'card',
      name: t('surfaces.البطاقة_الائتمانية'),
      details: '**** **** **** 1234',
      isDefault: true,
      isVerified: true,
      expiryDate: '12/26',
      icon: '💳',
    },
    {
      id: '2',
      type: 'bank',
      name: t('surfaces.الحساب_البنكي'),
      details: 'SA001000000123456789',
      isDefault: false,
      isVerified: true,
      icon: '🏦',
    },
    {
      id: '3',
      type: 'wallet',
      name: t('surfaces.محفظة_STC_Pay'),
      details: '0501234567',
      isDefault: false,
      isVerified: false,
      icon: '📱',
    },
  ];
}
