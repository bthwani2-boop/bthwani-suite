import type { WltPayoutDecision } from '../contracts/payout.types';

export type WltDshPayoutRowViewModel = {
  readonly id: string;
  readonly subject: string;
  readonly amountLabel: string;
  readonly amountYer: number;
  readonly statusLabel: string;
  readonly isPaid: boolean;
};

const PAYOUT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'معلق',
  APPROVED: 'مقبول',
  REJECTED: 'مرفوض',
  PAID: 'مصروف',
};

export function toPayoutRowViewModel(payout: WltPayoutDecision): WltDshPayoutRowViewModel {
  const amountYer = Math.round(payout.amount);
  return {
    id: payout.id,
    subject: payout.subject,
    amountYer,
    amountLabel: `${amountYer.toLocaleString('ar-YE')} ر.ي`,
    statusLabel: PAYOUT_STATUS_LABELS[payout.status] ?? payout.status,
    isPaid: payout.status === 'PAID',
  };
}
