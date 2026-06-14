import type {
  WltDshAccountStatement as WltDshAccountStatementModel,
} from '../contracts/accountStatement.types';
import { formatWltYer } from '../contracts/dshFinance.types';
import type { WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';

function resolveActor(subject: string): {
  actor: WltDshAccountStatementModel['actor'];
  actorLabel: string;
} {
  if (subject.startsWith('captain')) return { actor: 'captain', actorLabel: 'محفظة الكابتن' };
  if (subject.startsWith('partner') || subject.startsWith('store')) return { actor: 'store', actorLabel: 'محفظة المتجر' };
  if (subject.startsWith('field')) return { actor: 'field_agent', actorLabel: 'محفظة الميداني' };
  if (subject.startsWith('client') || subject.startsWith('customer')) return { actor: 'customer_wallet', actorLabel: 'محفظة العميل' };
  return { actor: 'platform', actorLabel: 'محفظة المنصة' };
}

function resolveLineStatus(status: string): WltDshAccountStatementModel['lines'][number]['status'] {
  if (status === 'COMPLETED') return 'posted_preview';
  if (status === 'FAILED') return 'disputed';
  if (status === 'REVERSED') return 'held';
  return 'pending_wlt';
}

function resolveSourceType(referenceType: string): WltDshAccountStatementModel['lines'][number]['sourceType'] {
  if (referenceType === 'refund') return 'refund';
  if (referenceType === 'settlement') return 'settlement';
  if (referenceType === 'payment_session') return 'wallet';
  return 'adjustment';
}

export function buildRuntimeAccountStatements(
  runtimeFinance: WltDshFinanceRuntimeResult | null,
): WltDshAccountStatementModel[] {
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

  return Array.from(grouped.entries()).map(([subject, entries]) => {
    const sortedEntries = [...entries].sort((left, right) => left.created_at.localeCompare(right.created_at));
    const { actor, actorLabel } = resolveActor(subject);
    let runningBalanceMinorUnits = 0;
    let periodDebitMinorUnits = 0;
    let periodCreditMinorUnits = 0;
    let refundsMinorUnits = 0;
    let holdsMinorUnits = 0;

    const lines = sortedEntries.map((entry) => {
      const amountMinorUnits = Math.round(entry.amount * 100);
      const isDebit = amountMinorUnits >= 0;
      if (isDebit) {
        periodDebitMinorUnits += amountMinorUnits;
      } else {
        periodCreditMinorUnits += Math.abs(amountMinorUnits);
      }
      if (entry.ref_type === 'refund') {
        refundsMinorUnits += Math.abs(amountMinorUnits);
      }
      if (entry.status !== 'COMPLETED') {
        holdsMinorUnits += Math.abs(amountMinorUnits);
      }
      runningBalanceMinorUnits += amountMinorUnits;

      const debitMinorUnits = isDebit ? amountMinorUnits : 0;
      const creditMinorUnits = isDebit ? 0 : Math.abs(amountMinorUnits);

      return {
        lineId: entry.id,
        date: entry.created_at.slice(0, 10),
        sourceType: resolveSourceType(entry.ref_type ?? ''),
        sourceId: entry.reference_id ?? entry.order_id ?? entry.id,
        description: `${entry.ref_type ?? 'entry'} · ${subject}`,
        debitMinorUnits,
        debitLabel: formatWltYer(debitMinorUnits),
        creditMinorUnits,
        creditLabel: formatWltYer(creditMinorUnits),
        runningBalanceMinorUnits,
        runningBalanceLabel: formatWltYer(runningBalanceMinorUnits),
        status: resolveLineStatus(entry.status),
        evidenceRef: entry.id,
      } satisfies WltDshAccountStatementModel['lines'][number];
    });

    const periodStart = sortedEntries[0]?.created_at.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
    const periodEnd = sortedEntries.at(-1)?.created_at.slice(0, 10) ?? periodStart;
    const closingBalanceMinorUnits = runningBalanceMinorUnits;

    return {
      statementId: `runtime-${subject}`,
      actor,
      actorLabel,
      actorId: subject,
      periodStart,
      periodEnd,
      openingBalanceMinorUnits: 0,
      openingBalanceLabel: formatWltYer(0),
      periodDebitMinorUnits,
      periodDebitLabel: formatWltYer(periodDebitMinorUnits),
      periodCreditMinorUnits,
      periodCreditLabel: formatWltYer(periodCreditMinorUnits),
      adjustmentsMinorUnits: 0,
      adjustmentsLabel: formatWltYer(0),
      holdsMinorUnits,
      holdsLabel: formatWltYer(holdsMinorUnits),
      releasesMinorUnits: 0,
      releasesLabel: formatWltYer(0),
      refundsMinorUnits,
      refundsLabel: formatWltYer(refundsMinorUnits),
      payoutsMinorUnits: 0,
      payoutsLabel: formatWltYer(0),
      closingBalanceMinorUnits,
      closingBalanceLabel: formatWltYer(closingBalanceMinorUnits),
      lines,
      contract: {
        contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
        runtimeTruth: false,
        backendSource: false,
        owner: 'wlt',
        currencyCode: 'YER',
        isPreview: true,
      },
    } satisfies WltDshAccountStatementModel;
  });
}
