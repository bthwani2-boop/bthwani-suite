import type React from 'react';
import type { Icon } from '@bthwani/ui-kit';
import type {
  WltDshFinancePreviewRecord,
  WltDshFinanceStatusTone,
  WltDshFinanceTone,
} from '../../shared/finance/dshFinancePreview';

export type WltDshPartnerTransactionTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type WltDshPartnerWalletTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amountLabel: string;
  amountTone?: WltDshPartnerTransactionTone;
  statusLabel?: string;
  statusTone?: WltDshPartnerTransactionTone;
  timeLabel: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  hasDetails?: boolean;
};

function mapAmountTone(tone: WltDshFinanceTone): WltDshPartnerTransactionTone {
  if (tone === 'positive') {
    return 'success';
  }

  if (tone === 'negative') {
    return 'danger';
  }

  return 'info';
}

function mapStatusTone(tone: WltDshFinanceStatusTone): WltDshPartnerTransactionTone {
  if (tone === 'success') {
    return 'success';
  }

  if (tone === 'warning') {
    return 'warning';
  }

  if (tone === 'error') {
    return 'danger';
  }

  return 'info';
}

function resolveTransactionIcon(record: WltDshFinancePreviewRecord): React.ComponentProps<typeof Icon>['name'] {
  if (record.kind === 'partner-settlement') {
    return 'wallet-outline';
  }

  return 'swap-horizontal-outline';
}

export function mapWltDshPartnerPreviewTransactions(
  records: readonly WltDshFinancePreviewRecord[],
): readonly WltDshPartnerWalletTransaction[] {
  return records.map((record) => ({
    id: record.id,
    title: record.title,
    subtitle: record.subtitle,
    amountLabel: record.amountLabel,
    amountTone: mapAmountTone(record.tone),
    statusLabel: record.statusLabel,
    statusTone: mapStatusTone(record.statusTone),
    timeLabel: record.timeLabel,
    icon: resolveTransactionIcon(record),
    hasDetails: true,
  }));
}
