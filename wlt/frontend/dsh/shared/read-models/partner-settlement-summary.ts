import type { WltSettlement } from '../contracts/settlement.types';
import type { WltDshFinanceSummaryRecord } from '../contracts/dsh-finance-read-model.types';

export type WltDshPartnerSettlementReadModel = {
  readonly partnerId: string;
  readonly settlementId: string;
  readonly partnerPayoutYer: number;
  readonly grossAmountYer: number;
  readonly platformFeeYer: number;
  readonly currency: string;
  readonly statusLabel: string;
  readonly records: readonly WltDshFinanceSummaryRecord[];
};

export function toPartnerSettlementReadModel(
  settlement: WltSettlement,
  records: readonly WltDshFinanceSummaryRecord[] = [],
): WltDshPartnerSettlementReadModel {
  return {
    partnerId: settlement.partner_id,
    settlementId: settlement.id,
    partnerPayoutYer: Math.round(settlement.partner_payout),
    grossAmountYer: Math.round(settlement.gross_amount),
    platformFeeYer: Math.round(settlement.platform_fee),
    currency: settlement.currency,
    statusLabel: settlement.status,
    records,
  };
}
