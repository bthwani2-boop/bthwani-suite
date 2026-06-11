'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  getWltDshAccountStatementsPreview,
  type WltDshAccountStatement as WltDshAccountStatementModel,
} from '../financeContracts';
import { formatWltYer } from '../models/dshFinance.types';
import type { WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';

const STATUS_LABEL: Record<WltDshAccountStatementModel['lines'][number]['status'], string> = {
  posted_preview: 'مرحل كمعاينة',
  pending_wlt: 'قيد WLT',
  held: 'محجوز',
  disputed: 'نزاع',
};

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 10, border: '1px solid var(--bthwani-control-panel-border)', borderRadius: 8, background: 'var(--bthwani-control-panel-surface-raised)' }}>
      <div style={{ color: 'var(--bthwani-control-panel-text-muted)', fontSize: 11 }}>{label}</div>
      <div style={{ color: 'var(--bthwani-control-panel-text)', fontWeight: 800, fontSize: 14, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

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

function buildRuntimeStatements(
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
      if (entry.reference_type === 'refund') {
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
        sourceType: resolveSourceType(entry.reference_type),
        sourceId: entry.reference_id ?? entry.order_id ?? entry.id,
        description: `${entry.reference_type} · ${subject}`,
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
      refundsMinorUnits: refundsMinorUnits,
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

export function WltDshAccountStatement({
  actorId,
  runtimeFinance = null,
}: {
  actorId?: string;
  runtimeFinance?: WltDshFinanceRuntimeResult | null;
} = {}) {
  const previewStatements = React.useMemo(() => getWltDshAccountStatementsPreview(), []);
  const runtimeStatements = React.useMemo(() => buildRuntimeStatements(runtimeFinance), [runtimeFinance]);
  const statements = runtimeStatements.length > 0 ? runtimeStatements : previewStatements;
  const [activeId, setActiveId] = React.useState(statements[0]?.statementId ?? '');

  const statement = React.useMemo(() => {
    if (actorId) {
      return statements.find((item) => item.actorId === actorId) ?? statements[0];
    }
    return statements.find((item) => item.statementId === activeId) ?? statements[0];
  }, [statements, activeId, actorId]);

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ direction: 'rtl' }}>
        <Text role="titleSm" style={{ textAlign: 'right' }}>لا توجد كشوف حساب في معاينة WLT.</Text>
      </Box>
    );
  }

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" weight="black">كشوف الحساب</Text>
        <Text role="bodySm" tone="soft">
          أرصدة افتتاحية وختامية، ذمم، مستحقات، دفعات، واستردادات.
        </Text>
      </Box>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {statements.map((item) => (
          <button
            key={item.statementId}
            type="button"
            onClick={() => setActiveId(item.statementId)}
            style={{
              border: '1px solid var(--bthwani-control-panel-border)',
              borderRadius: 8,
              padding: '8px 12px',
              background: item.statementId === statement.statementId ? 'var(--bthwani-brand-surface)' : 'var(--bthwani-control-panel-surface)',
              color: 'var(--bthwani-control-panel-text)',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {item.actorLabel}
          </button>
        ))}
      </div>

      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={3}>
        <Text role="titleSm" weight="black">{statement.actorLabel} · {statement.actorId}</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          <SummaryCell label="الرصيد الافتتاحي" value={statement.openingBalanceLabel} />
          <SummaryCell label="مدين الفترة" value={statement.periodDebitLabel} />
          <SummaryCell label="دائن الفترة" value={statement.periodCreditLabel} />
          <SummaryCell label="التعديلات" value={statement.adjustmentsLabel} />
          <SummaryCell label="الحجوزات" value={statement.holdsLabel} />
          <SummaryCell label="مفرج عنه" value={statement.releasesLabel} />
          <SummaryCell label="الاستردادات" value={statement.refundsLabel} />
          <SummaryCell label="الدفعات" value={statement.payoutsLabel} />
          <SummaryCell label="الرصيد الختامي" value={statement.closingBalanceLabel} />
        </div>
      </Box>

      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleSm" weight="black">سطور الكشف</Text>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 820, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bthwani-control-panel-border)' }}>
                {['التاريخ', 'المصدر', 'الوصف', 'مدين', 'دائن', 'الرصيد الجاري', 'الحالة', 'الدليل'].map((header) => (
                  <th key={header} style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--bthwani-control-panel-text-muted)', fontSize: 11 }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statement.lines.map((line) => (
                <tr key={line.lineId} style={{ borderBottom: '1px solid var(--bthwani-control-panel-border)' }}>
                  <td style={{ padding: '8px 10px' }}>{line.date}</td>
                  <td style={{ padding: '8px 10px' }}>{line.sourceType} · {line.sourceId}</td>
                  <td style={{ padding: '8px 10px' }}>{line.description}</td>
                  <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums' }}>{line.debitLabel}</td>
                  <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums' }}>{line.creditLabel}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{line.runningBalanceLabel}</td>
                  <td style={{ padding: '8px 10px' }}>
                    {line.status === 'pending_wlt' ? 'قيد المراجعة' :
                     line.status === 'posted_preview' ? 'مرحل' :
                     line.status === 'held' ? 'مبلغ محجوز' : 'نزاع'}
                  </td>
                  <td style={{ padding: '8px 10px' }}>{line.evidenceRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </Box>
  );
}

export default WltDshAccountStatement;
