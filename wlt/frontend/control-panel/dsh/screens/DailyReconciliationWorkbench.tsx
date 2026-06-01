'use client';

import React from 'react';
import { Box, Text, Button } from '@bthwani/ui-kit';
import { getAdaptedFinanceControlPanelRows, type DshFinancePreviewRow } from '../../../../../dsh/frontend/data/wallet.preview-data';

type DayLifecycleStage =
  | 'open'
  | 'expected-registered'
  | 'actual-registered'
  | 'reconciliation'
  | 'variances'
  | 'maker-review'
  | 'checker-approval'
  | 'day-close';

const LIFECYCLE_STAGES: ReadonlyArray<{ id: DayLifecycleStage; label: string }> = [
  { id: 'open', label: 'فتح اليوم' },
  { id: 'expected-registered', label: 'تسجيل المتوقع' },
  { id: 'actual-registered', label: 'تسجيل الفعلي' },
  { id: 'reconciliation', label: 'المطابقة والتدقيق' },
  { id: 'variances', label: 'حصر الفوارق' },
  { id: 'maker-review', label: 'تحضير (Maker)' },
  { id: 'checker-approval', label: 'موافقة (Checker)' },
  { id: 'day-close', label: 'إغلاق اليوم' },
] as const;

function computeCurrentStage(rows: ReadonlyArray<DshFinancePreviewRow>): DayLifecycleStage {
  if (rows.length === 0) return 'open';
  if (rows.some((r) => r.workflowState === 'blocked_wlt')) return 'variances';
  if (rows.some((r) => r.varianceMinorUnits !== 0)) return 'variances';
  if (rows.some((r) => r.reconciliationStatus === 'unmatched' || r.reconciliationStatus === 'disputed')) return 'reconciliation';
  if (rows.some((r) => r.evidenceStatus !== 'complete')) return 'maker-review';
  if (rows.some((r) => r.workflowState !== 'checked' && r.workflowState !== 'approved')) return 'maker-review';
  if (rows.some((r) => r.expectedSource === 'preview-seed' && r.id !== 'FIN-EMPTY-1')) return 'expected-registered';
  if (rows.some((r) => r.actualSource === 'preview-seed' && r.id !== 'FIN-EMPTY-1')) return 'actual-registered';
  return 'checker-approval';
}

function resolveRowTone(row: DshFinancePreviewRow) {
  if (row.risk === 'danger') return 'danger' as const;
  if (row.risk === 'warning') return 'warning' as const;
  if (row.varianceMinorUnits !== 0 || row.evidenceStatus !== 'complete') return 'warning' as const;
  return 'success' as const;
}

const EVIDENCE_LABEL: Record<DshFinancePreviewRow['evidenceStatus'], string> = {
  complete: 'مكتملة ✓',
  partial: 'جزئية ⚠️',
  missing: 'ناقصة 🚨',
};

const RECONCILIATION_LABEL: Record<DshFinancePreviewRow['reconciliationStatus'], string> = {
  closed: 'مغلق ومرحل',
  matched: 'متطابق ✓',
  disputed: 'قيد النزاع',
  unmatched: 'غير مطابق',
};

const EVENT_KIND_LABEL: Record<string, string> = {
  'client-payment': 'دفع عميل',
  'wallet-payment': 'دفع محفظة',
  'cash-on-delivery': 'COD كاش',
  'partner-settlement': 'تسوية شريك',
  'store-delivery-fee': 'رسوم توصيل متجر',
  'store-courier-compensation': 'عمولة موصل',
  'captain-earning': 'أرباح كابتن',
  'captain-cod-liability': 'COD كابتن',
  'captain-eligibility-topup': 'شحن رصيد كابتن',
  'field-commission': 'عمولة ميدانية',
  'field-commission-pending': 'عمولة معلقة',
  'field-commission-rejected': 'عمولة مرفوضة',
  'field-payout': 'صرف للميداني',
  'refund-adjustment': 'تعديل استرداد',
  'platform-commission': 'عمولة المنصة',
  'reconciliation-export': 'تصدير مطابقة',
};

