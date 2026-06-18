import type { WltRefund } from '../refunds/refund.types';
import { resolveRefundStatusLabel, resolveRefundStatusTone } from '../formatters/finance-status-labels';

export type WltDshRefundRowViewModel = {
  readonly id: string;
  readonly orderId: string;
  readonly clientId: string;
  readonly amountLabel: string;
  readonly amountYer: number;
  readonly statusLabel: string;
  readonly statusTone: 'default' | 'success' | 'warning' | 'danger';
  readonly reason: string;
  readonly isCompleted: boolean;
};

export function toRefundRowViewModel(refund: WltRefund): WltDshRefundRowViewModel {
  const amountYer = Math.round(refund.amount);
  const status = refund.status as 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';
  return {
    id: refund.id,
    orderId: refund.order_id,
    clientId: refund.client_id,
    amountYer,
    amountLabel: `${amountYer.toLocaleString('ar-YE')} ر.ي`,
    statusLabel: resolveRefundStatusLabel(status),
    statusTone: resolveRefundStatusTone(status),
    reason: refund.reason,
    isCompleted: refund.status === 'CONFIRMED',
  };
}
