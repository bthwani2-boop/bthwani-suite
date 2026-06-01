'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text } from '@bthwani/ui-kit';
import { getWltControlPanelFinancePreview } from '../../../../../dsh/frontend/data/dshFinancePreview';
import { buildWltFinancialCenter } from '../selectors/buildFinancialCenter';
import type { WltFinancialCenterSection, WltLedgerEntry, WltFinancialCenterBlockingVariance } from '../models/financialCenter.types';

const SECTION_COLOR: Record<string, string> = {
  asset: 'var(--bth-info-text)',
  liability: 'var(--bth-warning-text)',
  revenue: 'var(--bth-success-text)',
  expense: 'var(--bth-danger-text)',
};

const STATUS_COLORS: Record<string, string> = {
  posted: 'var(--bth-success-text)',
  pending: 'var(--bth-warning-text)',
  disputed: 'var(--bth-danger-text)',
  blocked: 'var(--bth-danger-text)',
};

const STATUS_LABELS: Record<string, string> = {
  posted: 'مرحّل',
  pending: 'قيد المراجعة',
  disputed: 'قيد النزاع',
  blocked: 'محجوب WLT',
};

function PositionCard({ section }: { section: WltFinancialCenterSection }) {
  const [expanded, setExpanded] = React.useState(false);
  const color = SECTION_COLOR[section.sectionType];

  return (
    <div
      style={{
        background: 'var(--bthwani-control-panel-surface)',
        border: '1px solid var(--bthwani-control-panel-border)',
        borderTop: `3px solid ${color}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          direction: 'rtl',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: '700', color: 'var(--bthwani-control-panel-text)' }}>
            {section.sectionLabel}
          </span>
          <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>
            {section.lines.length} حساب · {section.lines.reduce((s, l) => s + l.entryCount, 0)} قيد
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: '800', color, fontVariantNumeric: 'tabular-nums' }}>
            {section.totalLabel}
          </span>
          <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--bthwani-control-panel-border)', padding: '8px 12px 12px', direction: 'rtl' }}>
          {section.lines.map((line) => (
            <div
              key={line.accountCode}
              style={{
                padding: '8px 10px',
                marginBottom: 6,
                background: 'var(--bthwani-control-panel-surface-raised)',
                borderRadius: 6,
                borderRight: `3px solid ${color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 3 }}>
                    {line.accountCode}
                  </code>
                  <span style={{ fontSize: 11, fontWeight: '600', color: 'var(--bthwani-control-panel-text)' }}>
                    {line.accountLabel}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {line.pendingCount > 0 && (
                    <span style={{ fontSize: 9, color: 'var(--bth-warning-text)', fontWeight: '700', background: 'var(--bth-warning-surface)', padding: '1px 5px', borderRadius: 3 }}>
                      {line.pendingCount} معلق
                    </span>
                  )}
                  <span style={{ fontSize: 12, fontWeight: '800', color, fontVariantNumeric: 'tabular-nums' }}>
                    {line.totalLabel}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 4, fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>
                {line.entryCount} قيد · {line.entries.map((e) => e.party).slice(0, 3).join(' · ')}{line.entryCount > 3 ? ' …' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LedgerTable({ entries }: { entries: readonly WltLedgerEntry[] }) {
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? entries : entries.slice(0, 8);

  return (
    <Box gap={2} style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text role="titleSm" style={{ fontWeight: '700' }}>قيود دفتر الأستاذ</Text>
        <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>
          {entries.length} قيد إجمالي · [معاينة] CONTRACT_SCAFFOLD_PREVIEW_ONLY
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--bthwani-control-panel-surface-raised)', borderBottom: '2px solid var(--bthwani-control-panel-border)' }}>
              {['المدين', 'الدائن', 'المبلغ', 'الطرف', 'المرجع', 'النوع', 'الحالة'].map((h) => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: 'var(--bthwani-control-panel-text-muted)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((entry, i) => (
              <tr
                key={entry.id}
                style={{
                  background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                  borderBottom: '1px solid var(--bthwani-control-panel-border)',
                  opacity: entry.isPending ? 0.75 : 1,
                }}
              >
                <td style={{ padding: '5px 10px', color: 'var(--bthwani-control-panel-text)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <code style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{entry.debitAccountCode}</code>
                    <span>{entry.debitAccountLabel}</span>
                  </div>
                </td>
                <td style={{ padding: '5px 10px', color: 'var(--bthwani-control-panel-text)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <code style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{entry.creditAccountCode}</code>
                    <span>{entry.creditAccountLabel}</span>
                  </div>
                </td>
                <td style={{ padding: '5px 10px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: 'var(--bthwani-control-panel-text)' }}>
                  {entry.amountLabel}
                </td>
                <td style={{ padding: '5px 10px', color: 'var(--bthwani-control-panel-text-muted)', whiteSpace: 'nowrap' }}>
                  {entry.party}
                </td>
                <td style={{ padding: '5px 10px' }}>
                  <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.04)', padding: '1px 5px', borderRadius: 3 }}>
                    {entry.sourceRef}
                  </code>
                </td>
                <td style={{ padding: '5px 10px', color: 'var(--bthwani-control-panel-text-muted)' }}>
                  {entry.entryKind}
                </td>
                <td style={{ padding: '5px 10px' }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: STATUS_COLORS[entry.status],
                    background: `color-mix(in srgb, ${STATUS_COLORS[entry.status]} 12%, transparent)`,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>
                    {STATUS_LABELS[entry.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            background: 'transparent',
            border: '1px solid var(--bthwani-control-panel-border)',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 11,
            cursor: 'pointer',
            color: 'var(--bthwani-brand-primary)',
            fontWeight: '600',
          }}
        >
          {showAll ? 'عرض أقل' : `عرض جميع القيود (${entries.length})`}
        </button>
      )}
    </Box>
  );
}

function BlockingVariancesList({ variances }: { variances: readonly WltFinancialCenterBlockingVariance[] }) {
  if (variances.length === 0) {
    return (
      <div style={{ padding: '10px 14px', background: 'var(--bth-success-surface)', border: '1px solid var(--bth-success-border)', borderRadius: 8, direction: 'rtl' }}>
        <span style={{ fontSize: 12, color: 'var(--bth-success-text)', fontWeight: '700' }}>
          لا توجد فوارق مالية تمنع الإغلاق [معاينة]
        </span>
      </div>
    );
  }

  return (
    <Box gap={2} style={{ direction: 'rtl' }}>
      {variances.map((v) => (
        <div
          key={v.entryId}
          style={{
            padding: '8px 12px',
            background: 'var(--bth-warning-surface)',
            border: '1px solid var(--bth-warning-border)',
            borderRight: '3px solid var(--bth-warning-text)',
            borderRadius: 7,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: '600', color: 'var(--bthwani-control-panel-text)' }}>
              {v.description}
            </span>
            <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>{v.reason}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: '800', color: 'var(--bth-warning-text)', fontVariantNumeric: 'tabular-nums' }}>
            {v.varianceLabel}
          </span>
        </div>
      ))}
    </Box>
  );
}

function CloseGatePanel({ canClose, blockingCount }: { canClose: boolean; blockingCount: number }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <div
      style={{
        background: 'var(--bthwani-control-panel-surface-raised)',
        border: `1px solid ${canClose ? 'var(--bth-success-border)' : 'var(--bth-warning-border)'}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          direction: 'rtl',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: '700', color: 'var(--bthwani-control-panel-text)' }}>
          بوابة الإغلاق اليومي
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10,
            fontWeight: '700',
            color: canClose ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
            background: canClose ? 'var(--bth-success-surface)' : 'var(--bth-warning-surface)',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {canClose ? 'جاهز للمراجعة [معاينة]' : `${blockingCount} بند يمنع الإغلاق`}
          </span>
          <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--bthwani-control-panel-border)', padding: '12px 16px', direction: 'rtl' }}>
          <p style={{ fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
            الإغلاق اليومي هو <strong>نتيجة</strong> من: أرصدة الحسابات + قيود دفتر الأستاذ + ذمم COD + دورات التسوية + التزامات الاسترداد.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => router.push('/finance?workspace=daily-close')}
              style={{
                background: canClose ? 'var(--bth-success-surface)' : 'var(--bth-warning-surface)',
                border: `1px solid ${canClose ? 'var(--bth-success-border)' : 'var(--bth-warning-border)'}`,
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: '700',
                cursor: 'pointer',
                color: canClose ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
              }}
            >
              فتح مصنع الإغلاق والمطابقة ←
            </button>
            <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)', alignSelf: 'center' }}>
              [معاينة] · يتطلب WLT runtime لتنفيذ الإغلاق الفعلي
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function FinancialCenterScreen(_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) {
  const preview = React.useMemo(() => getWltControlPanelFinancePreview(), []);

  const center = React.useMemo(
    () => buildWltFinancialCenter(new Date().toISOString().split('T')[0]!, preview.allRecords),
    [preview],
  );

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <div style={{ padding: '6px 12px', background: 'var(--bth-warning-surface)', border: '1px solid var(--bth-warning-border)', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--bth-warning-text)', fontWeight: '700' }}>
          CONTRACT_SCAFFOLD_PREVIEW_ONLY · الأرصدة الافتتاحية والختامية غير متوفرة — يتطلب WLT Ledger Runtime · DSH عرض فقط
        </span>
      </div>

      <Box gap={2}>
        <Text role="titleSm" style={{ fontWeight: '700' }}>المركز المالي اليومي</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <PositionCard section={center.sections[0]!} />
          <PositionCard section={center.sections[1]!} />
          <PositionCard section={center.sections[2]!} />
          <PositionCard section={center.sections[3]!} />
        </div>
      </Box>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        padding: '12px 16px',
        background: 'var(--bthwani-control-panel-surface-raised)',
        border: '1px solid var(--bthwani-control-panel-border)',
        borderRadius: 10,
      }}>
        {[
          { label: 'إجمالي الأصول', value: center.totalAssetsLabel, color: SECTION_COLOR['asset'] },
          { label: 'إجمالي الالتزامات', value: center.totalLiabilitiesLabel, color: SECTION_COLOR['liability'] },
          { label: 'إجمالي الإيرادات', value: center.totalRevenueLabel, color: SECTION_COLOR['revenue'] },
          { label: 'إجمالي المصروفات', value: center.totalExpensesLabel, color: SECTION_COLOR['expense'] },
          {
            label: 'صافي المركز المالي',
            value: `${center.netPosition >= 0 ? '+' : '−'}${center.netPositionLabel}`,
            color: center.netPosition >= 0 ? 'var(--bth-success-text)' : 'var(--bth-danger-text)',
          },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ borderRight: `3px solid ${color}`, paddingRight: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: '800', color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
          </div>
        ))}
      </div>

      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <LedgerTable entries={center.allEntries} />
      </Box>

      <Box gap={2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text role="titleSm" style={{ fontWeight: '700' }}>الفوارق التي تمنع الإغلاق</Text>
          {center.blockingVariances.length > 0 && (
            <span style={{ fontSize: 10, fontWeight: '700', color: 'var(--bth-warning-text)', background: 'var(--bth-warning-surface)', padding: '2px 8px', borderRadius: 4 }}>
              {center.blockingVariances.length} بند يحتاج مراجعة
            </span>
          )}
        </div>
        <BlockingVariancesList variances={center.blockingVariances} />
      </Box>

      <CloseGatePanel canClose={center.canClose} blockingCount={center.blockingVariances.length} />
    </Box>
  );
}
