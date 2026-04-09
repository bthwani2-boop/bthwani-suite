/**
 * Marketing Promotions Mock Data
 * Source of truth for promo code fixtures in CONTROL PANEL Marketing screens.
 */

export interface PromoFixture {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: string;
  minOrder: string;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'scheduled' | 'depleted';
}

export const PROMO_STATUS_CONFIG = {
  active: { bg: '#DCFCE7', text: '#16A34A', label: 'نشط' },
  expired: { bg: '#FEE2E2', text: '#DC2626', label: 'منتهي' },
  scheduled: { bg: '#DBEAFE', text: '#2563EB', label: 'مجدول' },
  depleted: { bg: '#F3F4F6', text: '#6B7280', label: 'مستنفد' },
} as const;

export const PROMO_TYPE_LABELS = {
  percentage: 'نسبة مئوية',
  fixed: 'مبلغ ثابت',
  free_delivery: 'توصيل مجاني',
} as const;

export const PROMOTIONS_STATS = [
  { label: 'إجمالي الأكواد', value: '24', color: '#8B5CF6' },
  { label: 'نشط', value: '8', color: '#22C55E' },
  { label: 'إجمالي الاستخدام', value: '٤٥,٢٣٠', color: '#3B82F6' },
  { label: 'قيمة الخصومات', value: '١٨٠ ألف', color: '#F59E0B' },
] as const;

export const mockPromos: PromoFixture[] = [
  {
    code: 'WELCOME50',
    description: 'خصم ترحيبي للمستخدمين الجدد على الطلب الأول',
    type: 'percentage',
    value: '50%',
    minOrder: '50 ر.س',
    usageLimit: 10000,
    usedCount: 4520,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
  },
  {
    code: 'RAMADAN24',
    description: 'عرض رمضان - خصم على جميع الطلبات',
    type: 'fixed',
    value: '15 ر.س',
    minOrder: '75 ر.س',
    usageLimit: 5000,
    usedCount: 3200,
    startDate: '2024-03-10',
    endDate: '2024-04-09',
    status: 'active',
  },
  {
    code: 'FREEDEL',
    description: 'توصيل مجاني على الطلبات أكثر من 100 ر.س',
    type: 'free_delivery',
    value: 'توصيل مجاني',
    minOrder: '100 ر.س',
    usageLimit: 2000,
    usedCount: 2000,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    status: 'depleted',
  },
  {
    code: 'SUMMER24',
    description: 'عرض الصيف القادم - خصم حصري',
    type: 'percentage',
    value: '30%',
    minOrder: '60 ر.س',
    usageLimit: 8000,
    usedCount: 0,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'scheduled',
  },
];

