// Dev/demo fixture for wlt_refund_get. Isolated from runtime UI per RULE_DEV_DATA_ENV_AND_LEAK.

export interface RefundDetail {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reason: string;
  originalTransaction: {
    id: string;
    amount: number;
    date: string;
    description: string;
  };
  requestedAt: string;
  processedAt?: string;
  estimatedCompletion?: string;
  refundMethod: string;
  notes?: string;
}

type TFunction = (key: string) => string;

export function buildRefundMock(t: TFunction): RefundDetail {
  return {
    id: 'ref_001',
    reference: 'REF-2024-001',
    amount: 150.0,
    currency: 'SAR',
    status: 'completed',
    reason: t('surfaces.طلب_العميل_منتج_تالف'),
    requestedAt: '2024-01-10T14:30:00Z',
    processedAt: '2024-01-12T09:15:00Z',
    refundMethod: t('surfaces.محفظة_إلكترونية'),
    notes: t('surfaces.تمت_معالجة_الاسترداد_بنجاح_وإعادة_ال'),
    originalTransaction: {
      id: 'txn_123',
      amount: 150.0,
      date: '2024-01-08T10:20:00Z',
      description: t('wlt.app-client.mobile.auto_wlt_refund_get.mockPurchaseSamsung'),
    },
  };
}

