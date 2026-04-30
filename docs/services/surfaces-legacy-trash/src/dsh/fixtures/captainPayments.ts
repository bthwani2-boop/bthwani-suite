/**
 * Fixture for captain payments (auto_captain_payments).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface PaymentRecord {
  id: string;
  type: 'withdrawal' | 'bonus' | 'penalty' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  paymentMethod?: string;
}

export interface PaymentStats {
  totalPaid: number;
  pendingPayments: number;
  monthlyAverage: number;
  lastPayment: {
    amount: number;
    date: string;
  } | null;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-captain.mobile.auto_captain_payments';

export function buildCaptainPaymentsMock(t: TFunction): { records: PaymentRecord[]; stats: PaymentStats } {
  return {
    records: [
      { id: 'pay_001', type: 'withdrawal', amount: -500.00, description: t('surfaces.dsh_withdrawal_bank_named', { bank: t(`${NS}.l55`) }), date: '2024-01-14 14:30', status: 'completed', reference: 'WD-2024-001', paymentMethod: t(`${NS}.l59`) },
      { id: 'pay_002', type: 'bonus', amount: 25.00, description: t('surfaces.dsh_bonus_performance_january'), date: '2024-01-01 09:00', status: 'completed', reference: 'BONUS-2024-001' },
      { id: 'pay_003', type: 'penalty', amount: -15.00, description: t('surfaces.dsh_penalty_delay'), date: '2023-12-28 16:45', status: 'completed', reference: 'PEN-2023-015' },
      { id: 'pay_004', type: 'withdrawal', amount: -300.00, description: t('surfaces.dsh_withdrawal_bank_named', { bank: t(`${NS}.l83`) }), date: '2024-01-10 11:20', status: 'pending', reference: 'WD-2024-002', paymentMethod: t(`${NS}.l87`) },
    ],
    stats: {
      totalPaid: 2340.00,
      pendingPayments: 300.00,
      monthlyAverage: 780.00,
      lastPayment: { amount: 500.00, date: '2024-01-14' },
    },
  };
}
