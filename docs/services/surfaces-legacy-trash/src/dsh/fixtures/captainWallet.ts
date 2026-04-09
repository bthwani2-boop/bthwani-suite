/**
 * Fixture for captain wallet (auto_captain_wallet) — DSH and AMN.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface WalletData {
  balance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  availableForWithdrawal: number;
}

export interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'bonus';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-captain.mobile.auto_captain_wallet';

export function buildCaptainWalletMock(t: TFunction, isAmn: boolean): { walletData: WalletData; transactions: Transaction[] } {
  return {
    walletData: {
      balance: 1250.50,
      totalEarnings: isAmn ? 8750.00 : 8750.00,
      totalWithdrawals: 7500.00,
      availableForWithdrawal: 850.50,
    },
    transactions: isAmn
      ? [
          { id: 'txn_001', type: 'earning', amount: 45.00, description: t('surfaces.dsh_trip_riyadh'), date: '2024-01-15 14:30', status: 'completed' },
          { id: 'txn_002', type: 'earning', amount: 35.50, description: t('surfaces.dsh_trip_jeddah'), date: '2024-01-15 12:15', status: 'completed' },
          { id: 'txn_003', type: 'withdrawal', amount: -500.00, description: t('surfaces.dsh_withdrawal_to_bank'), date: '2024-01-14 10:00', status: 'completed' },
          { id: 'txn_004', type: 'bonus', amount: 25.00, description: t('surfaces.dsh_bonus_performance'), date: '2024-01-13 16:45', status: 'completed' },
        ]
      : [
          { id: 'txn_001', type: 'earning', amount: 45.00, description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l65`) }), date: '2024-01-15 14:30', status: 'completed' },
          { id: 'txn_002', type: 'earning', amount: 35.50, description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l66`) }), date: '2024-01-15 12:15', status: 'completed' },
          { id: 'txn_003', type: 'withdrawal', amount: -500.00, description: t('surfaces.dsh_withdrawal_to_bank'), date: '2024-01-14 10:00', status: 'completed' },
          { id: 'txn_004', type: 'bonus', amount: 25.00, description: t('surfaces.dsh_bonus_performance'), date: '2024-01-13 16:45', status: 'completed' },
        ],
  };
}
