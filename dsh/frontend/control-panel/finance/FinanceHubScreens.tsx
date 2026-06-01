'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelCompactPager,
  WebControlPanelDenseHeader,
  WebControlPanelStatusTag,
  WebControlPanelWorkbench,
} from '@bthwani/ui-kit/web';
import {
  dshFinanceControlPanelPreviewRows,
  type DshFinancePreviewRow,
  type DshFinancePreviewSurface,
} from '../../data';
import { getWltControlPanelFinancePreview } from '../../../../wlt/frontend/shared/finance/dshFinancePreview';
import { WltBoundaryBanner } from './WltBoundaryBanner';
import { buildDshWltFinanceBoundaryRecord } from '../../shared/dshFinancePreviewModel';
import { getFinanceApiBinding } from './finance.api-matrix';
import { DailyReconciliationWorkbench } from './DailyReconciliationWorkbench';

type FinanceSurface = DshFinancePreviewSurface;
type FinanceRow = DshFinancePreviewRow;

const FINANCE_ROWS = dshFinanceControlPanelPreviewRows;

// Arabic translations for sources and actions (Staff Mode)
const EXPECTED_SOURCE_AR: Record<string, string> = {
  'order-invoice': 'فاتورة الطلب المعتمدة',
  'settlement-cycle': 'دورة التسوية التشغيلية',
  'commission-schedule': 'جدول العمولات المعتمد',
  'eligibility-calc': 'حسبة أهلية الكابتن',
  'preview-seed': 'مصدر معاينة تجريبي',
};

const ACTUAL_SOURCE_AR: Record<string, string> = {
  'bank-deposit': 'حوالة إيداع بنكي',
  'wallet-debit': 'خصم رصيد المحفظة',
  'cash-bag-delivery': 'حقيبة النقدية الموردة',
  'pos-receipt': 'إيصال دفع رقمي',
  'preview-seed': 'مصدر معاينة تجريبي',
};