const EXPECTED_SOURCE_LABEL: Record<string, string> = {
  'order-invoice': 'فاتورة الطلب',
  'settlement-cycle': 'دورة التسوية',
  'commission-schedule': 'جدول العمولات',
  'eligibility-calc': 'حسب الأهلية',
  'preview-seed': 'بيانات معاينة',
};

const ACTUAL_SOURCE_LABEL: Record<string, string> = {
  'bank-deposit': 'إيداع بنكي',
  'wallet-debit': 'خصم محفظة',
  'cash-bag-delivery': 'حقيبة نقدية',
  'pos-receipt': 'إيصال دفع',
  'preview-seed': 'بيانات معاينة',
};

export function DailyReconciliationWorkbench() {
  const allRows = React.useMemo(() => {
    const surfaces = getAdaptedFinanceControlPanelRows();
    const seen = new Set<string>();
    const combined: DshFinancePreviewRow[] = [];
    for (const surface of [
      surfaces.overview,
      surfaces['cod-reconciliation'],
      surfaces.settlements,
      surfaces.payouts,
      surfaces.refunds,
    ] as const) {
      for (const row of surface) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          combined.push(row);
        }
      }
    }
    return combined;
  }, []);

  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  const currentStage = computeCurrentStage(allRows);
  const stageIndex = LIFECYCLE_STAGES.findIndex((s) => s.id === currentStage);

  const totalExpected = allRows.reduce((s, r) => s + r.expectedMinorUnits, 0);
  const totalActual = allRows.reduce((s, r) => s + r.actualMinorUnits, 0);
  const totalVariance = totalExpected - totalActual;
  const allEvidenceComplete = allRows.every((r) => r.evidenceStatus === 'complete');
  const allRowsApproved = allRows.every((r) => r.workflowState === 'checked' || r.workflowState === 'approved');
  const noBlockedWlt = allRows.every((r) => r.workflowState !== 'blocked_wlt');
  const gateOpen = totalVariance === 0 && allEvidenceComplete && allRowsApproved && noBlockedWlt;

  const nonZeroVarianceCount = allRows.filter((r) => r.varianceMinorUnits !== 0).length;
  const incompleteEvidenceCount = allRows.filter((r) => r.evidenceStatus !== 'complete').length;
  const blockedWltCount = allRows.filter((r) => r.workflowState === 'blocked_wlt').length;
  const pendingApprovalCount = allRows.filter((r) => r.workflowState !== 'checked' && r.workflowState !== 'approved').length;

  return (
    <Box gap={4} style={{ direction: 'rtl', padding: 8, maxWidth: '100%' }}>

      <div
        style={{
          background: 'var(--bthwani-control-panel-surface)',
          border: '1px solid var(--bthwani-control-panel-border)',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: gateOpen ? 'var(--bth-success-surface)' : 'var(--bth-danger-surface)',
              border: `2px solid ${gateOpen ? 'var(--bth-success-text)' : 'var(--bth-danger-text)'}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: gateOpen ? 'var(--bth-success-text)' : 'var(--bth-danger-text)',
              fontSize: 20,
              fontWeight: '700',
            }}
          >
            {gateOpen ? '✓' : '🔒'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 15, fontWeight: '800', color: 'var(--bthwani-control-panel-text)' }}>
              بوابة إغلاق اليوم المالي
            </span>
            <span style={{ fontSize: 12, color: gateOpen ? 'var(--bth-success-text)' : 'var(--bth-danger-text)', fontWeight: '700', marginTop: 2 }}>
              {gateOpen ? 'جاهزة للمحاكاة ✓ (معاينة فقط)' : 'مغلقة - بانتظار اكتمال الشروط'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: '800', color: 'var(--bthwani-control-panel-text-muted)' }}>
            مرحلة المزامنة النشطة:
          </span>
          <span style={{ fontSize: 13, fontWeight: '800', color: 'var(--bthwani-brand-primary)' }}>
            {LIFECYCLE_STAGES[stageIndex]?.label || 'فتح اليوم'} (خطوة {stageIndex + 1} من {LIFECYCLE_STAGES.length})
          </span>
          <div style={{ width: '100%', minWidth: 200, height: 4, background: 'var(--bthwani-control-panel-border)', borderRadius: 2, overflow: 'hidden', marginTop: 2 }}>
            <div style={{ width: `${((stageIndex + 1) / LIFECYCLE_STAGES.length) * 100}%`, height: '100%', background: 'var(--bthwani-brand-primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { count: nonZeroVarianceCount, okLabel: 'مطابقة الفوارق (٠ فارق)', failLabel: `يوجد فوارق مالية (${nonZeroVarianceCount} معلقة)`, isOk: nonZeroVarianceCount === 0, danger: true },
            { count: incompleteEvidenceCount, okLabel: 'اكتمال المستندات والأدلة', failLabel: `أدلة مفقودة أو ناقصة (${incompleteEvidenceCount} بند)`, isOk: allEvidenceComplete, danger: false },
            { count: pendingApprovalCount, okLabel: 'اكتمال مسار Maker-Checker', failLabel: `بنود تنتظر المراجعة والاعتماد (${pendingApprovalCount})`, isOk: allRowsApproved, danger: false },
            { count: blockedWltCount, okLabel: 'لا توجد بنود محجوبة من WLT', failLabel: `بنود محجوبة من WLT (${blockedWltCount})`, isOk: noBlockedWlt, danger: true },
          ].map(({ okLabel, failLabel, isOk, danger }) => (
            <div key={okLabel} style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 12, fontWeight: '700', color: isOk ? 'var(--bth-success-text)' : danger ? 'var(--bth-danger-text)' : 'var(--bth-warning-text)' }}>
                {isOk ? okLabel : failLabel}
              </span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: isOk ? 'var(--bth-success-text)' : danger ? 'var(--bth-danger-text)' : 'var(--bth-warning-text)' }} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {gateOpen ? (
            <Button label="تحضير محاكاة إغلاق اليوم [معاينة]" size="sm" tone="secondary" onPress={() => {}} />
          ) : (
            <span style={{ fontSize: 11, color: 'var(--bth-danger-text)', fontWeight: '700', background: 'var(--bth-danger-surface)', padding: '6px 12px', borderRadius: 6 }}>
              🔒 ترحيل الإغلاق معلق
            </span>
          )}
        </div>
      </div>

      <Box gap={2} style={{ padding: '0 4px' }}>
        <Text role="titleSm" style={{ fontWeight: '800' }}>ميزان مطابقة البنود والقيود اليومية ({allRows.length} قيد)</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {allRows.map((row) => {
            const hasVar = row.varianceMinorUnits !== 0;
            const isExpanded = expandedRowId === row.id;
            const rowTone = resolveRowTone(row);
            const toneColor = rowTone === 'danger' ? 'var(--bth-danger-text)' : rowTone === 'warning' ? 'var(--bth-warning-text)' : 'var(--bth-success-text)';

            return (
              <div
                key={row.id}
                style={{
                  background: 'var(--bthwani-control-panel-surface)',
                  border: '1px solid var(--bthwani-control-panel-border)',
                  borderRight: `4px solid ${toneColor}`,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                  style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none', flexWrap: 'wrap', gap: 12 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
                    <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontWeight: '700' }}>{row.id}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, fontWeight: '800', color: 'var(--bthwani-control-panel-text)' }}>{row.owner}</span>
                      <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>{EVENT_KIND_LABEL[row.eventKind] || row.eventKind}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexGrow: 1, justifyContent: 'center', maxWidth: 460 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: 120 }}>
                      <span style={{ fontSize: 12, fontWeight: '700', color: 'var(--bth-info-text)', fontVariantNumeric: 'tabular-nums' }}>{row.expectedMinorUnits.toLocaleString()} وصغ</span>
                      <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{EXPECTED_SOURCE_LABEL[row.expectedSource] || row.expectedSource}</span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: '800', padding: '1px 6px', borderRadius: 4, background: hasVar ? 'var(--bth-danger-surface)' : 'var(--bth-success-surface)', color: hasVar ? 'var(--bth-danger-text)' : 'var(--bth-success-text)', whiteSpace: 'nowrap' }}>
                      {hasVar ? `فارق: ${row.varianceMinorUnits.toLocaleString()}` : 'متطابق ✓'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                      <span style={{ fontSize: 12, fontWeight: '700', color: 'var(--bth-brand-alt)', fontVariantNumeric: 'tabular-nums' }}>{row.actualMinorUnits.toLocaleString()} وصغ</span>
                      <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{ACTUAL_SOURCE_LABEL[row.actualSource] || row.actualSource}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 120, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 10, fontWeight: '700', color: row.evidenceStatus === 'complete' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)', background: row.evidenceStatus === 'complete' ? 'var(--bth-success-surface)' : 'var(--bth-warning-surface)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                      {row.evidenceStatus === 'complete' ? 'مكتملة' : 'ناقصة ⚠️'}
                    </span>
                    <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s', fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>▼</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--bthwani-control-panel-border)', background: 'rgba(0,0,0,0.01)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                      <Box padding={2.5} background="surfaceInset" radiusToken="md" border borderTone="line" gap={1.5}>
                        <span style={{ fontSize: 11, fontWeight: '700', color: 'var(--bthwani-control-panel-text-muted)' }}>الأدلة الرقمية</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-soft)' }}>مستند المطابقة</span>
                          <span style={{ fontSize: 10, fontWeight: '700' }}>{EVIDENCE_LABEL[row.evidenceStatus]}</span>
                        </div>
                        {row.bankDepositRef && <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}><span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>مرجع الإيداع</span><code style={{ fontSize: 9, background: 'rgba(0,0,0,0.04)', padding: '1px 4px', borderRadius: 3 }}>{row.bankDepositRef}</code></div>}
                        {row.cashBagRef && <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', marginTop: 2 }}><span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>حقيبة النقدية</span><code style={{ fontSize: 9, background: 'rgba(0,0,0,0.04)', padding: '1px 4px', borderRadius: 3 }}>{row.cashBagRef}</code></div>}
                      </Box>
                      <Box padding={2.5} background="surfaceRaised" radiusToken="md" border borderTone="line" gap={1.5}>
                        <span style={{ fontSize: 11, fontWeight: '700', color: 'var(--bthwani-control-panel-text-muted)' }}>حالة الاعتماد</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-soft)' }}>سير العمل</span>
                          <span style={{ fontSize: 10, fontWeight: '700' }}>{row.workflowState === 'approved' ? 'معتمد في المعاينة [تجريبي]' : row.workflowState === 'blocked_wlt' ? 'محجوب من WLT 🚨' : 'قيد المراجعة والتدقيق'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', marginTop: 2 }}>
                          <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-soft)' }}>الإجراء</span>
                          <span style={{ fontSize: 10, fontWeight: '700' }}>{RECONCILIATION_LABEL[row.reconciliationStatus]}</span>
                        </div>
                      </Box>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Box>

      <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'إجمالي المبالغ المتوقعة', value: `${totalExpected.toLocaleString()} وصغ`, color: 'var(--bth-info-text)' },
          { label: 'إجمالي المبالغ الفعلية الموردة', value: `${totalActual.toLocaleString()} وصغ`, color: 'var(--bth-brand-alt)' },
          { label: 'صافي الفارق المالي الإجمالي', value: totalVariance !== 0 ? `${totalVariance.toLocaleString()} وصغ ⚠` : '٠ وصغ ✓', color: totalVariance !== 0 ? 'var(--bth-danger-text)' : 'var(--bth-success-text)' },
          { label: 'اكتمال مستندات المطابقة', value: `${allRows.filter((r) => r.evidenceStatus === 'complete').length}/${allRows.length} بند`, color: allEvidenceComplete ? 'var(--bth-success-text)' : 'var(--bth-warning-text)' },
        ].map(({ label, value, color }) => (
          <Box key={label} gap={1} style={{ borderRight: '3px solid var(--bthwani-control-panel-border)', paddingRight: 10 }}>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{label}</Text>
            <Text role="bodyStrong" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '800', color, fontSize: 14 }}>{value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default DailyReconciliationWorkbench;
