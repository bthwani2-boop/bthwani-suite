'use client';

import React from 'react';
import { Box, Text, Button } from '@bthwani/ui-kit';
import { getAdaptedFinanceControlPanelRows, type DshFinancePreviewRow } from '../adapters/dshFinanceFixture.adapter';
import { formatWltYer } from '../financeContracts';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

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
  const [allRows, setAllRows] = React.useState<ReadonlyArray<DshFinancePreviewRow>>(() => {
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
  });

  const [auditTrails, setAuditTrails] = React.useState<Record<string, Array<{ timestamp: string; actor: string; action: string; note?: string }>>>({});
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);
  const [showCloseSimPreview, setShowCloseSimPreview] = React.useState(false);

  const getInitialAuditLogs = React.useCallback((row: DshFinancePreviewRow) => {
    const logs = [];
    logs.push({
      timestamp: '09:00 ص',
      actor: 'نظام WLT الآلي',
      action: 'تم تسجيل القيد وتوقيع المتوقع ماليًا',
      note: `المصدر: ${EXPECTED_SOURCE_LABEL[row.expectedSource] || row.expectedSource}`,
    });
    if (row.evidenceStatus === 'complete') {
      logs.push({
        timestamp: '09:15 ص',
        actor: 'مُعد مالي (Maker)',
        action: 'ربط وثيقة المطابقة الرقمية وتأكيد سلامة الإيداع',
        note: row.bankDepositRef || row.cashBagRef,
      });
    }
    if (row.workflowState === 'approved') {
      logs.push({
        timestamp: '10:00 ص',
        actor: 'مدقق مالي (Checker)',
        action: 'الاعتماد النهائي وترحيل القيد للدفاتر الرسمية للمنصة',
      });
    } else if (row.workflowState === 'checked') {
      logs.push({
        timestamp: '09:45 ص',
        actor: 'مدقق مالي (Checker)',
        action: 'اعتماد مطابقة الأرصدة والموافقة الأولية',
      });
    } else if (row.workflowState === 'blocked_wlt') {
      logs.push({
        timestamp: '09:20 ص',
        actor: 'نظام التحكم بمخاطر WLT',
        action: 'حجب القيد ماليًا وتصنيفه كحالة حرجة معلقة',
        note: row.blockedReason,
      });
    }
    return logs;
  }, []);

  const handleUpdateRow = (
    rowId: string,
    updates: Partial<DshFinancePreviewRow>,
    actionText: string
  ) => {
    setAllRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          const nextRow = { ...r, ...updates };
          if (updates.actualMinorUnits !== undefined || updates.expectedMinorUnits !== undefined) {
            nextRow.varianceMinorUnits = nextRow.expectedMinorUnits - nextRow.actualMinorUnits;
          }
          return nextRow;
        }
        return r;
      })
    );

    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setAuditTrails((prev) => {
      const row = allRows.find((r) => r.id === rowId);
      const currentLogs = prev[rowId] || (row ? getInitialAuditLogs(row) : []);
      return {
        ...prev,
        [rowId]: [
          ...currentLogs,
          {
            timestamp: timeString,
            actor: 'محاكي التحكم (DSH Workbench)',
            action: actionText,
          },
        ],
      };
    });
  };

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

        <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {gateOpen ? (
            <Button
              label="تحضير محاكاة إغلاق اليوم [معاينة]"
              size="sm"
              tone="secondary"
              onPress={() => setShowCloseSimPreview((v) => !v)}
            />
          ) : (
            <span style={{ fontSize: 11, color: 'var(--bth-danger-text)', fontWeight: '700', background: 'var(--bth-danger-surface)', padding: '6px 12px', borderRadius: 6 }}>
              🔒 ترحيل الإغلاق معلق
            </span>
          )}
          {showCloseSimPreview ? (
            <div className={wltStyles.previewBoundaryNotice} role="status" aria-live="polite">
              <span className={wltStyles.previewBoundaryIcon}>🔒</span>
              <span className={wltStyles.previewBoundaryText}>
                محاكاة الإغلاق — معاينة فقط. التنفيذ الفعلي يتطلب WLT runtime + Maker-Checker API
                (CONTRACT_SCAFFOLD_PREVIEW_ONLY).
              </span>
              <button
                type="button"
                className={wltStyles.previewBoundaryDismiss}
                onClick={() => setShowCloseSimPreview(false)}
                aria-label="إغلاق الإشعار"
              >
                ✕
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <Box gap={2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
          <Text role="titleSm" style={{ fontWeight: '800', margin: 0 }}>ميزان مطابقة البنود والقيود اليومية ({allRows.length} قيد)</Text>
          <button
            onClick={() => {
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
              setAllRows(combined);
              setAuditTrails({});
            }}
            style={{
              background: 'transparent',
              border: '1px solid var(--bthwani-control-panel-border)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 11,
              cursor: 'pointer',
              fontWeight: '700',
              color: 'var(--bthwani-control-panel-text-muted)',
              transition: 'background 0.2s',
            }}
          >
            🔄 إعادة تعيين المحاكاة
          </button>
        </div>

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
                    <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 4, fontWeight: '700' }}>
                      <Text family="mono" style={{ fontSize: 10 }}>{row.id}</Text>
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, fontWeight: '800', color: 'var(--bthwani-control-panel-text)' }}>{row.owner}</span>
                      <span style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)' }}>{EVENT_KIND_LABEL[row.eventKind] || row.eventKind}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexGrow: 1, justifyContent: 'center', maxWidth: 460 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: 120 }}>
                      <span style={{ fontSize: 12, fontWeight: '700', color: 'var(--bth-info-text)' }}>
                        <span className={wltStyles.tabularNums}>{formatWltYer(row.expectedMinorUnits)}</span>
                      </span>
                      <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>{EXPECTED_SOURCE_LABEL[row.expectedSource] || row.expectedSource}</span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: '800', padding: '1px 6px', borderRadius: 4, background: hasVar ? 'var(--bth-danger-surface)' : 'var(--bth-success-surface)', color: hasVar ? 'var(--bth-danger-text)' : 'var(--bth-success-text)', whiteSpace: 'nowrap' }}>
                      {hasVar ? `فارق: ${formatWltYer(row.varianceMinorUnits)}` : 'متطابق ✓'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                      <span style={{ fontSize: 12, fontWeight: '700', color: 'var(--bth-brand-alt)' }}>
                        <span className={wltStyles.tabularNums}>{formatWltYer(row.actualMinorUnits)}</span>
                      </span>
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
                  <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid var(--bthwani-control-panel-border)',
                    background: 'rgba(0,0,0,0.015)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}>
                    <div style={{
                      background: 'var(--bthwani-control-panel-surface-raised)',
                      border: '1px solid var(--bthwani-control-panel-border)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                      gap: 16,
                    }}>
                      {/* Column 1: Accounts & Journal Entries */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--bthwani-control-panel-border)', paddingBottom: 6 }}>
                          <span style={{ fontSize: 13 }}>📊</span>
                          <span style={{ fontSize: 12, fontWeight: '800', color: 'var(--bthwani-control-panel-text)' }}>تفاصيل قيد الأستاذ والحسابات</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                          <div>
                            <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-soft)', display: 'block' }}>الحساب المدين (Debit)</span>
                            <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.04)', padding: '2px 4px', borderRadius: 3, display: 'inline-block', marginTop: 2 }}>
                              <Text family="mono" style={{ fontSize: 10 }}>{row.debitAccountId || 'wlt:escrow'}</Text>
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-soft)', display: 'block' }}>الحساب الدائن (Credit)</span>
                            <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.04)', padding: '2px 4px', borderRadius: 3, display: 'inline-block', marginTop: 2 }}>
                              <Text family="mono" style={{ fontSize: 10 }}>{row.creditAccountId || 'wlt:payout'}</Text>
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-soft)', display: 'block' }}>رقم مرجع قيد اليومية</span>
                            <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.04)', padding: '2px 4px', borderRadius: 3, display: 'inline-block', marginTop: 2 }}>
                              <Text family="mono" style={{ fontSize: 10 }}>{row.ledgerEntryRef || `LED-PRV-${row.id}`}</Text>
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-soft)', display: 'block' }}>سند المصدر المتوقع ➔ الفعلي</span>
                            <span style={{ fontSize: 10, fontWeight: '700', display: 'block', marginTop: 2 }}>
                              {EXPECTED_SOURCE_LABEL[row.expectedSource] || row.expectedSource} ➔ {ACTUAL_SOURCE_LABEL[row.actualSource] || row.actualSource}
                            </span>
                          </div>
                        </div>

                        {hasVar && (
                          <div style={{ marginTop: 6 }}>
                            <button
                              onClick={() => {
                                handleUpdateRow(
                                  row.id,
                                  {
                                    actualMinorUnits: row.expectedMinorUnits,
                                    reconciliationStatus: 'matched',
                                    evidenceStatus: 'complete',
                                    bankDepositRef: row.bankDepositRef || `[معاينة] DEP-${row.id}`,
                                  },
                                  `تسوية الفارق المالي وتحديث الفعلي المورد إلى ${formatWltYer(row.expectedMinorUnits)}`
                                );
                              }}
                              style={{
                                width: '100%',
                                background: 'var(--bth-warning-surface)',
                                border: '1px solid var(--bth-warning-text)',
                                borderRadius: 6,
                                padding: '6px 10px',
                                fontSize: 10,
                                cursor: 'pointer',
                                color: 'var(--bth-warning-text)',
                                fontWeight: '700',
                                transition: 'all 0.2s',
                              }}
                            >
                              💵 إيداع المبلغ بالكامل لتسوية الفارق
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Column 2: Evidence & Maker-Checker Workflow */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Evidence Document Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bthwani-control-panel-border)', paddingBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 13 }}>📁</span>
                              <span style={{ fontSize: 12, fontWeight: '800', color: 'var(--bthwani-control-panel-text)' }}>الأدلة الرقمية والوثائق</span>
                            </div>
                            <span style={{
                              fontSize: 9,
                              fontWeight: '700',
                              color: row.evidenceStatus === 'complete' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
                              background: row.evidenceStatus === 'complete' ? 'var(--bth-success-surface)' : 'var(--bth-warning-surface)',
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}>
                              {EVIDENCE_LABEL[row.evidenceStatus]}
                            </span>
                          </div>

                          {(row.bankDepositRef || row.cashBagRef) ? (
                            <div style={{
                              background: 'var(--bthwani-control-panel-surface)',
                              border: '1px solid var(--bthwani-control-panel-border)',
                              borderRadius: 6,
                              padding: '6px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 16 }}>📄</span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                  <span style={{ fontSize: 10, fontWeight: '700', color: 'var(--bthwani-control-panel-text)' }}>
                                    {row.bankDepositRef ? `${row.bankDepositRef.replace('[معاينة] ', '')}.pdf` : `${row.cashBagRef?.replace('[معاينة] ', '')}.zip`}
                                  </span>
                                  <span style={{ fontSize: 8, color: 'var(--bth-success-text)', fontWeight: '700' }}>
                                    ✓ مُحقق وموقّع رقميًا
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => console.warn('[WLT-PREVIEW] معاينة وثيقة:', row.bankDepositRef || row.cashBagRef)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid var(--bthwani-control-panel-border)',
                                  borderRadius: 4,
                                  padding: '2px 6px',
                                  fontSize: 9,
                                  cursor: 'pointer',
                                  color: 'var(--bthwani-control-panel-text)',
                                }}
                              >
                                معاينة
                              </button>
                            </div>
                          ) : (
                            <div style={{
                              background: 'var(--bth-danger-surface)',
                              border: '1px dashed var(--bth-danger-text)',
                              borderRadius: 6,
                              padding: 8,
                              textAlign: 'center',
                              color: 'var(--bth-danger-text)',
                              fontSize: 10,
                              fontWeight: '700',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              <span>🚨 مستند الإثبات مفقود!</span>
                              <button
                                onClick={() => {
                                  handleUpdateRow(
                                    row.id,
                                    {
                                      evidenceStatus: 'complete',
                                      bankDepositRef: `[معاينة] DEP-${row.id}`,
                                      reconciliationStatus: row.varianceMinorUnits === 0 ? 'matched' : 'unmatched',
                                    },
                                    'تم رفع وثيقة إثبات الإيداع البنكي رقم DEP-' + row.id
                                  );
                                }}
                                style={{
                                  background: 'var(--bth-danger-text)',
                                  color: 'var(--bthwani-brand-contrast)',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: 9,
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                }}
                              >
                                إرفاق وثيقة إيداع بنكي
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Dual Approval Workflow Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bthwani-control-panel-border)', paddingBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 13 }}>👑</span>
                              <span style={{ fontSize: 12, fontWeight: '800', color: 'var(--bthwani-control-panel-text)' }}>نظام الاعتماد الثنائي (Maker-Checker)</span>
                            </div>
                            <span style={{
                              fontSize: 9,
                              fontWeight: '700',
                              color: row.workflowState === 'approved' ? 'var(--bth-success-text)' : row.workflowState === 'blocked_wlt' ? 'var(--bth-danger-text)' : 'var(--bth-warning-text)',
                              background: row.workflowState === 'approved' ? 'var(--bth-success-surface)' : row.workflowState === 'blocked_wlt' ? 'var(--bth-danger-surface)' : 'var(--bth-warning-surface)',
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}>
                              {row.workflowState === 'approved' ? 'معتمد ومرحل' : row.workflowState === 'blocked_wlt' ? 'محجوب 🚨' : row.workflowState === 'checked' ? 'مُدقّق' : 'مسودة'}
                            </span>
                          </div>

                          {/* Compact Stepper */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2px 0' }}>
                            {[
                              { key: 'draft', label: 'مسودة' },
                              { key: 'prepared', label: 'مُعدّ' },
                              { key: 'checked', label: 'مُدقّق' },
                              { key: 'approved', label: 'معتمد' },
                            ].map((step, idx, arr) => {
                              const isDone = (
                                row.workflowState === 'approved' ||
                                (row.workflowState === 'checked' && step.key !== 'approved') ||
                                (row.workflowState === 'reviewed' && step.key !== 'approved' && step.key !== 'checked') ||
                                (row.workflowState === 'prepared' && step.key !== 'approved' && step.key !== 'checked') ||
                                step.key === 'draft'
                              );
                              const isActive = row.workflowState === step.key || (row.workflowState === 'reviewed' && step.key === 'prepared');

                              return (
                                <React.Fragment key={step.key}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                                    <div style={{
                                      width: 14,
                                      height: 14,
                                      borderRadius: '50%',
                                      background: isDone ? 'var(--bthwani-brand-primary)' : 'var(--bthwani-control-panel-border)',
                                      border: isActive ? '2px solid var(--bth-success-text)' : 'none',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      color: 'var(--bthwani-brand-contrast)',
                                      fontSize: 7,
                                      fontWeight: '700',
                                      zIndex: 2,
                                    }}>
                                      {isDone ? '✓' : idx + 1}
                                    </div>
                                    <span style={{ fontSize: 8, fontWeight: isActive ? '800' : '700', color: isActive ? 'var(--bthwani-control-panel-text)' : 'var(--bthwani-control-panel-text-muted)', marginTop: 2 }}>
                                      {step.label}
                                    </span>
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div style={{
                                      height: 1,
                                      background: isDone ? 'var(--bthwani-brand-primary)' : 'var(--bthwani-control-panel-border)',
                                      flexGrow: 1,
                                      marginTop: 6,
                                      zIndex: 1,
                                    }} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {row.workflowState === 'blocked_wlt' && (
                            <div style={{
                              background: 'var(--bth-danger-surface)',
                              border: '1px solid var(--bth-danger-text)',
                              borderRadius: 4,
                              padding: '4px 6px',
                              fontSize: 9,
                              color: 'var(--bth-danger-text)',
                              fontWeight: '700',
                              marginTop: 2,
                            }}>
                              🚨 محجوب ماليًا: {row.blockedReason || 'يوجد فارق غير مسوّى أو الأدلة غير مكتملة.'}
                            </div>
                          )}

                          {/* Action Buttons Row */}
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                            {row.workflowState === 'draft' && (
                              <button
                                onClick={() => handleUpdateRow(row.id, { workflowState: 'prepared' }, 'تم تقديم القيد وتجهيزه للمراجعة')}
                                style={{
                                  background: 'var(--bthwani-brand-primary)',
                                  color: 'var(--bthwani-brand-contrast)',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: 9,
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                }}
                              >
                                📤 تقديم للمراجعة
                              </button>
                            )}

                            {(row.workflowState === 'prepared' || row.workflowState === 'reviewed' || row.workflowState === 'draft') && (
                              <>
                                <button
                                  onClick={() => {
                                    if (row.evidenceStatus !== 'complete') {
                                      console.warn('[WLT-PREVIEW] تدقيق مرفوض: وثيقة المطابقة مطلوبة أولاً');
                                      return;
                                    }
                                    handleUpdateRow(row.id, { workflowState: 'checked', reconciliationStatus: 'matched' }, 'تم تدقيق القيد ومطابقة الأرصدة وإقرار صحتها');
                                  }}
                                  style={{
                                    background: 'var(--bth-success-text)',
                                    color: 'var(--bthwani-brand-contrast)',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '4px 8px',
                                    fontSize: 9,
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    opacity: row.evidenceStatus === 'complete' ? 1 : 0.5,
                                  }}
                                >
                                  ✓ تدقيق ومطابقة
                                </button>

                                <button
                                  onClick={() => handleUpdateRow(row.id, { workflowState: 'blocked_wlt', reconciliationStatus: 'disputed' }, 'تم حجب القيد للتأكد من موازنة الحسابات')}
                                  style={{
                                    background: 'var(--bth-danger-text)',
                                    color: 'var(--bthwani-brand-contrast)',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '4px 8px',
                                    fontSize: 9,
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                  }}
                                >
                                  🚨 حجب القيد
                                </button>
                              </>
                            )}

                            {row.workflowState === 'checked' && (
                              <button
                                onClick={() => handleUpdateRow(row.id, { workflowState: 'approved', reconciliationStatus: 'closed' }, 'تم الاعتماد النهائي لقيد التسوية وإغلاقه')}
                                style={{
                                  background: 'var(--bthwani-brand-primary)',
                                  color: 'var(--bthwani-brand-contrast)',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: 9,
                                  cursor: 'pointer',
                                  fontWeight: '800',
                                }}
                              >
                                👑 اعتماد نهائي وإغلاق
                              </button>
                            )}

                            {row.workflowState === 'blocked_wlt' && (
                              <button
                                onClick={() => handleUpdateRow(row.id, { workflowState: 'draft', reconciliationStatus: 'unmatched' }, 'تم إلغاء حجب القيد وإعادته للمراجعة والتعديل')}
                                style={{
                                  background: 'var(--bthwani-brand-primary)',
                                  color: 'var(--bthwani-brand-contrast)',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: 9,
                                  cursor: 'pointer',
                                  fontWeight: '700',
                                }}
                              >
                                🔓 إلغاء الحجب وإعادة المحاولة
                              </button>
                            )}

                            {row.workflowState === 'approved' && (
                              <span style={{ fontSize: 9, color: 'var(--bth-success-text)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: 4 }}>
                                ✓ قيد مغلق ومرحل نهائيًا للأستاذ.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Log Section */}
                    <div style={{ marginTop: 10, borderTop: '1px solid var(--bthwani-control-panel-border)', paddingTop: 8 }}>
                      <span style={{ fontSize: 9, fontWeight: '700', color: 'var(--bthwani-control-panel-text-muted)', display: 'block', marginBottom: 4 }}>سجل أحداث القيد والتدقيق المالي (Audit Trail):</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {(auditTrails[row.id] || getInitialAuditLogs(row)).map((log, index) => (
                          <div key={index} style={{ display: 'flex', gap: 6, fontSize: 9, alignItems: 'center' }}>
                            <Text family="mono" style={{ color: 'var(--bthwani-control-panel-text-muted)', fontSize: 9 }}>[{log.timestamp}]</Text>
                            <span style={{ fontWeight: '700', color: 'var(--bthwani-brand-primary)' }}>{log.actor}:</span>
                            <span style={{ color: 'var(--bthwani-control-panel-text)' }}>{log.action}</span>
                            {log.note && <span style={{ color: 'var(--bthwani-control-panel-text-muted)', fontStyle: 'italic' }}>({log.note})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </Box>

      <div className={wltStyles.reconciliationSummaryGrid}>
        {[
          { label: 'إجمالي المبالغ المتوقعة', value: formatWltYer(totalExpected), color: 'var(--bth-info-text)' },
          { label: 'إجمالي المبالغ الفعلية الموردة', value: formatWltYer(totalActual), color: 'var(--bth-brand-alt)' },
          { label: 'صافي الفارق المالي الإجمالي', value: totalVariance !== 0 ? `${formatWltYer(totalVariance)} ⚠` : '٠ ر.ي ✓', color: totalVariance !== 0 ? 'var(--bth-danger-text)' : 'var(--bth-success-text)' },
          { label: 'اكتمال مستندات المطابقة', value: `${allRows.filter((r) => r.evidenceStatus === 'complete').length}/${allRows.length} بند`, color: allEvidenceComplete ? 'var(--bth-success-text)' : 'var(--bth-warning-text)' },
        ].map(({ label, value, color }) => (
          <div key={label} className={wltStyles.reconciliationSummaryCard}>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{label}</Text>
            <Text role="bodyStrong" style={{ textAlign: 'right', fontWeight: '800', color, fontSize: 14 }}>
              <span className={wltStyles.tabularNums}>{value}</span>
            </Text>
          </div>
        ))}
      </div>
    </Box>
  );
}

export default DailyReconciliationWorkbench;
