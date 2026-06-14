import { formatWltYer } from '../contracts/dshFinance.types';
import type { WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';

export type WalletSummaryRow = {
  actorLabel: string;
  actorId: string;
  actorType: string;
  availableLabel: string;
  pendingLabel: string;
  heldLabel: string;
  status: 'ready' | 'needs_action' | 'blocked';
  statusLabel: string;
  nextAction?: string;
};

export function buildRuntimeWalletRows(runtimeFinance: WltDshFinanceRuntimeResult | null): WalletSummaryRow[] {
  if (runtimeFinance?.state !== 'runtime') {
    return [];
  }

  const grouped = new Map<string, Array<(typeof runtimeFinance.data.ledgerEntries)[number]>>();
  for (const entry of runtimeFinance.data.ledgerEntries) {
    const key = entry.subject || 'platform';
    const current = grouped.get(key);
    if (current) {
      current.push(entry);
    } else {
      grouped.set(key, [entry]);
    }
  }

  return Array.from(grouped.entries())
    .map(([subject, entries]) => {
      let availableMinorUnits = 0;
      let pendingMinorUnits = 0;
      let heldMinorUnits = 0;

      for (const entry of entries) {
        const amountMinorUnits = Math.round(entry.amount * 100);
        availableMinorUnits += amountMinorUnits;
        if (entry.status !== 'COMPLETED') {
          pendingMinorUnits += Math.abs(amountMinorUnits);
        }
        if (entry.status === 'FAILED' || entry.status === 'REVERSED') {
          heldMinorUnits += Math.abs(amountMinorUnits);
        }
      }

      const actorType =
        subject.startsWith('client') || subject.startsWith('customer')
          ? 'عميل'
          : subject.startsWith('partner') || subject.startsWith('store')
            ? 'شريك'
            : subject.startsWith('captain')
              ? 'كابتن'
              : subject.startsWith('field')
                ? 'ميداني'
                : 'منصة';

      const status: WalletSummaryRow['status'] =
        heldMinorUnits > 0
          ? 'blocked'
          : pendingMinorUnits > 0
            ? 'needs_action'
            : 'ready';

      const statusLabel =
        status === 'blocked'
          ? 'محجوز'
          : status === 'needs_action'
            ? 'قيد المراجعة'
            : 'نشط';

      return {
        actorLabel: `${actorType} runtime`,
        actorId: subject,
        actorType,
        availableLabel: formatWltYer(availableMinorUnits),
        pendingLabel: formatWltYer(pendingMinorUnits),
        heldLabel: formatWltYer(heldMinorUnits),
        status,
        statusLabel,
        nextAction:
          status === 'blocked'
            ? 'مراجعة الحركات الفاشلة أو المعكوسة'
            : status === 'needs_action'
              ? 'اعتماد ومطابقة مع WLT'
              : undefined,
      } satisfies WalletSummaryRow;
    })
    .sort((left, right) => left.actorLabel.localeCompare(right.actorLabel, 'ar'));
}
