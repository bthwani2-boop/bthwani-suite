'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import type { WltDshAccountStatement as WltDshAccountStatementModel } from '../../shared/contracts/accountStatement.types';
import type { WltDshFinanceRuntimeResult } from '../../shared/adapters/wltDshFinanceRuntime.adapter';
import { buildRuntimeAccountStatements } from '../../shared/read-models/account-statement.read-model';

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


export function WltDshAccountStatement({
  actorId,
  runtimeFinance = null,
}: {
  actorId?: string;
  runtimeFinance?: WltDshFinanceRuntimeResult | null;
} = {}) {
  const runtimeStatements = React.useMemo(() => buildRuntimeAccountStatements(runtimeFinance), [runtimeFinance]);
  const statements = runtimeStatements;
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
