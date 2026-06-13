import type React from 'react';
import type { Icon } from '@bthwani/ui-kit';
import type { WltDshFinanceSummaryRecord, WltDshFinanceEventKind, WltDshFinanceStatusTone, WltDshFinanceTone } from '../contracts/dsh-finance-read-model.types';
import { resolveKindLabel, resolveSettlementImpact, resolvePolicyLabel, sanitizeFinanceLabel } from '../formatters/finance-labels';

export type WltDshPartnerTransactionTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type WltDshPartnerWalletTransaction = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly amountLabel: string;
  readonly amountTone?: WltDshPartnerTransactionTone;
  readonly statusLabel?: string;
  readonly statusTone?: WltDshPartnerTransactionTone;
  readonly timeLabel: string;
  readonly icon: React.ComponentProps<typeof Icon>['name'];
  readonly hasDetails?: boolean;
  readonly kind?: WltDshFinanceEventKind;
  readonly kindLabel?: string;
  readonly sourceOrderLabel?: string;
  readonly settlementCycleLabel?: string;
  readonly includedInNetSettlementLabel?: string;
  readonly fulfillmentModeLabel?: string;
  readonly isStoreDeliveryFee?: boolean;
  readonly isStoreCourierCompensation?: boolean;
  readonly isCaptainPayout?: boolean;
  readonly policyLabel?: string;
  readonly sourceTruthLabel?: string;
  readonly runtimeBindingLabel?: string;
};

function mapAmountTone(tone: WltDshFinanceTone): WltDshPartnerTransactionTone {
  if (tone === 'positive') return 'success';
  if (tone === 'negative') return 'danger';
  return 'info';
}

function mapStatusTone(tone: WltDshFinanceStatusTone): WltDshPartnerTransactionTone {
  if (tone === 'success') return 'success';
  if (tone === 'warning') return 'warning';
  if (tone === 'error') return 'danger';
  return 'info';
}

function resolveTransactionIcon(record: WltDshFinanceSummaryRecord): React.ComponentProps<typeof Icon>['name'] {
  if (record.kind === 'partner-settlement') return 'wallet-outline';
  if (record.kind === 'store-delivery-fee') return 'storefront-outline';
  if (record.kind === 'store-courier-compensation') return 'person-outline';
  if (record.kind === 'captain-earning' || record.kind === 'captain-cod-liability') return 'bicycle-outline';
  if (record.kind === 'refund-adjustment') return 'return-down-back-outline';
  if (record.kind === 'platform-commission') return 'pie-chart-outline';
  if (record.kind === 'reconciliation-export') return 'checkmark-circle-outline';
  return 'swap-horizontal-outline';
}

export function mapWltDshPartnerTransactions(
  records: readonly WltDshFinanceSummaryRecord[],
): readonly WltDshPartnerWalletTransaction[] {
  return records.map((record) => ({
    id: record.id,
    title: sanitizeFinanceLabel(record.title),
    subtitle: sanitizeFinanceLabel(record.subtitle),
    amountLabel: sanitizeFinanceLabel(record.amountLabel),
    amountTone: mapAmountTone(record.tone),
    statusLabel: sanitizeFinanceLabel(record.statusLabel),
    statusTone: mapStatusTone(record.statusTone),
    timeLabel: sanitizeFinanceLabel(record.timeLabel),
    icon: resolveTransactionIcon(record),
    hasDetails: true,
    kind: record.kind,
    kindLabel: resolveKindLabel(record.kind),
    sourceOrderLabel: record.sourceOrderId
      ? `طلب #${record.sourceOrderId}`
      : record.settlementCycleId
      ? `دورة #${record.settlementCycleId}`
      : record.sourceStoreId
      ? `متجر #${record.sourceStoreId}`
      : undefined,
    settlementCycleLabel: record.settlementCycleId ? `دورة #${record.settlementCycleId}` : undefined,
    includedInNetSettlementLabel: resolveSettlementImpact(record.kind),
    isStoreDeliveryFee: record.kind === 'store-delivery-fee',
    isStoreCourierCompensation: record.kind === 'store-courier-compensation',
    isCaptainPayout: record.kind === 'captain-earning' || record.kind === 'captain-cod-liability',
    policyLabel: resolvePolicyLabel(record.kind),
  }));
}
