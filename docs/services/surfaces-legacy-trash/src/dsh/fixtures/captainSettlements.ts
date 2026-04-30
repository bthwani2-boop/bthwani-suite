// Dev/demo fixture for captain_settlements. Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

export interface WithdrawalRequest {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault: boolean;
}

type TFunction = (key: string) => string;

export function buildWithdrawalRequestsMock(t: TFunction): WithdrawalRequest[] {
  return [
    {
      id: 'wd_001',
      amount: 500.0,
      bankName: t('dsh.app-captain.mobile.auto_captain_settlements.mockBankName1'),
      accountNumber: '****1234',
      accountHolder: t('dsh.app-captain.mobile.auto_captain_settlements.mockAccountName1'),
      status: 'completed',
      requestedAt: '2024-01-14 10:00',
      processedAt: '2024-01-14 14:30',
    },
    {
      id: 'wd_002',
      amount: 750.0,
      bankName: t('dsh.app-captain.mobile.auto_captain_settlements.mockBankName2'),
      accountNumber: '****5678',
      accountHolder: t('dsh.app-captain.mobile.auto_captain_settlements.mockAccountName2'),
      status: 'processing',
      requestedAt: '2024-01-12 09:15',
      notes: t('dsh.app-captain.mobile.auto_captain_settlements.statusUnderReview'),
    },
  ];
}

export function buildBankAccountsMock(t: TFunction): BankAccount[] {
  return [
    {
      id: 'acc_001',
      bankName: t('dsh.app-captain.mobile.auto_captain_settlements.mockBankName1Alt'),
      accountNumber: '****1234',
      accountHolder: t('dsh.app-captain.mobile.auto_captain_settlements.mockAccountName1Alt'),
      isDefault: true,
    },
    {
      id: 'acc_002',
      bankName: t('dsh.app-captain.mobile.auto_captain_settlements.mockBankName2Alt'),
      accountNumber: '****5678',
      accountHolder: t('dsh.app-captain.mobile.auto_captain_settlements.mockAccountName2Alt'),
      isDefault: false,
    },
  ];
}
