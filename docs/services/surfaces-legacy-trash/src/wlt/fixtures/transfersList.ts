/**
 * Fixture for WLT transfers list (auto_wlt_transfers_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface Transfer {
  id: string;
  type: 'outgoing' | 'incoming';
  amount: number;
  currency: string;
  recipient: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  reference: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildWltTransfersListMock(t: TFunction): Transfer[] {
  return [
    {
      id: 'TRF-001',
      type: 'outgoing',
      amount: 150,
      currency: 'ريال',
      recipient: 'أحمد محمد',
      status: 'completed',
      date: '2024-02-10',
      time: '14:30',
      reference: 'TRF-2024-001-ABC123',
    },
    {
      id: 'TRF-002',
      type: 'incoming',
      amount: 200,
      currency: 'ريال',
      recipient: t('surfaces.من_محمد_سالم'),
      status: 'completed',
      date: '2024-02-09',
      time: '11:15',
      reference: 'TRF-2024-002-DEF456',
    },
    {
      id: 'TRF-003',
      type: 'outgoing',
      amount: 75,
      currency: 'ريال',
      recipient: 'فاطمة علي',
      status: 'pending',
      date: '2024-02-08',
      time: '16:45',
      reference: 'TRF-2024-003-GHI789',
    },
    {
      id: 'TRF-004',
      type: 'outgoing',
      amount: 300,
      currency: 'ريال',
      recipient: 'شركة الكهرباء',
      status: 'failed',
      date: '2024-02-07',
      time: '09:20',
      reference: 'TRF-2024-004-JKL012',
    },
  ];
}
