// Dev/demo fixtures for wlt_settlement_get and wlt_settlements_list. Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'credit' | 'debit';
}

export interface SettlementDetail {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'merchant' | 'provider' | 'partner';
  date: string;
  description: string;
  merchantName: string;
  accountNumber: string;
  bankName: string;
  transactions: Transaction[];
  fees: number;
  netAmount: number;
}

export interface Settlement {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'merchant' | 'provider' | 'partner';
  date: string;
  description: string;
}

type TFunction = (key: string) => string;

export function buildSettlementGetMock(t: TFunction): SettlementDetail {
  return {
    id: 'stl_001',
    reference: 'STL-2024-001',
    amount: 1250.5,
    currency: 'SAR',
    status: 'completed',
    type: 'merchant',
    date: '2024-01-15',
    description: t('wlt.app-client.mobile.auto_wlt_settlement_get.mockSettlementElectronics'),
    merchantName: t('surfaces.متجر_الإلكترونيات_المحدودة'),
    accountNumber: 'SA1234567890123456789012',
    bankName: t('surfaces.البنك_الأهلي_السعودي'),
    fees: 12.5,
    netAmount: 1238.0,
    transactions: [
      {
        id: 'txn_001',
        amount: 450.0,
        description: t('wlt.app-client.mobile.auto_wlt_settlement_get.payPhoneBill'),
        date: '2024-01-10',
        type: 'credit',
      },
      {
        id: 'txn_002',
        amount: 320.5,
        description: t('wlt.app-client.mobile.auto_wlt_settlement_get.payLaptopBill'),
        date: '2024-01-12',
        type: 'credit',
      },
      {
        id: 'txn_003',
        amount: 480.0,
        description: t('wlt.app-client.mobile.auto_wlt_settlement_get.payAudioBill'),
        date: '2024-01-14',
        type: 'credit',
      },
    ],
  };
}

export function buildSettlementsListMock(t: TFunction): Settlement[] {
  return [
    {
      id: 'stl_001',
      reference: 'STL-2024-001',
      amount: 1250.5,
      currency: 'SAR',
      status: 'completed',
      type: 'merchant',
      date: '2024-01-15',
      description: t('wlt.app-client.mobile.auto_wlt_settlements_list.merchantSettlementElectronic'),
    },
    {
      id: 'stl_002',
      reference: 'STL-2024-002',
      amount: 890.75,
      currency: 'SAR',
      status: 'completed',
      type: 'provider',
      date: '2024-01-14',
      description: t('wlt.app-client.mobile.auto_wlt_settlements_list.providerSettlementFood'),
    },
    {
      id: 'stl_003',
      reference: 'STL-2024-003',
      amount: 2100.0,
      currency: 'SAR',
      status: 'pending',
      type: 'partner',
      date: '2024-01-16',
      description: t('wlt.app-client.mobile.auto_wlt_settlements_list.partnerSettlementBookings'),
    },
  ];
}

