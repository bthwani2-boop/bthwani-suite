import type { WltSettlement } from '../settlements/settlement.types';

export type WltDshSettlementRowViewModel = {
  readonly id: string;
  readonly partnerId: string;
  readonly partnerPayoutLabel: string;
  readonly partnerPayoutYer: number;
  readonly statusLabel: string;
  readonly isCompleted: boolean;
};

const SETTLEMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'معلقة',
  PROCESSING: 'قيد المعالجة',
  COMPLETED: 'مكتملة',
  FAILED: 'فشلت',
};

export function toSettlementRowViewModel(settlement: WltSettlement): WltDshSettlementRowViewModel {
  const payoutYer = Math.round(settlement.partner_payout);
  return {
    id: settlement.id,
    partnerId: settlement.partner_id,
    partnerPayoutYer: payoutYer,
    partnerPayoutLabel: `${payoutYer.toLocaleString('ar-YE')} ر.ي`,
    statusLabel: SETTLEMENT_STATUS_LABELS[settlement.status] ?? settlement.status,
    isCompleted: settlement.status === 'COMPLETED',
  };
}
