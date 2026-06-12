'use client';

import React from 'react';
import { Box, Text,
  radius,
} from '@bthwani/ui-kit';
import {
  formatWltYer,
  type WltDshFieldCommissionStatement as WltFieldStatement,
  type WltDshFieldCommissionStoreLine as WltStoreLine,
} from '../financeContracts';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

const STATUS_LABEL: Record<WltFieldStatement['status'], string> = {
  draft_preview: 'مسودة معاينة',
  ready_for_review: 'جاهزة للمراجعة',
  held_by_wlt: 'محجوبة من WLT',
  paid_preview: 'مدفوعة كمعاينة',
};

const ACTIVATION_STATUS_LABEL: Record<WltStoreLine['activationStatus'], string> = {
  active: 'نشط / مفعّل',
  pending_review: 'تحت المراجعة',
  rejected: 'مرفوض',
};

export function WltDshFieldCommissionStatement({
  agentId = 'FLD-88',
}: {
  agentId?: string;
}) {
  const statements: readonly WltFieldStatement[] = [];
  const statement = React.useMemo(
    () => statements.find((s) => s.fieldAgentId === agentId) || statements[0],
    [statements, agentId],
  );

  const [selectedStoreId, setSelectedStoreId] = React.useState<string | null>(null);

  const selectedStore = React.useMemo(() => {
    if (!statement) return null;
    return statement.storeLines.find((line) => line.storeId === selectedStoreId) || null;
  }, [statement, selectedStoreId]);

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ direction: 'rtl' }}>
        <Text role="titleSm" style={{ textAlign: 'right' }}>لا توجد تسويات عمولة للميدانيين في معاينة WLT.</Text>
      </Box>
    );
  }

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      {/* Header bar */}
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Text role="titleMd" weight="black">كشف عمولة الميداني</Text>
            <Text role="bodySm" tone="soft" style={{ marginTop: 4 }}>
              {statement.fieldAgentName} ({statement.fieldAgentId}) · دورة {statement.commissionCycleId} · {STATUS_LABEL[statement.status]}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: radius.xs, fontWeight: 700 }}>
              دورة: {statement.cycleStart} إلى {statement.cycleEnd}
            </span>
            <span style={{ fontSize: 11, background: 'var(--bth-success-surface)', color: 'var(--bth-success-text)', padding: '4px 10px', borderRadius: radius.xs, fontWeight: 700 }}>
              موعد الصرف: {statement.expectedPayoutDate}
            </span>
          </div>
        </div>
      </Box>

      {/* Summary Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div style={{ border: '1px solid var(--bth-control-panel-border)', borderRadius: 8, padding: '12px', background: 'var(--bth-control-panel-surface-raised)' }}>
          <div style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', marginBottom: 4 }}>إجمالي المتاجر المستقطبة</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--bth-control-panel-text)' }}>{statement.totalStoreCount} متاجر</div>
        </div>
        <div style={{ border: '1px solid var(--bth-control-panel-border)', borderRadius: 8, padding: '12px', background: 'var(--bth-control-panel-surface-raised)' }}>
          <div style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', marginBottom: 4 }}>المتاجر المؤهلة</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--bth-success-text)' }}>{statement.eligibleStoreCount} متجر مفعّل</div>
        </div>
        <div style={{ border: '1px solid var(--bth-control-panel-border)', borderRadius: 8, padding: '12px', background: 'var(--bth-control-panel-surface-raised)' }}>
          <div style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', marginBottom: 4 }}>إجمالي المستحق المكتسب</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--bth-control-panel-text)', fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(statement.totalCommissionMinorUnits)}</div>
        </div>
        <div style={{ border: '1px solid var(--bth-control-panel-border)', borderRadius: 8, padding: '12px', background: 'var(--bth-control-panel-surface-raised)' }}>
          <div style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', marginBottom: 4 }}>ما تم صرفه</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--bth-success-text)', fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(statement.paidMinorUnits)}</div>
        </div>
        <div style={{ border: '1px solid var(--bth-control-panel-border)', borderRadius: 8, padding: '12px', background: 'var(--bth-control-panel-surface-raised)' }}>
          <div style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', marginBottom: 4 }}>المتبقي المعلق</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--bth-warning-text)', fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(statement.remainingMinorUnits)}</div>
        </div>
        <div style={{ border: '1px solid var(--bth-control-panel-border)', borderRadius: 8, padding: '12px', background: 'var(--bth-control-panel-surface-raised)' }}>
          <div style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', marginBottom: 4 }}>المحجوز المؤقت</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--bth-danger-text)', fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(statement.heldMinorUnits)}</div>
        </div>
      </div>

      {/* Workbench Area: Table + Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedStore ? '1fr 300px' : '1fr', gap: 16, alignItems: 'start' }}>
        {/* Stores Table */}
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text role="titleSm" weight="black">سجل المتاجر المستقطبة ومبالغ العمولات</Text>
            <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>اضغط على أي صف لعرض دليل التفعيل وقيود الأستاذ.</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bth-control-panel-border)' }}>
                {['المتجر', 'تاريخ الانضمام', 'تاريخ التفعيل', 'الحالة التشغيلية', 'طلبات مؤهلة', 'قيمة المبيعات', 'العمولة', 'المصروف', 'المتبقي', 'الأدلة'].map((h) => (
                  <th key={h} style={{ textAlign: 'right', padding: '10px 8px', fontSize: 11, color: 'var(--bth-control-panel-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statement.storeLines.map((line) => {
                const isSelected = selectedStoreId === line.storeId;
                const statusColor = line.activationStatus === 'active' ? 'var(--bth-success-text)' : line.activationStatus === 'pending_review' ? 'var(--bth-warning-text)' : 'var(--bth-danger-text)';
                return (
                  <tr
                    key={line.storeId}
                    onClick={() => setSelectedStoreId(isSelected ? null : line.storeId)}
                    style={{
                      borderBottom: '1px solid var(--bth-control-panel-border)',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px 8px', fontWeight: 800 }}>
                      <div>{line.storeName}</div>
                      <span style={{ fontSize: 9, color: 'var(--bth-control-panel-text-muted)' }}>{line.storeId}</span>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 11 }}>{line.joinedAt}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11 }}>{line.activatedAt}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11, color: statusColor, fontWeight: 700 }}>
                      {ACTIVATION_STATUS_LABEL[line.activationStatus]}
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{line.qualifiedOrderCount}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(line.qualifiedOrderValueMinorUnits)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(line.commissionMinorUnits)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11, color: 'var(--bth-success-text)', fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(line.paidMinorUnits)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11, color: 'var(--bth-warning-text)', fontVariantNumeric: 'tabular-nums' }}>{formatWltYer(line.remainingMinorUnits)}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                        {line.evidenceRef}
                      </code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </Box>

        {/* Store Inspector */}
        {selectedStore && (
          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={3}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--bth-control-panel-text)' }}>تفاصيل دليل التفعيل المالي</span>
              <button
                onClick={() => setSelectedStoreId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--bth-control-panel-text-muted)' }}
              >
                ✕
              </button>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--bth-control-panel-border)', margin: 0 }} />

            <Box gap={1}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>اسم المنشأة</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{selectedStore.storeName}</span>
            </Box>

            <Box gap={1}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>حالة التفعيل ودليل الإثبات</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: selectedStore.activationStatus === 'active' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)' }}>
                {ACTIVATION_STATUS_LABEL[selectedStore.activationStatus]}
              </span>
              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--bth-control-panel-text-muted)' }}>مرجع المستند الرقمي:</span>
                <code style={{ fontSize: 10, background: 'rgba(0,0,0,0.05)', padding: '3px 8px', borderRadius: 4, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {selectedStore.evidenceRef}
                </code>
              </div>
            </Box>

            {selectedStore.holdReason !== '—' && (
              <Box gap={1} padding={2} background="surfaceInset" radiusToken="sm" style={{ borderRightWidth: 3, borderRightColor: 'var(--bth-danger-text)', borderStyle: 'solid' }}>
                <span style={{ fontSize: 10, color: 'var(--bth-danger-text)', fontWeight: 700 }}>سبب الحظر المالي / التعليق:</span>
                <span style={{ fontSize: 11, color: 'var(--bth-control-panel-text)', lineHeight: 1.4 }}>{selectedStore.holdReason}</span>
              </Box>
            )}

            <Box gap={1}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>الطلبات المؤهلة للعمولة</span>
              <span style={{ fontSize: 11 }}>
                تعتمد عمولة الميداني بنسبة 5% على تفعيل ربط المتجر. إجمالي قيمة طلبات الربط: {formatWltYer(selectedStore.qualifiedOrderValueMinorUnits)} (إجمالي {selectedStore.qualifiedOrderCount} طلب)
              </span>
            </Box>
          </Box>
        )}
      </div>

    </Box>
  );
}

export default WltDshFieldCommissionStatement;
