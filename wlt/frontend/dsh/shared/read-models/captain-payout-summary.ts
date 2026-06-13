import type { WltPayoutDecision } from '../contracts/payout.types';

export type WltDshCaptainPayoutReadModel = {
  readonly captainSubject: string;
  readonly payoutId: string;
  readonly amountYer: number;
  readonly currency: string;
  readonly statusLabel: string;
};

export function toCaptainPayoutReadModel(payout: WltPayoutDecision): WltDshCaptainPayoutReadModel {
  return {
    captainSubject: payout.subject,
    payoutId: payout.id,
    amountYer: Math.round(payout.amount),
    currency: payout.currency,
    statusLabel: payout.status,
  };
}
