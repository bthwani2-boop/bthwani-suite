/**
 * Fixture for WLT transactions list (auto_wlt_transactions_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  counterparty?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'wlt.app-client.mobile.auto_wlt_transactions_list';

export function buildWltTransactionsListMock(t: TFunction): Transaction[] {
  return [
    {
      id: 'TXN-001',
      type: 'credit',
      amount: 500,
      currency: 'ريال',
      description: t(`${NS}.l74`),
      date: '2024-02-10',
      time: '14:30',
      status: 'completed',
      reference: 'REF-2024-001',
    },
    {
      id: 'TXN-002',
      type: 'debit',
      amount: 125.5,
      currency: 'ريال',
      description: t(`${NS}.l85`),
      date: '2024-02-09',
      time: '10:15',
      status: 'completed',
      reference: 'UTIL-2024-045',
      counterparty: t('surfaces.شركة_الكهرباء'),
    },
    {
      id: 'TXN-003',
      type: 'transfer',
      amount: 200,
      currency: 'ريال',
      description: t(`${NS}.l97`),
      date: '2024-02-08',
      time: '16:45',
      status: 'completed',
      reference: 'TRF-2024-012',
      counterparty: 'أحمد محمد',
    },
    {
      id: 'TXN-004',
      type: 'debit',
      amount: 75.25,
      currency: 'ريال',
      description: t(`${NS}.l109`),
      date: '2024-02-07',
      time: '12:20',
      status: 'completed',
      reference: 'PUR-2024-089',
      counterparty: t('surfaces.متجر_إلكترونيات'),
    },
    {
      id: 'TXN-005',
      type: 'credit',
      amount: 150,
      currency: 'ريال',
      description: t(`${NS}.l121`),
      date: '2024-02-06',
      time: '09:30',
      status: 'pending',
      reference: 'REF-2024-015',
      counterparty: 'متجر إلكترونيات',
    },
  ];
}

