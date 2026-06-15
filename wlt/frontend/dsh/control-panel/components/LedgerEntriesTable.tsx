'use client';

import React from 'react';
import { Box, Text,
  radius,
} from '@bthwani/ui-kit';
import { useRouter } from 'next/navigation';
import type { WltLedgerEntry } from '../../shared';
import { getWltPostingRuleForEvent } from '../../shared';

const STATUS_LABELS: Record<string, string> = {
  posted: 'مرحّل',
  pending: 'قيد المراجعة',
  disputed: 'قيد النزاع',
  blocked: 'مبلغ محجوز',
};

const STATUS_COLOR: Record<string, string> = {
  posted: 'var(--bth-success-text)',
  pending: 'var(--bth-warning-text)',
  disputed: 'var(--bth-danger-text)',
  blocked: 'var(--bth-danger-text)',
};

export function LedgerEntriesTable({ entries, pageSize = 10 }: {
  entries: readonly WltLedgerEntry[];
  pageSize?: number;
}) {
  const router = useRouter();
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? entries : entries.slice(0, pageSize);

  return (
    <Box gap={2} style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text role="titleSm" weight="bold">قيود دفتر الأستاذ</Text>
        <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>
          {entries.length} قيد · معاينة تشغيلية
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--bthwani-control-panel-surface-raised)', borderBottom: '2px solid var(--bthwani-control-panel-border)' }}>
              {['المدين', 'الدائن', 'المبلغ', 'الطرف', 'المرجع', 'posting rule', 'الحالة'].map((h) => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--bthwani-control-panel-text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
                  <tbody>
            {visible.map((entry, i) => {
              const rule = getWltPostingRuleForEvent(entry.entryKind as Parameters<typeof getWltPostingRuleForEvent>[0]);

              const handleSourceClick = () => {
                const ref = entry.sourceRef;
                if (ref.startsWith('ORD-') || ref.includes('ORD-') || ref.includes('SD')) {
                  const match = ref.match(/ORD-\d+-\w+|ORD-\d+-\w+/);
                  const orderId = match ? match[0] : (ref.startsWith('INV-') ? ref.replace('INV-', '') : ref);
                  router.push(`/operations?orderId=${orderId}`);
                } else if (ref.startsWith('CYC-')) {
                  router.push('/finance?workspace=settlement-calendar');
                } else if (ref.startsWith('REF-') || ref.includes('REF-')) {
                  router.push('/finance?workspace=refund-ledger');
                } else {
                  console.warn('[WLT-LEDGER] تفاصيل الحركة:', { ref, party: entry.party, debit: entry.debitAccountLabel, credit: entry.creditAccountLabel });
                }
              };

              return (
                <tr key={entry.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid var(--bthwani-control-panel-border)', opacity: entry.isPending ? 0.75 : 1 }}>
                  <td style={{ padding: '5px 10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <code style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{entry.debitAccountCode}</code>
                      <span style={{ color: 'var(--bthwani-control-panel-text)' }}>{entry.debitAccountLabel}</span>
                    </div>
                  </td>
                  <td style={{ padding: '5px 10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <code style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{entry.creditAccountCode}</code>
                      <span style={{ color: 'var(--bthwani-control-panel-text)' }}>{entry.creditAccountLabel}</span>
                    </div>
                  </td>
                  <td style={{ padding: '5px 10px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: 'var(--bthwani-control-panel-text)' }}>{entry.amountLabel}</td>
                  <td style={{ padding: '5px 10px', color: 'var(--bthwani-control-panel-text-muted)', whiteSpace: 'nowrap' }}>{entry.party}</td>
                  <td style={{ padding: '5px 10px' }}>
                    <button
                      onClick={handleSourceClick}
                      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-block' }}
                      title="فتح تفاصيل المصدر"
                    >
                      <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: 3, color: 'var(--bthwani-brand-primary)', fontWeight: '700' }}>
                        {entry.sourceRef} ↗
                      </code>
                    </button>
                  </td>
                  <td style={{ padding: '5px 10px' }}>
                    {rule ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontSize: 9, color: 'var(--bth-info-text)', fontWeight: 700 }}>{entry.entryKind}</span>
                        {rule.closeGateBlocker && (
                          <span style={{ fontSize: 8, color: 'var(--bth-warning-text)' }}>يوقف الإغلاق</span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{entry.entryKind}</span>
                    )}
                  </td>
                  <td style={{ padding: '5px 10px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[entry.status] ?? 'inherit', background: `color-mix(in srgb, ${STATUS_COLOR[entry.status] ?? 'transparent'} 12%, transparent)`, padding: '2px 6px', borderRadius: 4 }}>
                      {STATUS_LABELS[entry.status] ?? entry.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {entries.length > pageSize && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{ background: 'transparent', border: '1px solid var(--bthwani-control-panel-border)', borderRadius: radius.xs, padding: '4px 12px', fontSize: 11, cursor: 'pointer', color: 'var(--bthwani-brand-primary)', fontWeight: 600 }}
        >
          {showAll ? 'عرض أقل' : `عرض جميع القيود (${entries.length})`}
        </button>
      )}
    </Box>
  );
}
