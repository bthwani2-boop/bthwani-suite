'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { buildWltTrialBalancePreview } from '../../shared';
import type { WltLedgerEntry } from '../../shared/control-panel/financialCenter.types';

export function TrialBalancePanel({ entries, businessDate }: {
  entries: readonly WltLedgerEntry[];
  businessDate: string;
}) {
  const tb = React.useMemo(
    () => buildWltTrialBalancePreview(businessDate, entries.map((e) => ({
      debitAccountCode: e.debitAccountCode,
      creditAccountCode: e.creditAccountCode,
      amountMinorUnits: e.amountMinorUnits,
    }))),
    [entries, businessDate],
  );

  const isBalanced = tb.isBalanced;

  return (
    <Box gap={3} style={{ direction: 'rtl', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text role="titleSm" weight="bold">ميزان المراجعة</Text>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 5,
          color: isBalanced ? 'var(--bth-success-text)' : 'var(--bth-danger-text)',
          background: isBalanced ? 'var(--bth-success-surface)' : 'var(--bth-danger-surface)',
        }}>
          {isBalanced ? 'متوازن ✓' : `فارق: ${tb.imbalanceLabel}`}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--bthwani-control-panel-surface-raised)', borderBottom: '2px solid var(--bthwani-control-panel-border)' }}>
              {['الحساب', 'النوع', 'مدين', 'دائن', 'الصافي', 'متوازن'].map((h) => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--bthwani-control-panel-text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tb.lines.map((line, i) => (
              <tr key={line.accountCode} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.012)', borderBottom: '1px solid var(--bthwani-control-panel-border)' }}>
                <td style={{ padding: '5px 10px' }}>
                  <Text family="mono" style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)', marginLeft: 4 }}>{line.accountCode}</Text>
                  {line.accountLabel}
                </td>
                <td style={{ padding: '5px 10px', color: 'var(--bthwani-control-panel-text-muted)', fontSize: 10 }}>{line.accountType}</td>
                <td style={{ padding: '5px 10px', fontVariantNumeric: 'tabular-nums', color: line.debitMinorUnits > 0 ? 'var(--bth-info-text)' : 'var(--bthwani-control-panel-text-muted)' }}>
                  {line.debitLabel}
                </td>
                <td style={{ padding: '5px 10px', fontVariantNumeric: 'tabular-nums', color: line.creditMinorUnits > 0 ? 'var(--bth-success-text)' : 'var(--bthwani-control-panel-text-muted)' }}>
                  {line.creditLabel}
                </td>
                <td style={{ padding: '5px 10px', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: line.netMinorUnits !== 0 ? 'var(--bth-warning-text)' : 'var(--bthwani-control-panel-text-muted)' }}>
                  {line.netLabel}
                </td>
                <td style={{ padding: '5px 10px' }}>
                  <span style={{ fontSize: 10, color: line.isBalanced ? 'var(--bth-success-text)' : 'var(--bth-danger-text)' }}>
                    {line.isBalanced ? '✓' : '✗'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--bthwani-control-panel-surface-raised)', borderTop: '2px solid var(--bthwani-control-panel-border)', fontWeight: 700 }}>
              <td colSpan={2} style={{ padding: '6px 10px', textAlign: 'right' }}>الإجمالي</td>
              <td style={{ padding: '6px 10px', fontVariantNumeric: 'tabular-nums', color: 'var(--bth-info-text)' }}>{tb.totalDebitLabel}</td>
              <td style={{ padding: '6px 10px', fontVariantNumeric: 'tabular-nums', color: 'var(--bth-success-text)' }}>{tb.totalCreditLabel}</td>
              <td colSpan={2} style={{ padding: '6px 10px', color: isBalanced ? 'var(--bth-success-text)' : 'var(--bth-danger-text)' }}>
                {isBalanced ? 'متوازن' : `فارق: ${tb.imbalanceLabel}`}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
        معاينة تشغيلية · القاعدة: مجموع المدين = مجموع الدائن. أي فارق يوقف إغلاق اليوم.
      </Text>
    </Box>
  );
}
