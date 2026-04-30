/**
 * Fixture for CONTROL PANEL partner orders page.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export function buildPartnerOrdersMock(t: TFunction): Order[] {
  return [
    {
      id: 'ORD-001',
      customerName: 'أحمد محمد',
      customerPhone: '+966501234567',
      status: 'pending',
      totalAmount: 45.5,
      createdAt: '2026-02-11T10:30:00Z',
      items: [
        { name: t('surfaces.برجر_كلاسيكي'), quantity: 1, price: 25 },
        { name: t('surfaces.بطاطس_مقلية'), quantity: 1, price: 15 },
        { name: t('surfaces.مشروب_غازي'), quantity: 1, price: 5.5 },
      ],
    },
    {
      id: 'ORD-002',
      customerName: t('surfaces.فاطمة_علي'),
      customerPhone: '+966507654321',
      status: 'accepted',
      totalAmount: 32,
      createdAt: '2026-02-11T10:15:00Z',
      items: [{ name: t('surfaces.بيتزا_مارغريتا'), quantity: 1, price: 32 }],
    },
    {
      id: 'ORD-003',
      customerName: t('surfaces.محمد_أحمد'),
      customerPhone: '+966509876543',
      status: 'preparing',
      totalAmount: 78.5,
      createdAt: '2026-02-11T09:45:00Z',
      items: [
        { name: t('surfaces.وجبة_عائلية'), quantity: 1, price: 65 },
        { name: t('surfaces.سلطة'), quantity: 1, price: 13.5 },
      ],
    },
  ];
}