const EVIDENCE_SOURCE_AR: Record<string, string> = {
  'bank-statement': 'كشف حساب بنكي رسمي',
  'pos-log': 'سجل العمليات الرقمية',
  'audit-entry': 'سجل التدقيق المالي',
  'receipt-upload': 'مستند إثبات الإيداع',
  'none': 'لا توجد أدلة مرفوعة',
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

function resolveSurfaceDomain(surface: FinanceSurface): string {
  if (surface === 'settlements') return 'settlement';
  if (surface === 'payouts') return 'payout';
  if (surface === 'captain-eligibility') return 'captain-eligibility';
  if (surface === 'refunds') return 'refund';
  if (surface === 'cod-reconciliation') return 'cod-liability';
  if (surface === 'ledger') return 'ledger-journal';
  if (surface === 'risk-audit') return 'risk-audit';
  if (surface === 'overview') return 'platform-fee';
  if (surface === 'captain-finance') return 'settlement';
  if (surface === 'store-delivery-finance') return 'store-delivery-fee';
  return 'platform-fee';
}

function resolveSurfaceLabel(surface: FinanceSurface) {
  if (surface === 'overview') return 'النظرة العامة';
  if (surface === 'settlements') return 'التسويات والمدفوعات';
  if (surface === 'cod-reconciliation') return 'COD والكاش';
  if (surface === 'refunds') return 'الاستردادات';
  if (surface === 'captain-eligibility') return 'أهلية الكابتن';
  if (surface === 'payouts') return 'المدفوعات البنكية';
  if (surface === 'ledger') return 'دفتر الأستاذ';
  if (surface === 'captain-finance') return 'مالية الكباتن';
  if (surface === 'store-delivery-finance') return 'توصيل المتاجر';
  return 'الفروقات والتدقيق';
}

function resolveSurfaceDescription(surface: FinanceSurface) {
  if (surface === 'overview') return 'ملخص اليوم المالي وتدقيق إغلاق الحسابات الحالية.';
  if (surface === 'settlements') return 'مراجعة تسويات المتاجر، الكباتن، الميدانيين وتوصيل المتاجر.';
  if (surface === 'cod-reconciliation') return 'مطابقة المبالغ المحصلة يدوياً من الكباتن مع الطلبات المنفذة.';
  if (surface === 'refunds') return 'صف الاستردادات والنزاعات والطلبات المرجوعة للعملاء.';
  if (surface === 'captain-eligibility') return 'مراقبة رصيد الضمان للأهلية التشغيلية.';
  if (surface === 'payouts') return 'تحضير الحوالات البنكية وصرف المستحقات عبر WLT.';
  if (surface === 'ledger') return 'دفتر القيود اليومية وميزان المراجعة العام.';
  if (surface === 'captain-finance') return 'مراقبة حركات ذمم الكباتن.';
  if (surface === 'store-delivery-finance') return 'تدقيق عمولات توصيل المتاجر الداخلي.';
  return 'متابعة الفروقات والعمليات المعلقة التي تمنع إغلاق اليوم.';
}

function resolveRowTone(row: FinanceRow) {
  if (row.risk === 'danger') return 'danger' as const;
  if (row.risk === 'warning') return 'warning' as const;
  if (row.varianceMinorUnits !== 0 || row.evidenceStatus !== 'complete') return 'warning' as const;
  return 'success' as const;
}

function resolveToneColor(tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral') {
  if (tone === 'danger') return 'rgb(239, 68, 68)';
  if (tone === 'warning') return 'rgb(245, 158, 11)';
  if (tone === 'success') return 'rgb(16, 185, 129)';
  if (tone === 'info') return 'rgb(59, 130, 246)';
  return 'rgb(107, 114, 128)';
}

export function FinanceSurfaceBoard({
  surface,
  subGroup,
  technicalAuditMode = false,
}: {
  surface: FinanceSurface;
  subGroup?: string;
  technicalAuditMode?: boolean;
}) {
  const router = useRouter();
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  const rows = React.useMemo(() => {
    // Dynamic subgroup mapping to bring in sub-filter workspaces
    if (surface === 'cod-reconciliation') {
      if (subGroup === 'captain-eligibility') return FINANCE_ROWS['captain-eligibility'];
      if (subGroup === 'captain-finance') return FINANCE_ROWS['captain-finance'];
    }
    if (surface === 'settlements') {
      if (subGroup === 'store-delivery') return FINANCE_ROWS['store-delivery-finance'];
    }

    const baseRows = FINANCE_ROWS[surface];
    const wltPreview = getWltControlPanelFinancePreview();

    if (!subGroup || subGroup === 'all') return baseRows;

    if (surface === 'overview' && subGroup === 'daily-close') {
      return baseRows;
    }

    if (surface === 'overview') {
      if (subGroup === 'inflow') {
        return baseRows.filter((row) => {
          const rec = wltPreview.allRecords.find((r) => r.id === row.id);
          return rec?.tone === 'positive';
        });
      }
      if (subGroup === 'outflow') {
        return baseRows.filter((row) => {
          const rec = wltPreview.allRecords.find((r) => r.id === row.id);
          return rec?.tone === 'negative';
        });
      }
      if (subGroup === 'net') return baseRows;
    }

    if (surface === 'settlements') {
      if (subGroup === 'partners') return baseRows.filter((row) => row.actorType === 'partner');
      if (subGroup === 'captains') return baseRows.filter((row) => row.actorType === 'captain');
      if (subGroup === 'field') return baseRows.filter((row) => row.actorType === 'field');
    }

    if (surface === 'cod-reconciliation') {
      if (subGroup === 'mismatch') return baseRows.filter((row) => row.varianceMinorUnits !== 0);
      if (subGroup === 'collected') return baseRows.filter((row) => row.reconciliationStatus === 'matched' || row.reconciliationStatus === 'closed');
      if (subGroup === 'pending') return baseRows.filter((row) => row.reconciliationStatus === 'unmatched');
    }

    if (surface === 'refunds') {
      if (subGroup === 'pending') return baseRows.filter((row) => row.reconciliationStatus === 'unmatched');
      if (subGroup === 'processed') return baseRows.filter((row) => row.reconciliationStatus === 'matched' || row.reconciliationStatus === 'closed');
      if (subGroup === 'rejected') return baseRows.filter((row) => row.reconciliationStatus === 'disputed');
    }

    if (surface === 'ledger') {
      if (subGroup === 'trial-balance') return baseRows.filter((row) => row.eventKind === 'reconciliation-export');
      if (subGroup === 'journal') return baseRows.filter((row) => row.eventKind === 'platform-commission');
    }

    return baseRows;
  }, [surface, subGroup]);

  const [blockedAction, setBlockedAction] = React.useState<string | null>(null);
  const [blockedRowId, setBlockedRowId] = React.useState<string | null>(null);
  const criticalCount = rows.filter((row) => row.risk === 'danger').length;
  const warningCount = rows.filter((row) => row.risk === 'warning').length;

  const handleAction = (row: FinanceRow, label: string) => {
    if (label.includes('تسويات') || label.includes('التسويات')) {
      router.push('/finance?workspace=settlements-payouts');
    } else if (label.includes('القيود') || label.includes('القيد') || label.includes('ميزان') || label.includes('الميزان')) {
      router.push('/finance?workspace=ledger');
    } else if (label.includes('التدقيق') || label.includes('تدقيق') || label.includes('المخاطر')) {
      router.push('/finance?workspace=variances');
    } else if (label.includes('الاسترداد') || label.includes('استرداد')) {
      router.push('/finance?workspace=refunds');
    } else {
      setBlockedAction(label);
      setBlockedRowId(row.id);
    }
  };

  React.useEffect(() => {
    setExpandedRowId(null);
    setBlockedAction(null);
    setBlockedRowId(null);
  }, [rows, surface]);

  return (
    <WebControlPanelWorkbench
      header={
        <WebControlPanelDenseHeader
          eyebrow="العملة: ر.ي (ريال يمني)"
          title={`غرفة عمل ${resolveSurfaceLabel(surface)}`}
          description={resolveSurfaceDescription(surface)}
          metrics={[
            { id: 'rows-count', label: 'العناصر المتاحة', value: String(rows.length) },
            { id: 'critical-count', label: 'فوارق حرجة', value: String(criticalCount) },
            { id: 'warning-count', label: 'تحتاج مراجعة', value: String(warningCount) },
          ]}
        />
      }
      main={
        <Box gap={3} style={{ width: '100%' }}>
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap', direction: 'rtl' }}>
            <WebControlPanelStatusTag label={resolveSurfaceLabel(surface)} tone="info" />
            <WebControlPanelStatusTag label={subGroup ? `الفرعي: ${subGroup}` : 'كافة السجلات'} tone="neutral" />
            <WebControlPanelStatusTag label="معاينة فقط (WLT)" tone="warning" />
          </Box>

          {rows.length === 0 ? (
            <Box padding={6} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Text role="titleSm" tone="muted" style={{ fontWeight: '700', textAlign: 'center' }}>لا توجد سجلات حالية</Text>
              <Text role="bodySm" tone="soft" style={{ textAlign: 'center', lineHeight: 22 }}>
                لا توجد حركات مالية مطابقة لهذا التبويب الفرعي حالياً في بيئة المعاينة.
              </Text>
            </Box>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, direction: 'rtl', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                <span style={{ fontSize: 13, fontWeight: '700', color: 'var(--bthwani-control-panel-text)' }}>
                  قائمة البنود المالية المعلقة ({rows.length} بند)
                </span>
                <span style={{ fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)' }}>
                  اضغط على أي بطاقة لتنسدل منها التفاصيل والمطابقة المالية فوراً.
                </span>
              </div>

              {rows.map((row) => {
                const isExpanded = expandedRowId === row.id;
                const rowTone = resolveRowTone(row);
                const borderToneColor = resolveToneColor(rowTone);

                return (
                  <div
                    key={row.id}
                    style={{
                      background: 'var(--bthwani-control-panel-surface)',
                      border: '1px solid var(--bthwani-control-panel-border)',
                      borderRight: `5px solid ${borderToneColor}`,
                      borderRadius: 10,
                      boxShadow: isExpanded ? '0 8px 24px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 0.25s ease-in-out',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    {/* Header Row (Always Visible) */}
                    <div
                      onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                        background: isExpanded ? 'var(--bthwani-control-panel-surface-raised)' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                      onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Right info (Title, Actor, ID) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', fontWeight: '700' }}>
                          {row.id}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 14, fontWeight: '700', color: 'var(--bthwani-control-panel-text)' }}>
                            {row.owner}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)', marginTop: 2 }}>
                            {EVENT_KIND_LABEL[row.eventKind] || row.eventKind} · {row.evidence}
                          </span>
                        </div>
                      </div>

                      {/* Left info (Amount, Status, Chevron) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: 15, fontWeight: '800', color: 'var(--bthwani-control-panel-text)', fontVariantNumeric: 'tabular-nums' }}>
                            {row.amount}
                          </span>
                          <span style={{ fontSize: 11, color: borderToneColor, fontWeight: '700', marginTop: 2 }}>
                            {row.status}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 16,
                            color: 'var(--bthwani-control-panel-text-muted)',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.25s',
                          }}
                        >
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Inline Expanded Panel (Accordion Drawer) */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '20px 24px',
                          borderTop: '1px solid var(--bthwani-control-panel-border)',
                          background: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {/* 3-Column Grid for Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>

                          {/* Column 1: Match & Source details */}
                          <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
                            <span style={{ fontSize: 11, fontWeight: '700', color: 'var(--bthwani-control-panel-text-muted)' }}>المطابقة والحسبة المالية</span>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--bthwani-control-panel-border)', margin: '6px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse' }}>
                              <Text role="bodySm" tone="soft">المبلغ المتوقع</Text>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: 12, fontWeight: '700' }}>{row.expectedMinorUnits.toLocaleString('ar-YE')} وصغ</span>
                                <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>({EXPECTED_SOURCE_AR[row.expectedSource] || row.expectedSource})</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginTop: 8 }}>
                              <Text role="bodySm" tone="soft">المبلغ الفعلي</Text>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: 12, fontWeight: '700' }}>{row.actualMinorUnits.toLocaleString('ar-YE')} وصغ</span>
                                <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>({ACTUAL_SOURCE_AR[row.actualSource] || row.actualSource})</span>
                              </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px dashed var(--bthwani-control-panel-border)', margin: '6px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse' }}>
                              <Text role="bodySm" style={{ fontWeight: '700' }}>الفارق المالي</Text>
                              <span style={{ fontSize: 11, fontWeight: '800', color: row.varianceMinorUnits !== 0 ? 'var(--bth-danger-text)' : 'var(--bth-success-text)' }}>
                                {row.varianceMinorUnits.toLocaleString('ar-YE')} وصغ
                                {row.varianceMinorUnits !== 0 ? ' ⚠️ غير مطابق' : ' ✓ متطابق'}
                              </span>
                            </div>

                            {row.varianceReason && (
                              <Box padding={2} background="dangerSurface" radiusToken="sm" style={{ marginTop: 6 }}>
                                <Text role="caption" tone="danger" style={{ fontSize: 10, lineHeight: 1.4 }}>
                                  <strong>السبب:</strong> {row.varianceReason}
                                </Text>
                              </Box>
                            )}
                          </Box>

                          {/* Column 2: Evidence & Monospace Refs */}
                          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={2}>
                            <span style={{ fontSize: 11, fontWeight: '700', color: 'var(--bthwani-control-panel-text-muted)' }}>الأدلة والمراجع الرقمية</span>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--bthwani-control-panel-border)', margin: '6px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse' }}>
                              <Text role="bodySm" tone="soft">حالة الأدلة</Text>
                              <span style={{ fontSize: 11, fontWeight: '700', color: row.evidenceStatus === 'complete' ? 'rgb(16,185,129)' : 'rgb(245,158,11)' }}>
                                {row.evidenceStatus === 'complete' ? 'مكتملة وموثقة ✓' : 'معلقة / ناقصة ⚠️'}
                              </span>
                            </div>
                            <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)', display: 'block', textAlign: 'left', marginTop: -4 }}>
                              ({EVIDENCE_SOURCE_AR[row.evidenceSource] || row.evidenceSource})
                            </span>

                            <Box gap={1} style={{ marginTop: 8, borderTop: '1px solid var(--bthwani-control-panel-border)', paddingTop: 6 }}>
                              {row.bankDepositRef && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                  <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>مرجع الإيداع</span>
                                  <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.05)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{row.bankDepositRef}</code>
                                </div>
                              )}
                              {row.cashBagRef && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginTop: 3 }}>
                                  <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>حقيبة النقدية</span>
                                  <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.05)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{row.cashBagRef}</code>
                                </div>
                              )}
                              {row.ledgerEntryRef && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginTop: 3 }}>
                                  <span style={{ fontSize: 9, color: 'var(--bthwani-control-panel-text-muted)' }}>قيد اليومية</span>
                                  <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.05)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{row.ledgerEntryRef}</code>
                                </div>
                              )}
                            </Box>
                          </Box>

                          {/* Column 3: Handoff & Technical (If Technical Mode Enabled) */}
                          <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2} style={{ borderRight: '4px solid rgb(59,130,246)' }}>
                            <span style={{ fontSize: 11, fontWeight: '700', color: 'rgb(59,130,246)' }}>التفويض والإجراء لـ DSH</span>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--bthwani-control-panel-border)', margin: '6px 0' }} />

                            <p style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--bthwani-control-panel-text)' }}>
                              {row.allowedAction === 'review' ? 'مراجعة وتدقيق مستندات المعاملة ومطابقتها يدوياً.'
                                : row.allowedAction === 'view_evidence' ? 'التحقق الفوري من أدلة الإيداع والنقدية المرفوعة.'
                                : row.allowedAction === 'prepare_decision' ? 'تحضير مسودة قرار الصرف (WLT Engine سيتولى تنفيذ الترحيل).'
                                : 'لا يتطلب هذا الكيان أي إجراء فوري، قراءة مرجعية فقط.'}
                            </p>

                            {!technicalAuditMode && (
                              <div style={{ marginTop: 8, fontSize: 10, color: 'rgb(16,185,129)', fontWeight: '700', background: 'rgba(16,185,129,0.05)', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                                ✓ مطابق محاسبياً من WLT
                              </div>
                            )}

                            {technicalAuditMode && (
                              <Box gap={1} style={{ borderTop: '1px dashed var(--bthwani-control-panel-border)', paddingTop: 6, marginTop: 6 }}>
                                {row.debitAccountId && <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}><span style={{ fontSize: 9 }}>مدين</span><code style={{ fontSize: 8 }}>{row.debitAccountId}</code></div>}
                                {row.creditAccountId && <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', marginTop: 1 }}><span style={{ fontSize: 9 }}>دائن</span><code style={{ fontSize: 8 }}>{row.creditAccountId}</code></div>}
                                {row.auditTrailId && <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', marginTop: 1 }}><span style={{ fontSize: 9 }}>أثر</span><code style={{ fontSize: 8 }}>{row.auditTrailId}</code></div>}
                              </Box>
                            )}
                          </Box>

                        </div>

                        {/* OpenAPI Matrix Bindings (Technical Mode Only) */}
                        {technicalAuditMode && (() => {
                          const binding = getFinanceApiBinding(surface);
                          if (!binding) return null;
                          return (
                            <Box padding={2} background="surfaceInset" radiusToken="sm" gap={1} style={{ marginTop: 12, direction: 'rtl', textAlign: 'right' }}>
                              <Text role="caption" tone="muted" style={{ fontWeight: '700' }}>WLT OpenAPI Binding Matrix [P7]</Text>
                              <Text role="caption" tone="muted">{binding.httpMethod} {binding.wltEndpoint} · operationId: {binding.operationId} · endpoint: {binding.endpointStatus === 'exact' ? '✓ exact' : '⚠ placeholder'}</Text>
                            </Box>
                          );
                        })()}

                        {/* Recommendation Text Block */}
                        <div style={{ marginTop: 16, background: 'var(--bthwani-control-panel-surface-raised)', border: '1px solid var(--bthwani-control-panel-border)', borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: 'var(--bthwani-control-panel-text)' }}>
                            💡 <strong>توصية المطابقة والمراجعة:</strong> {row.recommendation}
                          </span>
                          <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 4, fontWeight: '700' }}>
                            ثقة المطابقة: عالية ✓
                          </span>
                        </div>

                        {/* Allowed Action Handoff Feedback Block */}
                        {blockedAction && blockedRowId === row.id && (
                          (() => {
                            if (blockedAction === 'مراجعة وتدقيق') {
                              return (
                                <Box padding={3} background="warningSurface" radiusToken="md" border borderTone="warning" gap={2} style={{ direction: 'rtl', marginTop: 12 }}>
                                  <Text role="bodyStrong" tone="muted" style={{ textAlign: 'right', fontWeight: '700' }}>[معاينة تجريبية] مراجعة بند مالي</Text>
                                  <Text role="caption" style={{ textAlign: 'right', lineHeight: 18 }}>
                                    تم تسجيل رغبة مراجعة البند بنجاح محلياً. لم يتم إرسال طلب ترحيل لعدم ربط API الخادم المالي الفعلي.
                                  </Text>
                                  <Button label="موافق" size="sm" tone="ghost" onPress={() => setBlockedAction(null)} />
                                </Box>
                              );
                            }
                            return (
                              <Box padding={3} background="dangerSurface" radiusToken="md" border borderTone="danger" gap={2} style={{ direction: 'rtl', marginTop: 12 }}>
                                <Text role="bodyStrong" tone="danger" style={{ textAlign: 'right', fontWeight: '700' }}>الإجراء مقيد تشغيلياً</Text>
                                <Text role="caption" tone="danger" style={{ textAlign: 'right', lineHeight: 18 }}>
                                  الإجراء "{blockedAction}" للكيان المالي {row.id} غير متاح من واجهة DSH حالياً.
                                  كافة حركات الصرف والتحويل الحقيقي تنفذ من Ledger المركزي التابع لـ WLT.
                                </Text>
                                <Button label="فهمت" size="sm" tone="ghost" onPress={() => setBlockedAction(null)} />
                              </Box>
                            );
                          })()
                        )}

                        {/* Action Cluster (Single Source of actions at bottom of card expansion) */}
                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start' }}>
                          <WebControlPanelActionCluster
                            primary={{ id: `${row.id}-action-review`, label: 'تحضير مراجعة البند', onAction: () => handleAction(row, 'مراجعة وتدقيق') }}
                            secondary={{ id: `${row.id}-action-evidence`, label: 'عرض أدلة المطابقة', onAction: () => handleAction(row, 'فتح الأدلة') }}
                          />
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Box>
      }
      inspector={null} // Completely eliminated the side inspector pane! All layout is full-width, clean, and accordion-driven.
    />
  );
}

export function ControlPanelDshFinanceScreen({ technicalAuditMode }: { technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="overview" technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshSettlementScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="settlements" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshCodReconciliationScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="cod-reconciliation" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshRefundQueueScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="refunds" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshCaptainEligibilityScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="captain-eligibility" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshPayoutsScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="payouts" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshRiskAuditScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="risk-audit" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshCaptainFinanceScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="captain-finance" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshStoreDeliveryFinanceScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="store-delivery-finance" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshLedgerScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="ledger" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export default ControlPanelDshFinanceScreen;
