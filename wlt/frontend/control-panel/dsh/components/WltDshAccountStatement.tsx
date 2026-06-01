'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  getWltDshAccountStatementsPreview,
  type WltDshAccountStatement as WltDshAccountStatementModel,
} from '../financeContracts';

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

export function WltDshAccountStatement() {
  const statements = React.useMemo(() => getWltDshAccountStatementsPreview(), []);
  const [activeId, setActiveId] = React.useState(statements[0]?.statementId ?? '');
  const statement = statements.find((item) => item.statementId === activeId) ?? statements[0];

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ direction: 'rtl', textAlign: 'right' }}>
        <Text role="titleSm">لا توجد كشوف حساب في معاينة WLT.</Text>
      </Box>
    );
  }

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" style={{ fontWeight: 800 }}>كشوف الحساب</Text>
        <Text role="bodySm" tone="soft">
          أرصدة افتتاحية وختامية، ذمم، مستحقات، دفعات، واستردادات كـ preview contract مملوك لـ WLT.
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
        <Text role="titleSm" style={{ fontWeight: 800 }}>{statement.actorLabel} · {statement.actorId}</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          <SummaryCell label="الرصيد الافتتاحي" value={statement.openingBalanceLabel} />
          <SummaryCell label="مدين الفترة" value={statement.periodDebitLabel} />
          <SummaryCell label="دائن الفترة" value={statement.periodCreditLabel} />
          <SummaryCell label="الحجوزات" value={statement.holdsLabel} />
          <SummaryCell label="الاستردادات" value={statement.refundsLabel} />
          <SummaryCell label="الدفعات" value={statement.payoutsLabel} />
          <SummaryCell label="الرصيد الختامي" value={statement.closingBalanceLabel} />
        </div>
      </Box>

      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleSm" style={{ fontWeight: 800 }}>سطور الكشف</Text>
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
                  <td style={{ padding: '8px 10px' }}>{STATUS_LABEL[line.status]}</td>
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
