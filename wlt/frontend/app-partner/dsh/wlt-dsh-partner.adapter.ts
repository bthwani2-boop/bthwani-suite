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

function sanitizeLabel(text: string | undefined): string {
  if (!text) return '';
  let result = text;
  result = result.replace(/partner_delivery/g, 'توصيل بواسطة المتجر');
  result = result.replace(/bthwani_delivery/g, 'توصيل بواسطة بثواني');
  result = result.replace(/pickup/g, 'استلام ذاتي');
  result = result.replace(/UI_PREVIEW_ONLY/g, 'خاضع لسياسة المحفظة');
  result = result.replace(/CONTRACT_TBD/g, 'قيد المراجعة');
  return result;
}

export function mapWltDshPartnerPreviewTransactions(
  records: readonly WltDshFinancePreviewRecord[],
): readonly WltDshPartnerWalletTransaction[] {
  return records.map((record) => ({
    id: record.id,
    title: sanitizeLabel(record.title),
    subtitle: sanitizeLabel(record.subtitle),
    amountLabel: sanitizeLabel(record.amountLabel),
    amountTone: mapAmountTone(record.tone),
    statusLabel: sanitizeLabel(record.statusLabel),
    statusTone: mapStatusTone(record.statusTone),
    timeLabel: sanitizeLabel(record.timeLabel),
    icon: resolveTransactionIcon(record),
    hasDetails: true,
  }));
}
