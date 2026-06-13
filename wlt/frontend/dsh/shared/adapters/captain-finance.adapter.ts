import type { WltDshFinanceSummaryRecord, WltDshFinanceTone } from '../contracts/dsh-finance-read-model.types';
import type { WltPayoutDecision } from '../contracts/payout.types';
import { toCaptainPayoutReadModel } from '../read-models/captain-payout-summary';
import type { WltDshCaptainPayoutReadModel } from '../read-models/captain-payout-summary';

function resolveCaptainDirection(tone: WltDshFinanceTone): 'credit' | 'debit' | 'neutral' {
  if (tone === 'positive') return 'credit';
  if (tone === 'negative') return 'debit';
  return 'neutral';
}

export type WltDshCaptainEarningRow = {
  readonly id: string;
  readonly kindLabel: string;
  readonly amountLabel: string;
  readonly direction: 'credit' | 'debit' | 'neutral';
  readonly description: string;
  readonly orderId?: string;
  readonly timeLabel: string;
};

const CAPTAIN_KIND_LABELS: Partial<Record<WltDshFinanceSummaryRecord['kind'], string>> = {
  'captain-earning': 'أرباح توصيل',
  'captain-cod-liability': 'ذمة COD',
  'captain-eligibility-topup': 'شحن ضمان',
};

export function adaptCaptainFinanceRecord(record: WltDshFinanceSummaryRecord): WltDshCaptainEarningRow {
  return {
    id: record.id,
    kindLabel: CAPTAIN_KIND_LABELS[record.kind] ?? record.kind,
    amountLabel: record.amountLabel,
    direction: resolveCaptainDirection(record.tone),
    description: record.subtitle,
    orderId: record.sourceOrderId,
    timeLabel: record.timeLabel,
  };
}

export function adaptCaptainFinanceRecords(
  records: readonly WltDshFinanceSummaryRecord[],
): readonly WltDshCaptainEarningRow[] {
  return records
    .filter(
      (r) =>
        r.kind === 'captain-earning' ||
        r.kind === 'captain-cod-liability' ||
        r.kind === 'captain-eligibility-topup',
    )
    .map(adaptCaptainFinanceRecord);
}

export function adaptCaptainPayout(payout: WltPayoutDecision): WltDshCaptainPayoutReadModel {
  return toCaptainPayoutReadModel(payout);
}
