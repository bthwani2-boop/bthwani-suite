/**
 * Fixture for WLT home screen (auto_wlt_home_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface WltBanner {
  id: string;
  title?: string;
  image_url?: string;
  description?: string;
  action_url?: string;
}

export interface WltQuickAction {
  id: string;
  name: string;
  icon: string;
  screen: string;
  color: string;
  params?: Record<string, unknown>;
}

export interface WltTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  timestamp: string;
}

export interface WltHomeData {
  balance?: number;
  available_balance?: number;
  pending_balance?: number;
  total_transactions?: number;
  banners?: WltBanner[];
  quickActions?: WltQuickAction[];
  recentTransactions?: WltTransaction[];
  paymentMethods?: Array<{ id: string; type: string; last4: string; isDefault: boolean }>;
}

export interface WltHomeRoles {
  primaryCTA: string;
  stateSuccess: { icon: string };
  stateWarning: { icon: string };
  stateInfo: { icon: string };
  stateError: { icon: string };
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildWltHomeMock(t: TFunction, roles: WltHomeRoles): WltHomeData {
  return {
    balance: 1250.5,
    available_balance: 1200.0,
    pending_balance: 50.5,
    total_transactions: 45,
    banners: [],
    quickActions: [
      { id: '1', name: 'شحن الرصيد', icon: '💳', screen: 'WltTopup', color: roles.primaryCTA },
      { id: '2', name: 'سداد', icon: '🧾', screen: 'WltSudadHome', color: roles.stateSuccess.icon },
      { id: '3', name: 'مكافآت والخصومات', icon: '🎁', screen: 'WltRewardsHome', color: roles.stateWarning.icon },
      { id: '5', name: 'استلم باقي الصرف', icon: '📥', screen: 'WltReceiveChangeFromCaptain', color: roles.stateInfo.icon },
      { id: '9', name: 'أسعار الصرف', icon: '💱', screen: 'WltExchangePrice', color: roles.stateInfo.icon },
    ],
    paymentMethods: undefined,
    recentTransactions: [
      {
        id: 'TXN-001',
        type: 'deposit',
        amount: 500.0,
        status: 'completed',
        description: t('wlt.app-client.mobile.auto_wlt_home_get.topUpBalance'),
        timestamp: t('surfaces.منذ_ساعتين'),
      },
      {
        id: 'TXN-002',
        type: 'payment',
        amount: -25.5,
        status: 'completed',
        description: t('wlt.app-client.mobile.auto_wlt_home_get.payDeliveryOrder'),
        timestamp: t('surfaces.منذ_يوم'),
      },
      {
        id: 'TXN-003',
        type: 'transfer',
        amount: -100.0,
        status: 'pending',
        description: t('wlt.app-client.mobile.auto_wlt_home_get.transferToWallet'),
        timestamp: t('surfaces.منذ_3_أيام'),
      },
    ],
  };
}

